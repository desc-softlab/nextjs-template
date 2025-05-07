/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { SubmitBtn, TextAreaInputGroup, TextInputGroup } from "./InputGroups";
import { toast } from "sonner";
import { Dialog, DialogPanel } from "@headlessui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Prisma } from "@prisma/client";
import { FaShieldAlt } from "react-icons/fa";
import { createPermission, fetchPermissionById, updatePermission } from "@/actions/users/Permission";

const PermissionUpdateSelect = {name:true, id:true, description:true} satisfies Prisma.PermissionSelect;
type TPermissionUpdateSelect = Prisma.PermissionGetPayload<{select: typeof PermissionUpdateSelect}>;

export const PermissionForm = ({id,onComplete}:{id?:string, onComplete:() => void}) => {
     const [permission,setPermission] = useState<TPermissionUpdateSelect | null>(null);
     const [loading,setLoading] = useState(false);

     useEffect(() => {
          (async () => {
               const [permissionRes] = await Promise.all([
                    id ? fetchPermissionById(id, PermissionUpdateSelect) : null
               ]);
               if(permissionRes) {
                    setPermission(permissionRes);
               }
          })(); 
     },[id]);

     const submitForm = async (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               const data = new FormData(event.currentTarget);
               const name = String(data.get("name"));
               const description = String(data.get("description"));

               if(!permission) {
                    if(!name) return toast.warning("Name cannot be empty");
                    if(!description) return toast.warning("Please add some description");
                    
                    const res = await createPermission({name,description, createdAt:new Date(), updatedAt: new Date(), })
                    if(res) {
                         toast.success("Success", {description: "Permission has been created successfully"});
                         return onComplete();
                    }else return toast.error("Error", {description: "Permission creation failed. Try Again."})
               }

               const update = await updatePermission(permission.id,{
                    name: name || permission.name,updatedAt: new Date(), description: description || permission.description
               });
               if(update) {
                    toast.success("Success", {description: "Permission has been updated successfully"});
                    return onComplete();
               }else return toast.error("Error", {description: "Permission update failed. Try Again."})

          } catch (error) {
               toast.error("Application Error", {description: "Error saving permission information. Try again."})
          }finally{
               setLoading(false);
          }
     }
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[16px]">
               <div className="w-full flex flex-col items-center justify-start gap-[8px]">
                    <h3 className="text-[1.6rem] flex items-center justify-center gap-[8px] font-bold text-blue-800"><FaShieldAlt size={24} className="text-gray-700" />{id ? "Edit Permission" : "New Permission Account"}</h3>
                    <p className="text-[0.9rem] text-gray-600">Fill the form below</p>
               </div>
               <form onSubmit={submitForm} className="w-full flex flex-col items-center justify-start gap-[12px]">
                    <TextInputGroup required={permission ? false : true} defaultValue={permission?.name || ""} name="name" label="Permission Name:"  placeholder="Enter permission name..." type="text" />
                    <TextAreaInputGroup name="description" label="Description" maxWords={50} placeholder="Enter permission description" defaultValue={permission?.description || ""} required={permission ? false : true}  />
                    <SubmitBtn name={loading ? "Saving..." :"Save Permission"}  disabled={loading} />
               </form>
          </div>
     )
}

export const PermissionFormToggle = ({permissionId, className,name, icon}:{permissionId?:string, name?:string, icon?:ReactNode, className:string }) => {
     const [open,setOpen] = useState(false);

     if(!open) return <button type="button" onClick={() => setOpen(true)} className={className}>{icon? icon : null} {name ? name : ""}</button>

     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center ">
               <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-end gap-[8px]">
                         <IoMdCloseCircleOutline size={32} className="text-red-600 cursor-pointer" onClick={() => setOpen(false)} />
                    </div>
                    <PermissionForm id={permissionId} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
} 
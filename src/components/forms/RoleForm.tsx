/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { SelectInputGroup, SubmitBtn, TextInputGroup } from "./InputGroups";
import { toast } from "sonner";
import { Dialog, DialogPanel } from "@headlessui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { Prisma } from "@prisma/client";
import { FaShieldAlt } from "react-icons/fa";
import { X } from "lucide-react";
import { createRole, fetchRoleById, updateRole } from "@/actions/users/Role";
import { fetchPermissions } from "@/actions/users/Permission";

const RoleUpdateSelect = {name:true, id:true, permissions: {select: {name:true, id:true}}} satisfies Prisma.RoleSelect;
type TRoleUpdateSelect = Prisma.RoleGetPayload<{select: typeof RoleUpdateSelect}>;


const PermissionSelect = {name:true, id:true} satisfies Prisma.PermissionSelect;
type TPermissionSelect = Prisma.PermissionGetPayload<{select: typeof PermissionSelect}>;


export const RoleForm = ({id,onComplete}:{id?:string, onComplete:() => void}) => {
     const [role,setRole] = useState<TRoleUpdateSelect | null>(null);
     const [loading,setLoading] = useState(false);
     const [permissions,setPermissions] = useState<TPermissionSelect[]>([])
     const [selectedPermissions,setSelectedPermissions] = useState<TPermissionSelect[]>([])

     const handleSelect = (value: string) => {
          const selected = permissions.find((p) => String(p.id) === value)
          if (!selected) return
     
          // Move from categories to selectCategories
          setPermissions((prev) => prev.filter((p) => p.id !== selected.id))
          setSelectedPermissions((prev) => [...prev, selected]);
     }
     
     const handleRemove = (id: string) => {
          const removed = selectedPermissions.find((p) => p.id === id)
          if (!removed) return
          
          // Move back to categories
          setSelectedPermissions((prev) => prev.filter((p) => p.id !== id))
          setPermissions((prev) => [...prev, removed])
     }

     useEffect(() => {
          (async () => {
               const [roleRes,permissionsRes] = await Promise.all([
                    id ? fetchRoleById(id, RoleUpdateSelect) : null,
                    fetchPermissions(PermissionSelect)
               ]);
               setPermissions(permissionsRes.data);

               if(roleRes) {
                    setRole(roleRes);
                    setSelectedPermissions(roleRes.permissions);
               }
          })(); 
     },[id]);

     const submitForm = async (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               const data = new FormData(event.currentTarget);
               const name = String(data.get("name"));

               if(!role) {
                    if(!name) return toast.warning("Name cannot be empty");
                    
                    const res = await createRole({name, createdAt:new Date(), updatedAt: new Date(),
                         permissions: {connect: selectedPermissions.map(p => ({id:p.id}))}
                    });
                    if(res) {
                         toast.success("Success", {description: "Role has been created successfully"});
                         return onComplete();
                    }else return toast.error("Error", {description: "Role creation failed. Try Again."})
               }

               const update = await updateRole(role.id,{
                    name: name || role.name,updatedAt: new Date(),
                    permissions: {deleteMany: {},connect: selectedPermissions.map(p => ({id:p.id}))}
               });
               if(update) {
                    toast.success("Success", {description: "Role has been updated successfully"});
                    return onComplete();
               }else return toast.error("Error", {description: "Role update failed. Try Again."})

          } catch (error) {
               toast.error("Application Error", {description: "Error saving role information. Try again."})
          }finally{
               setLoading(false);
          }
     }
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[16px]">
               <div className="w-full flex flex-col items-center justify-start gap-[8px]">
                    <h3 className="text-[1.6rem] flex items-center justify-center gap-[8px] font-bold text-blue-800"><FaShieldAlt size={24} className="text-gray-700" />{id ? "Edit Role" : "New Role Account"}</h3>
                    <p className="text-[0.9rem] text-gray-600">Fill the form below</p>
               </div>
               <form onSubmit={submitForm} className="w-full flex flex-col items-center justify-start gap-[12px]">
                    <TextInputGroup required={role ? false : true} defaultValue={role?.name || ""} name="name" label="role Name:"  placeholder="Enter role name..." type="text" />
                    <div className="w-full flex items-center justify-start gap-[8px] flex-wrap">
                         {
                              selectedPermissions.map(p => <span className="w-auto text-[0.8rem] p-[4px] rounded-[4px] bg-blue-100 text-blue-800 inline-flex items-center gap-[4px]" key={`select-category-${p.id}`}>{p.name} <X size={14} onClick={() => handleRemove(p.id)} /></span>)
                         }
                    </div>
                    <SelectInputGroup action={res => handleSelect(String(res))} required={false} name="permission" label={`Permissions: `} values={permissions.map(p => ({label: p.name, value: String(p.id)}))}   />
                    <SubmitBtn name={loading ? "Saving..." :"Save Role"}  disabled={loading} />
               </form>
          </div>
     )
}

export const RoleFormToggle = ({roleId, className,name, icon}:{roleId?:string, name?:string, icon?:ReactNode, className:string }) => {
     const [open,setOpen] = useState(false);

     if(!open) return <button type="button" onClick={() => setOpen(true)} className={className}>{icon? icon : null} {name ? name : ""}</button>

     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center ">
               <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-end gap-[8px]">
                         <IoMdCloseCircleOutline size={32} className="text-red-600 cursor-pointer" onClick={() => setOpen(false)} />
                    </div>
                    <RoleForm id={roleId} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
} 
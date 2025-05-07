/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { EUserStatus, EUserType, Prisma } from "@prisma/client";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { MdAdminPanelSettings, MdDelete } from "react-icons/md";
import { PasswordInputGroup, SelectInputGroup, SubmitBtn, TextInputGroup } from "./InputGroups";
import { toast } from "sonner";
import { deleteSingleImage } from "@/util/s3Helpers";
import Image from "next/image";
import ImageUploader from "../upload/ImageUploader";
import { EAspectRatio } from "@/common/enums";
import { Dialog, DialogPanel } from "@headlessui/react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { fetchRoles } from "@/actions/users/Role";
import { createAdmin, fetchAdminById, updateAdmin } from "@/actions/users/Admin";
import { createUser } from "@/actions/users/User";

const AdminUpdateSelect = {name:true, id:true, Role: {select: {name:true, id:true}}, user:{select: {email:true, image:true,status:true, }}} satisfies Prisma.AdminSelect;
type TAdminUpdateSelect = Prisma.AdminGetPayload<{select: typeof AdminUpdateSelect}>;

const RoleSelect = {name:true, id:true} satisfies Prisma.RoleSelect;
type TRoleSelect = Prisma.RoleGetPayload<{select: typeof RoleSelect}>;


export const AdminForm = ({id,onComplete}:{id?:string, onComplete:() => void}) => {
     const [roles,setRoles] = useState<TRoleSelect[]>([]);
     const [admin,setAdmin] = useState<TAdminUpdateSelect | null>(null);
     const [image,setImage] = useState("");
     const [loading,setLoading] = useState(false);

     useEffect(() => {
          (async () => {
               const [rolesRes, adminRes] = await Promise.all([
                    fetchRoles(RoleSelect),
                    id ? fetchAdminById(id, AdminUpdateSelect) : null
               ]);
               setRoles(rolesRes.data);
               if(adminRes) {
                    setAdmin(adminRes);
                    setImage(adminRes.user.image);
               }
          })(); 
     },[id]);

     const deleteImage = async (image:string) => {
          toast.warning("Deleting image...");
          try {
               await deleteSingleImage(image);
               setImage("");
               return toast.success("Image deleted successfully");
          } catch (error) {
               console.log(error);
               toast.error("Error deleting the image!!")
          }
     }
     const submitForm = async (event: ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
               setLoading(true);
               const data = new FormData(event.currentTarget);
               const name = String(data.get("name"));
               const email = String(data.get("email"));
               const password = String(data.get("password"));
               const role = String(data.get("role"));
               const status = data.get("role") as EUserStatus;

               if(!admin) {
                    if(!name) return toast.warning("Name cannot be empty");
                    if(!email) return toast.warning("Email cannot be empty");
                    if(!password) return toast.warning("Password cannot be empty");
                    if(!role) return toast.warning("Please select a role");
                    if(!status) return toast.warning("Please select status");
                    const newUser = await createUser({email, password, image, status, createdAt:new Date(), updatedAt: new Date(), type: EUserType.ADMIN});
                    if(newUser) {
                         const newAdmin = await createAdmin({name, createdAt: new Date(), updatedAt: new Date(),Role: {connect: {id: role}}, user: {connect: {id: newUser.id}}});
                         if(newAdmin) {
                              toast.success("Success", {description: "Admin account has been created successfully"});
                              return onComplete();
                         }
                         else return toast.error("Error", {description: "Account creation failed"});
                    }
                    return toast.error("Error", {description: "Please try again or contact support!"})
               }

               const update = await updateAdmin(admin.id,{
                    name: name || admin.name,updatedAt: new Date(), 
                    Role: {connect: {id: role || admin.Role!.id}},
                    user: {update:{email: email || admin.user.email, image,password: password, status: status || admin.user.status, updatedAt: new Date()}}
               });
               if(update) {
                    toast.success("Success", {description: "Admin account has been updated successfully"});
                    return onComplete();
               }else return toast.error("Error", {description: "Account update failed. Try Again."})

          } catch (error) {
               toast.error("Application Error", {description: "Error saving Admin information. Try again."})
          }finally{
               setLoading(false);
          }
     }
     return(
          <div className="w-full flex flex-col items-center justify-start gap-[16px]">
               <div className="w-full flex flex-col items-center justify-start gap-[8px]">
                    <h3 className="text-[1.6rem] flex items-center justify-center gap-[8px] font-bold text-blue-800"><MdAdminPanelSettings size={24} className="text-gray-700" />{id ? "Edit Admin Account" : "New Admin Account"}</h3>
                    <p className="text-[0.9rem] text-gray-600">Fill the form below</p>
               </div>
               <form onSubmit={submitForm} className="w-full flex flex-col items-center justify-start gap-[12px]">
                    <TextInputGroup required={admin ? false : true} defaultValue={admin?.name || ""} name="name" label="Admin Name:"  placeholder="Enter admin name..." type="text" />
                    <SelectInputGroup required={admin ? false : true} name="role" label={`Role: ${admin?.Role?.name || ""} `} values={roles.map(r => ({label: r.name, value: String(r.id)}))}   />
                    <SelectInputGroup required={admin ? false : true} name="status" label={`Status: ${admin?.user.status || ""} `} values={Object.values(EUserStatus).map(s => ({label: s, value: s}))}   />
                    <TextInputGroup required={admin ? false : true} defaultValue={admin?.user.email|| ""} name="email" label="Email:"  placeholder="Enter email..." type="email" />
                    <PasswordInputGroup type="password" name="password" placeholder="enter a password" label="Password" />
                    <div className="w-full flex flex-col items-start gap-2 ">
                         {
                              image ? 
                              <div className="w-full flex flex-col items-center justify-start gap-[5px] relative">
                                   <Image  width={400} height={300} src={image} alt="Listing-update image" className="w-[200px] rounded-[5px] aspect-auto" />
                                   <button type='button' title="Delete image" className="text-red-700 hover:text-red-600 text-[20px] absolute top-0 right-0 bg-gray-100 rounded-[2.5px] p-[2px] cursor-pointer" onClick={async() => await deleteImage(image)}>
                                        <MdDelete/>
                                   </button>
                                   <h4 className="text-[0.8rem] text-gray-500 text-center w-full">Logo</h4>
                              </div>:
                              <ImageUploader aspect={EAspectRatio.STANDARD} name="Upload Admin Image" onUploadComplete={res => setImage(res)} />
                         }
                         
                    </div>
                    <SubmitBtn name={loading ? "Saving..." :"Save Admin"}  disabled={loading} />
               </form>
          </div>
     )
}

export const AdminFormToggle = ({adminId, className,name, icon}:{adminId?:string, name?:string, icon?:ReactNode, className:string }) => {
     const [open,setOpen] = useState(false);

     if(!open) return <button type="button" onClick={() => setOpen(true)} className={className}>{icon? icon : null} {name ? name : ""}</button>

     return (
          <Dialog open={open} onClose={() => {}} className="relative z-50">
               <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center ">
               <DialogPanel className="bg-white p-6 rounded-lg shadow-lg w-[90vw] lg:w-[40%] max-h-[90%] overflow-y-auto flex flex-col items-center justify-start gap-[10px]" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-end gap-[8px]">
                         <IoMdCloseCircleOutline size={32} className="text-red-600 cursor-pointer" onClick={() => setOpen(false)} />
                    </div>
                    <AdminForm id={adminId} onComplete={() => setOpen(false)} />
               </DialogPanel >
               </div>
          </Dialog>
     )
} 
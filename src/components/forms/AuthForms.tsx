/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { GoogleSignIn } from "@/actions/users/auth";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export const AuthTextInput = ({label, type, name, placeholder,action}:{label: string,type?:string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-[5px]">
               <label className="text-[0.9rem] font-bold text-gray-700" htmlFor={name}>{label}</label>
               <input className="outline-none py-[5px] placeholder:text-[0.8rem] placeholder:text-gray-600 px-[10px] text-[0.9rem] text-gray-600 bg-gray-50 border-[1.3px] border-gray-300 rounded-[5px] w-full  " type={type || "text"} name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
          </div>
     )
}

export const AuthPasswordInput = ({label, name, placeholder,action}:{label: string, name:string, placeholder: string, action?:(res:string)=> unknown }) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full flex flex-col items-start justify-normal gap-[5px]">
               <label className="text-[0.9rem] font-bold text-gray-700" htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <input className="outline-none py-[5px] placeholder:text-[0.8rem] placeholder:text-gray-600 px-[10px] text-[0.9rem] text-gray-600 bg-gray-50 border-[1.3px] border-gray-300 rounded-[5px] w-full  " type={showPassword ? "text":"password"} name={name} id={name} placeholder={placeholder} onChange={e => action ?  action(e.target.value) : null}  />
                    {
                         !showPassword ? 
                         <i className="text-gray-500 text-[16px] absolute right-[5px] top-[50%] -translate-y-[50%] cursor-pointer hover:text-gray-700 " onClick={() => setShowPassword(true)}><FaEye /></i>
                         :
                         <i className="text-gray-500 text-[16px] absolute right-[5px] top-[50%] -translate-y-[50%] cursor-pointer hover:text-gray-700 " onClick={() => setShowPassword(false) } ><FaEyeSlash /></i>
                    }
               </div>
          </div>
     )
}

export const AuthSubmitBtn = ({name, loading}:{name:string, loading: boolean}) => {
     return (
          <button type="submit" disabled={loading} className="w-full p-[5px] py-[10px] rounded-[5px] text-[0.9rem] font-medium text-white outline-none bg-blue-600 hover:bg-blue-800 disabled:bg-gray-600 transition-all duration-200 ">{name}</button>
     )
} 

export const GoogleSignBtn = () => {
     const [loading, setLoading] = useState(false);
     const signIn = async() => {
          try {
               setLoading(true);
               return await GoogleSignIn();
          } catch (error) {
               toast.error("Error logging with Google!");
          }finally{
               setLoading(false);
          }
     }
     return (
          <button disabled={loading} type="button" onClick={signIn} className="w-full flex items-center justify-center gap-[10px] rounded-[30px] p-[10px] bg-gradient-to-br from-blue-600 to-blue-800 transition-all duration-200 disabled:cursor-progress">
               <i className="text-[28px]"><FcGoogle /></i>
               {loading ? null :<span className="text-[0.9rem] text-white">Continue with Google</span>}
          </button>
     )
}
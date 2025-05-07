/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ChangeEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export const TextInputGroup = ({type="text",label, placeholder,name, required=true, action}:{label: string, placeholder:string, name:string, required?: boolean, type:string, action?:(e:string | number) => unknown}) => {
     return (
          <div className="w-full  flex flex-col items-start gap-[5px]">
               <label className="w-full rounded-[5px] text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
               <input type={type} className=" w-full text-[0.8rem] rounded-[5px] text-gray-900 border border-gray-400 bg-gray-200 outline-none py-[7.5px] px-[10px]" name={name} id={name} placeholder={placeholder} required={required} onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} />
          </div>
     )
}

export const TextAreaInputGroup = ({label, placeholder,name, required=true, action, maxWords,defaultValue}:{label: string, placeholder:string, name:string, required?: boolean, action?:(e:string | number) => unknown, maxWords:number,defaultValue?:string}) => {
     
     const [wordCount, setWordCount] = useState(0);
     const [text, setText] = useState("");

     const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          const inputText = e.target.value;
          const words = inputText.trim().split(/\s+/).filter(Boolean);
          
          if (words.length <= maxWords) {
            setText(inputText);
            setWordCount(words.length);
            if (action) action(inputText);
          }
        };
     return (
          <div className="w-full  flex flex-col items-start gap-[5px]">
               <div className="w-full flex items-center justify-start gap-[10px]">
                    <label className="w-full rounded-[5px] text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
                    <span className="text-gray-600 text-xs mt-1 whitespace-nowrap">
                    {wordCount} / {maxWords} words
                    </span>
               </div>
               <textarea name={name} id={name} required={required} defaultValue={defaultValue}  onChange={handleChange} className=" w-full text-[0.8rem] rounded-[5px] text-gray-900 border border-gray-400 bg-gray-200 outline-none py-[7.5px] px-[10px] resize-none" placeholder={placeholder} ></textarea>
          </div>
     )
}
export const PasswordInputGroup = ({label, placeholder,name, required=true, action}:{label: string, placeholder:string, name:string, required?: boolean, type:string, action?:(e:string | number) => unknown}) => {
     const [showPassword, setShowPassword] = useState<boolean>(false);
     return (
          <div className="w-full  flex flex-col items-start gap-[5px]">
               <label className="w-full rounded-[5px] text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
               <div className="w-full relative">
                    <input type={showPassword ? 'text' :"password"} className=" w-full text-[0.8rem] rounded-[5px] text-gray-900 border border-gray-400 bg-gray-200 outline-none py-[7.5px] px-[10px]" name={name} id={name} placeholder={placeholder} required={required} onChange={(e:ChangeEvent<HTMLInputElement>) => action ? action(e.target.value) : () =>{}} />
                    <i onClick={()=> setShowPassword(prev => !prev)} className="absolute top-[50%] -translate-y-[50%] right-[2px] text-gray-700 cursor-pointer " >{showPassword ? <FaEye /> : <FaEyeSlash />}</i>
               </div>
          </div>
     )
}

export const SelectInputGroup = ({label, name, required=true,values, action}:{label: string, name:string, required?: boolean, values: Array<{label:string, value:string | number}>, action?: (res:string) => unknown}) => {
     return (
          <div className="w-full flex flex-col items-start gap-[5px]">
               <label className="text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
               <select onChange={(e:ChangeEvent<HTMLSelectElement>) => action ? action(e.target.value) : () => {}}  className=" w-full rounded-[5px] text-[0.8rem] text-gray-900 border border-gray-400 bg-gray-200 outline-none py-[9.5px] px-[10px]" name={name} id={name} required={required}>
                    <option value="">Select {name}</option>
                    {
                         values.map((item, index) => <option key={`${name}-${index}`} value={item.value} >{item.label}</option>)
                    }
               </select>
          </div>
     )
}

export const CheckInputGroup = ({label, placeholder,name, required=true, action}:{label: string, placeholder:string, name:string, required?: boolean, action?: (res:boolean) => void}) => {
     return (
          <div className="w-full flex  items-center gap-[5px]">
               <label className="text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
               <input type="checkbox" className="text-[0.8rem] text-gray-900 border border-gray-400 bg-gray-200 outline-none" name={name} id={name} placeholder={placeholder} required={required} onChange={e =>action ? action(e.target.checked) : () => {}} />
          </div>
     )
}

export const RadioInputGroup = ({label, name, required=true}:{label: string,  name:string, required?: boolean}) => {
     return (
          <div className="w-full flex  items-center gap-[5px]">
               <label className="text-[0.8rem] font-medium text-gray-800" htmlFor={name}>{label}</label>
               <input type="checkbox" className="text-[0.8rem] text-gray-900 border border-gray-400 bg-gray-200 outline-none" name={name} id={name} required={required} />
          </div>
     )
}

export const SubmitButton = ({label, loading, loadText}:{label:string,loading: boolean, loadText:string}) => {
     return (
          <button type="submit" className="w-full text-[0.9rem] rounded-[5px] bg-blue-600 text-white py-[7.5px] px-[10px] hover:bg-blue-800 disabled:bg-gray-600" >{loading? loadText :label}</button>
     )
}
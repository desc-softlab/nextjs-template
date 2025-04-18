"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { RevalidatePages } from "../RevalidatePage";
import { cache } from "react";

export async function createAdmin(data: Prisma.AdminCreateInput) {
     try{
          const res = await prisma.admin.create({data});
          if(res) RevalidatePages.admin();
          return res;
     }catch(error){
          console.log("error creating Admin: ",error);
          return null;
     }
}

export async function updateAdmin (id:string, data:Prisma.AdminUpdateInput) {
     try {
          const res = await prisma.admin.update({where: {id}, data});
          if(res) RevalidatePages.admin();
          return res; 
     } catch (error) {
          console.log(`Error updating Admin with id: ${id}`, error);
          return null;
     }
}

export async function deleteAdmin (id:string) {
     try {
          const res = await prisma.admin.delete({where: {id}});
          if(res) RevalidatePages.admin();
          return res;
     } catch (error) {
          console.log("Error deleting Admin with id: ", id, error);
          return null;
     }
}

export const fetchAdmins = cache(async <T extends Prisma.AdminSelect>(selectType: T, search?: Prisma.AdminWhereInput, take:number = 20, skip:number = 0):Promise<{data: Prisma.AdminGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.admin.findMany({where: search, take, skip, select: selectType});
          const total = await prisma.admin.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Admins: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchAdminById = cache(async <T extends Prisma.AdminSelect>(id:string, selectType: T): Promise<Prisma.AdminGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.admin.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Admin data for id: ${id}`, error);
          return null;
     }
})
"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { RevalidatePages } from "../RevalidatePage";
import { cache } from "react";

export async function createPermission(data: Prisma.PermissionCreateInput) {
     try{
          const res = await prisma.permission.create({data});
          if(res) RevalidatePages.permission();
          return res;
     }catch(error){
          console.log("error creating Permission: ",error);
          return null;
     }
}

export async function updatePermission (id:string, data:Prisma.PermissionUpdateInput) {
     try {
          const res = await prisma.permission.update({where: {id}, data});
          if(res) RevalidatePages.permission();
          return res; 
     } catch (error) {
          console.log(`Error updating Permission with id: ${id}`, error);
          return null;
     }
}

export async function deletePermission (id:string) {
     try {
          const res = await prisma.permission.delete({where: {id}});
          if(res) RevalidatePages.permission();
          return res;
     } catch (error) {
          console.log("Error deleting Permission with id: ", id, error);
          return null;
     }
}

export const fetchPermissions = cache(async <T extends Prisma.PermissionSelect>(
     selectType: T, search?: Prisma.PermissionWhereInput, take:number = 20, skip:number = 0,
     orderBy: Prisma.PermissionOrderByWithRelationInput = { createdAt: 'desc' }
):Promise<{data: Prisma.PermissionGetPayload<{select: T}>[], pagination: {total:number}}> => {
try {
     const res = await prisma.permission.findMany({where: search, take, skip, select: selectType, orderBy});
     const total = await prisma.permission.count({where:search});
     return {data:res, pagination:{total}};
} catch (error) {
     console.log("Error fetching Permissions: ", error);
     return {data:[], pagination:{total:0}}
}
});

export const fetchPermissionById = cache(async <T extends Prisma.PermissionSelect>(id:string, selectType: T): Promise<Prisma.PermissionGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.permission.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Permission data for id: ${id}`, error);
          return null;
     }
})
"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { RevalidatePages } from "../RevalidatePage";
import { cache } from "react";

export async function createRole(data: Prisma.RoleCreateInput) {
     try{
          const res = await prisma.role.create({data});
          if(res) RevalidatePages.role();
          return res;
     }catch(error){
          console.log("error creating Role: ",error);
          return null;
     }
}

export async function updateRole (id:string, data:Prisma.RoleUpdateInput) {
     try {
          const res = await prisma.role.update({where: {id}, data});
          if(res) RevalidatePages.role();
          return res; 
     } catch (error) {
          console.log(`Error updating Role with id: ${id}`, error);
          return null;
     }
}

export async function deleteRole (id:string) {
     try {
          const res = await prisma.role.delete({where: {id}});
          if(res) RevalidatePages.role();
          return res;
     } catch (error) {
          console.log("Error deleting Role with id: ", id, error);
          return null;
     }
}

export const fetchRoles = cache(async <T extends Prisma.RoleSelect>(
     selectType: T, search?: Prisma.RoleWhereInput, take:number = 20, skip:number = 0,
     orderBy: Prisma.RoleOrderByWithRelationInput = { createdAt: 'desc' }
):Promise<{data: Prisma.RoleGetPayload<{select: T}>[], pagination: {total:number}}> => {
try {
     const res = await prisma.role.findMany({where: search, take, skip, select: selectType, orderBy});
     const total = await prisma.role.count({where:search});
     return {data:res, pagination:{total}};
} catch (error) {
     console.log("Error fetching Roles: ", error);
     return {data:[], pagination:{total:0}}
}
});

export const fetchRoleById = cache(async <T extends Prisma.RoleSelect>(id:string, selectType: T): Promise<Prisma.RoleGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.role.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching Role data for id: ${id}`, error);
          return null;
     }
})
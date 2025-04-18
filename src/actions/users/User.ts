"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { RevalidatePages } from "../RevalidatePage";
import { cache } from "react";

export async function createUser(data: Prisma.UserCreateInput) {
     try{
          const res = await prisma.user.create({data});
          if(res) RevalidatePages.user();
          return res;
     }catch(error){
          console.log("error creating user: ",error);
          return null;
     }
}

export async function updateUser (id:string, data:Prisma.UserUpdateInput) {
     try {
          const res = await prisma.user.update({where: {id}, data});
          if(res) RevalidatePages.user();
          return res; 
     } catch (error) {
          console.log(`Error updating user with id: ${id}`, error);
          return null;
     }
}

export async function deleteUser (id:string) {
     try {
          const res = await prisma.user.delete({where: {id}});
          if(res) RevalidatePages.user();
          return res;
     } catch (error) {
          console.log("Error deleting user with id: ", id, error);
          return null;
     }
}

export const fetchUsers = cache(async <T extends Prisma.UserSelect>(selectType: T, search?: Prisma.UserWhereInput, take:number = 20, skip:number = 0):Promise<{data: Prisma.UserGetPayload<{select: T}>[], pagination: {total:number}}> => {
     try {
          const res = await prisma.user.findMany({where: search, take, skip, select: selectType});
          const total = await prisma.user.count({where:search});
          return {data:res, pagination:{total}};
     } catch (error) {
          console.log("Error fetching Users: ", error);
          return {data:[], pagination:{total:0}}
     }
});

export const fetchUserById = cache(async <T extends Prisma.UserSelect>(id:string, selectType: T): Promise<Prisma.UserGetPayload<{select:T}> | null> => {
     try {
          const res= await prisma.user.findUnique({where:{id},select: selectType});
          return res;
     } catch (error) {
          console.log(`Error fetching user data for id: ${id}`, error);
          return null;
     }
})
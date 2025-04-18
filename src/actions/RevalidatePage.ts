import { revalidatePath } from "next/cache"

export const RevalidatePages = {
     user: () => {
          revalidatePath('/');
     },
     admin: () => {
          revalidatePath('/');
     },
     log: () => {
          revalidatePath('/');
     },
     role: () => {
          revalidatePath('/');
     },
     permission:() => {
          revalidatePath('/');
     }
}
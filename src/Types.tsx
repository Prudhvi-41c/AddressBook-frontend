
import {  z } from "zod";

export const AddressSchema=z.object({
    id:z.number().optional(),
    title:z.string().min(3,{
        message:"must be atleast 3 characters long"
    }),
    fullname:z.string().min(3,{
         message:" must be atleast 3 characters long"
    }).max(20),
    mobilenumber:z.number(),
    pincode:z.number(),
    area1:z.string().min(5,{
         message:"must be atleast 5 characters long"
    }),
    area2:z.string(),
    landmark:z.string(),
    city:z.string().min(3),
    state:z.string().min(3)
 
})

export type Address= z.infer<typeof AddressSchema>

// export type  Address ={
//     id?: number;
//     title: string;
//     fullname: string;
//     mobilenumber: number;
//     pincode: number;
//     area1: string;
//     area2: string;
//     landmark: string;
//     city: string;
//     state: string;
  
// }
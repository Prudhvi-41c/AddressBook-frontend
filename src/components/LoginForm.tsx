import * as React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { loginUser, loginUserSchema, User } from '@/types';
import { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"
import {ThreeDot} from "react-loading-indicators"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ILoginFormProps {
}

const LoginForm: React.FunctionComponent<ILoginFormProps> = (props) => {

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate=useNavigate()

   const [progress,setProgress]=React.useState(0)
  const [isSubmitting,setIsSubmitting]=React.useState(false)

    const {register, handleSubmit, formState:{errors}}=useForm<loginUser>({resolver:zodResolver(loginUserSchema)})

    const onSubmit:SubmitHandler<loginUser> = async (data)=>{
        setIsSubmitting(true)
        console.log(data);
        setProgress(13)

        try {

          const res=await axios.post(`${serverUrl}/api/loginUser`, data,{
            withCredentials:true
          })


          
          setTimeout(function(){

            if(res.data.data){
              setProgress(50)
              const userdata= res.data.data
              console.log(res.data.data)
              localStorage.setItem("userName",userdata.user_name);
              localStorage.setItem("userEmail",userdata.user_email);
              const now= new Date().getTime()
              localStorage.setItem("loginTime",now.toString())
              }

          },500)

          
          setTimeout(function(){
             setProgress(75)
            if(res.status === 200){
              navigate("/")
               toast(`welcome to the site ` ,{
                description:"Please add your addresses"
               } )
                     setTimeout( function(){
                        setProgress(100)
                        setIsSubmitting(false)
                      },2000)
            }

          },1000)




          
        } catch (error) {


          setTimeout(function(){
            if(error.status=== 401){
              toast(`Password is incorrect`,{
                position:"top-center",
                style:{backgroundColor: "#D32F2F", color: "white"},
                
              })   
            }
            if(error.status=== 500){
              toast(`email id do not exist`,{
                position:"top-center",
                style:{backgroundColor: "#D32F2F", color: "white"}
              })   
            }
            setProgress(0)
            setIsSubmitting(false)
            console.log(error);
            
          },1000)

        }   
    }

  const requiredLabel = (label: string) => (
    <span className="block text-sm ">
      {label} <span className="text-red-500">*</span>
    </span>
  );

return (
<>
        <form action="" onSubmit={handleSubmit(onSubmit)} className='font-medium'>
        <div className="grid grid-cols-1 gap-4"> 

            <div className="md:col-span-10 w-full">
            {requiredLabel("Email")}
            <Input 
                {...register("user_email")}
                type="text"
                placeholder="ex. prudhvi.narra@cimpress.com"
                className="mt-1 p-2 w-full"
            />
           {errors.user_email && <p className='text-red-500 font-light text-sm'>{errors.user_email?.message}</p>}
            </div>

            <div className="md:col-span-10 w-full">
            {requiredLabel("Password")}
            <Input 
                 {...register("user_password")}
                type='Password'
                placeholder=''
                className='mt-1 p-2 w-full'
            />
            {errors.user_password && <p className='text-red-500 font-light text-sm'>{errors.user_password.message}</p>}
            </div>

            <div className="md:col-span-2 flex justify-center items-center">
            <Button className="mx-auto  my-2 px-14 py-2">
                Submit
            </Button>

            </div>
            
        </div>

        <Dialog open={isSubmitting}>
             <DialogContent>
             <style>{`[data-state="open"] .absolute.right-4.top-4 { display: none !important; }`}</style>
                <DialogHeader>
                  <DialogTitle className='text-center'>Logging You in ... </DialogTitle>
                  <DialogDescription className='text-center'>
                  {/* {progress?<Progress value={progress} className="w-[80%] my-3" /> : <div></div>} */}

                 { progress? <ThreeDot variant="bounce" color="#000000" size="medium"  textColor="" />: <div></div>}

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>


        {/* { isSubmitting ?<Progress value={progress} className=" mx-4 w-[80%]" /> : <></>} */}
        </form>
        


</>
);
};

export default LoginForm;

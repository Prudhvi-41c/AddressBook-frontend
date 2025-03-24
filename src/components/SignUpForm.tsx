import * as React from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User, userSchema } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Progress } from "@/components/ui/progress"

import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {ThreeDot} from "react-loading-indicators"

interface ISignUpFormProps {
    onSucess:()=>void
}

const SignUpForm: React.FunctionComponent<ISignUpFormProps> = (props) => {

    const [progress,setProgress]=React.useState(0)
    const [isSubmitting,setIsSubmitting]=React.useState(false)

    const navigate=useNavigate()

    const {register,handleSubmit,formState:{errors}}= useForm<User>({resolver:zodResolver(userSchema)})

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    
    const onSubmit:SubmitHandler<User>= async (data)=>{
        setIsSubmitting(true)
        console.log(data);

        try {
            setProgress(13)

            const result= await  axios.post(`${serverUrl}/api/addUser`,data)
          
      

            console.log(result);

            const resdata= result.data.newUser
            setTimeout(function(){
              if(resdata){
                setProgress(50)
            }
            },500)
            
            setTimeout(function(){
              
              if(result.status === 201){
                setProgress(75)
                toast(`User has been created with email ${resdata.user_email}`, {
                    description: "Please Login to Continue",
                    position:"top-center",
                    style:{backgroundColor:"#008000",color:"white"},
                    action: {
                      label: "Login",
                      onClick: () => navigate("/auth"),
                    
                    },
                  })
                  navigate("/auth")
                  setTimeout( function(){
                    setProgress(100)
                    setIsSubmitting(false)
                    props.onSucess()
                   },500)
                  
            }

            },700)
            


            
        } catch (error) {
            console.log(error);
            setProgress(50)
            setTimeout( function(){
                if(error.status === 409){
                    toast(`User with email ${data.user_email} already exist`, {
                        description: "Please Login to Continue",
                        position:"top-center",
                        style:{backgroundColor: "#D32F2F", color: "white"},
                      })    
                      
                      setIsSubmitting(false) 
                      setProgress(0) 
                                
                }
                
                if(error.status=== 500){
                  toast(`Something went Wrong Please Try Again`)    
                  setIsSubmitting(false) 
                  setProgress(0) 
                }

            },500)

             
        } 

        
    }
   

    

    const requiredLabel = (label: string) => (
        <span className="block text-sm ">
          {label} <span className="text-red-500">*</span>
        </span>
      );

  return (
    <>
     
            <form action="" onSubmit={handleSubmit(onSubmit)} className="font-medium">
            <div className="grid grid-cols-1 gap-4"> 

                <div className="md:col-span-10 w-full">
                {requiredLabel("Full Name")}
                <Input
                    {...register("user_name")}
                    type="text"
                    placeholder="ex. Narra Prudhvi Sai"
                    className="mt-1 p-2 w-full"
                />
                {errors.user_name && <p className='text-red-500 font-light text-sm'>{errors.user_name.message}</p>}
                </div>

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

                <div className="md:col-span-10 w-full">
                {requiredLabel("Confirm Password")}
                <Input 
                    {...register("user_confirmPassword")}
                    type='Password'
                    placeholder=''
                    className='mt-1 p-2 w-full'
                />
                {errors.user_confirmPassword && <p className='text-red-500 font-light text-sm'>{errors.user_confirmPassword.message}</p>}
                {errors.root && <p  className='text-red-500 font-light text-sm'>{errors.root.message}</p>}
                </div>

                <div className="md:col-span-2 flex justify-center items-center">
                <Button className="mx-auto  my-2 px-14 py-2">
                    Submit
                </Button>
                </div>

                
                
            </div>
             {/* { isSubmitting ?<Progress value={progress} className=" mx-4 w-[80%]" /> : <></>} */}
             <Dialog open={isSubmitting}>
             <DialogContent>
             <style>{`[data-state="open"] .absolute.right-4.top-4 { display: none !important; }`}</style>
                <DialogHeader>
                  <DialogTitle className='text-center'>Creating Your Account ... </DialogTitle>
                  <DialogDescription className='text-center'>

                  {/* {progress?<Progress value={progress} className="w-[80%] my-3" /> : <div></div>} */}
                  { progress? <ThreeDot variant="bounce" color="#000000" size="medium"  textColor="" />: <div></div>}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            </form>


    </>
  );
};

export default SignUpForm;

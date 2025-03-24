
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "@radix-ui/react-icons";
import {  useNavigate } from 'react-router-dom';
import { Address } from '@/types';
import { toast } from "sonner";
import axios from 'axios';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {ThreeDot} from "react-loading-indicators"
import  Cookie  from "js-cookie";

interface IAddressesProps {
  addresses: Address[];
  fetchAddresses: () => void;
}

const Addresses: React.FunctionComponent<IAddressesProps> = ({ addresses, fetchAddresses }) => {
  const navigation = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [loading,setLoading]=React.useState(true)
  const [isDeleting,setIsDeleting]=React.useState(false)
  const [progress,setProgress]=React.useState(0)

  const userName= localStorage.getItem("userName")
  const jwtToken=Cookie.get("jwtToken")

  // sort the addresses to display the latest first
  const sortedAddresses = [...addresses].sort((a, b) => b.id - a.id);

  const deleteAddress = async (id: number | undefined) => {
    setIsDeleting(true)
    setProgress(13)
    const result = await axios.delete(`${serverUrl}/api/deleteaddress/${id}`,{
      withCredentials:true
    });

    setTimeout(function(){
      if(result){
        setProgress(50)
      }
    },500)
   
   setTimeout(function(){
   
    if(result.status === 200){
      setProgress(66)
     toast(`${result.data.message}`, {
      description: ``,
      action: {
        label: "ok",
        onClick: () => navigation("/"),
      },
     })
    setProgress(100)
    fetchAddresses();
    setIsDeleting(false)  
    navigation("/") 
  }},700)

  if(result.status === 500){
    setProgress(0)
    setIsDeleting(false)
    navigation("/")
    toast(`${result.data.message}`, {
      description: ``,
      action: {
        label: "ok",
        onClick: () => navigation("/"),
      },
      style:{backgroundColor: "#D32F2F", color: "white"}
     })

  }


   
  };
  

  React.useEffect(()=>{
    setTimeout(function(){
      if(!userName || addresses){
      setLoading(false)
      }
    },3000)
    // if(addresses){
    //   setLoading(false)
    // }
  },[addresses])

  const returnSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < 6; i++) {
      skeletons.push(
      
        <Card key={i} className='shadow-[4px_4px_0px_rgba(0,0,0,1)] border border-black rounded-none'>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start font-semibold">
              <div className="flex my-1 items-center">
                <Icons.PersonIcon className="h-5 w-5 text-gray-500" />
                <p className="ml-1">
                  <Skeleton className="h-4 w-[150px]" />
                </p>
              </div>
  
              <div className="flex my-1 items-center">
                <Icons.MobileIcon className="h-5 w-5 text-gray-500" />
                <p className="ml-1">
                  <Skeleton className="h-4 w-[100px]" />
                </p>
              </div>
  
              <div className="flex my-1 items-center">
                <Icons.EnvelopeClosedIcon className="h-5 w-5 text-gray-500" />
                <p className="ml-1">
                  <Skeleton className="h-4 w-[200px]" />
                </p>
              </div>
            </div>
  
            <div className="flex items-center my-1">
              <Icons.SewingPinFilledIcon className="h-8 w-8  text-gray-500" />
              <div className="flex flex-col">
                <p className="text-gray-700 py-1 ml-1">
                  <Skeleton className="h-4 w-[250px]" />
                </p>
                <p className="text-gray-700 py-1 ml-1">
                  <Skeleton className="h-4 w-[200px]" />
                </p>
              </div>
            </div>
          </CardContent>
  
          <CardFooter className="flex justify-end">
            <Skeleton className="h-5 w-[50px]"/>
           <Skeleton className="ml-2 h-5 w-[50px]" />
          </CardFooter>
        </Card>

      );
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {skeletons}
      </div>
    );
  };
  
  return (
    <>
      <div className="lg:p-20 md:p-15 sm:p-5 "> 
        <h1 className="text-3xl font-bold mb-4">Your Addresses</h1> 
        {loading? returnSkeletons() : 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6  ">
            
            {!(sortedAddresses.length)? <div className="flex justify-center italic " > {(userName && jwtToken) ? <p> Even Tony Stark has an address (Stark Tower, duh). Where’s yours? 🏙️ </p>: <p>Please Login to see your Addresses </p>}</div>:
            sortedAddresses.map((address) => (
            <Card key={address.id} className='shadow-[4px_4px_0px_rgba(0,0,0,1)] border border-black rounded-none aspect-auto  flex flex-col '>
              <CardHeader>
                <CardTitle className="font-bold text-lg md:text-base sm:text-sm break-words">{address.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col items-start font-semibold '>
                     <div className=" flex items-center ">
                        <Icons.PersonIcon className="h-5 w-5 text-gray-500" />
                        <p className="ml-1 text-base md:text-xs sm:text-xs break-words ">{address.fullname}</p>
                      </div>

                      <div className=" flex items-center ">
                        <Icons.MobileIcon className="h-5 w-5 text-gray-500" />
                        <p className="ml-1 text-base md:text-xs sm:text-xs break-words">{address.mobilenumber}</p>
                      </div>

                      <div className=" flex items-center">
                        <Icons.EnvelopeClosedIcon className="h-5 w-5 text-gray-500" />
                        <p className="ml-1 text-base md:text-xs sm:text-xs break-words">{address.email}</p>
                      </div>

                </div>

                <div className="flex items-center my-1">
                  <Icons.SewingPinFilledIcon className="h-8 w-8  text-gray-500" />
                  <div className="flex flex-col">
                    <p className="text-gray-700 py-1 ml-1 text-base md:text-sm sm:text-xs ">{address.area1}, {address.area2}, {address.landmark}</p>
                    <p className="text-gray-700 py-1 ml-1 text-base md:text-sm sm:text-xs "> {address.city}, {address.state} - {address.pincode}</p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigation(`/address/edit/${address.id}`, { state: { address: address } });
                  }}
                >
                  <span style={{ display: "inline-block", transform: "scale(1.4)" }}>
                    <Icons.Pencil1Icon />
                  </span>
                </Button>
                
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost">
                         <span style={{ display: "inline-block", transform: "scale(1.4)" }}>
                        <Icons.TrashIcon className="h-8 w-8 text-red-500" />
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=>{navigation("/")}}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>{deleteAddress(address.id)}} className="bg-red-500 text-white hover:bg-red-400">Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  

                  <Dialog open = {isDeleting} >
                    <DialogContent>
                    <style>{`[data-state="open"] .absolute.right-4.top-4 { display: none !important; }`}</style>
                      <DialogHeader>
                        <DialogTitle className="text-center"> Deleting Your Address ....</DialogTitle>
                        <DialogDescription className="text-center">
                        {/* {progress?<Progress value={progress} className="w-[80%] my-3" /> : <div></div>} */}
                        { progress? <ThreeDot variant="bounce" color="#000000" size="medium"  textColor="" />: <div></div>}
                        </DialogDescription>
                      </DialogHeader>
                      
                    </DialogContent>
                  </Dialog>
                 
              </CardFooter>
            </Card>
          ))}
        </div>
          } 
      </div>
   
    </>
  );
};

export default Addresses;
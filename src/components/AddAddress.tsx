import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

import Form from "./Form";

interface IAddAddressProps {
  fetchAddresses:()=>void
}

const AddAddress: React.FunctionComponent<IAddAddressProps> = (props) => {
  const navigate = useNavigate();
  const [open,setOpen]=React.useState(false)

  const closeDailog = () => {
    setOpen(false)
    navigate("/"); 
};
  return (
    <div className="flex items-center justify-center rounded-none p-10 ">
    <Dialog open={open} onOpenChange={setOpen}   >
      <DialogTrigger asChild>
        <Button variant="outline" className="py-20 px-40 border my-4 ">+</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Add Your Address</DialogTitle>
          <DialogDescription>
            Fill all the required inputs. Click Add Address when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form closeDailog={closeDailog}  fetchAddresses= {props.fetchAddresses}/>
        
      </DialogContent>
    </Dialog>

    </div>
  );
};

export default AddAddress;

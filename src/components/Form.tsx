import * as React from 'react';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Address, AddressSchema } from '@/types';
import { SubmitHandler, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress"
import { ThreeDot } from 'react-loading-indicators';
import * as Icons from "@radix-ui/react-icons";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Cookies from 'js-cookie';



interface IFormProps {
  closeDailog?: () => void;
  fetchAddresses: () => void;
}

const Form: React.FunctionComponent<IFormProps> = (props) => {

  const [progress, setProgress] = React.useState(0)
  const [isSubmiting,setIsSubmiting]=React.useState(false)
  const [isEdited,setIsEdited]=React.useState(false)

  const userName= localStorage.getItem("userName")
  const jwtToken=Cookies.get("jwtToken")
   
  const {id}=useParams()

  let mode;
  if(id){
    mode= "edit"
  }else{
    mode="add"
  }

  const navigate = useNavigate();

  // to fetch the address sent along with the current route for
   const location=useLocation()
   const address=location.state?.address

  // use React Hook Forms
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Address>({ resolver: zodResolver(AddressSchema),defaultValues:{
    title:address?.title,
    fullname:address?.fullname,
    mobilenumber:address?.mobilenumber,
    email:address?.email,
    pincode:address?.pincode,
    area1:address?.area1,
    area2:address?.area2,
    landmark:address?.landmark,
    city:address?.city,
    state:address?.state
  }})

  const watchedValues=watch()

  React.useEffect(() => {
    // Check if any value has changed
    const hasChanges = Object.keys(watchedValues).some(key => watchedValues[key] !== address?.[key]);
    setIsEdited(hasChanges);
  }, [watchedValues, address]);



  const onSubmit: SubmitHandler<Address> = async (data) => {
    
    if(data != address){
      setIsEdited(true)
    }

   setIsSubmiting(true)
   
    setProgress(13)
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    let submitedData;

    if( mode=== "add"){
      console.log(data);
     try {
        const formattedData = {
          ...data,
          mobilenumber: String(data.mobilenumber), 
          pincode: String(data.pincode),
        };
      const result = await axios.post(`${serverUrl}/api/addaddress`, formattedData,{
        withCredentials:true
      });
      submitedData = result.data;

      if(submitedData){
        setProgress(66)
      }

     } catch (error) {
      console.log(error);   
     }
     
    }

    if(mode === "edit"){
      const formattedData = {
        ...data,
        mobilenumber: String(data.mobilenumber), 
        pincode: String(data.pincode),
      };
     
      const result= await axios.patch(`${serverUrl}/api/updateaddress/${id}`,formattedData,{
        withCredentials:true
      })
       submitedData=result.data
       if(submitedData){
        setProgress(66)
      }
    }

    // alert(submitedData.message);
    // console.log(submitedData.address.title);
    console.log(submitedData);
    
    toast(`${submitedData.message}`, {
      description: id
        ? `Edited address with title ${submitedData.address.title}`
        : `Added address with title ${submitedData.address.title}`,
      action: {
        label: "ok",
        onClick: () => navigate("/"),
      },
      style: {
        width: "80%",
        maxWidth: "600px", // Optional: Restrict max width on larger screens
        bottom: "10px", // Move toast to bottom
        left: "50%", // Center it horizontally
        transform: "translateX(-50%)", // Ensure proper centering
        position: "fixed",
      },
    });
    
    setTimeout( function(){
     setProgress(100)
    },500)

    setTimeout(function(){
     
      if (props.closeDailog) {
        props.closeDailog();
      }
      setIsSubmiting(false)
      navigate("/");
    },1000)
   

    props.fetchAddresses();
    console.log(data);

  };

  const requiredLabel = (label: string) => (
    <span className="block text-sm ">
      {label} <span className="text-red-500">*</span>
    </span>
  );

  const handleBackSubmit=()=>{
    if(props.closeDailog){
      props.closeDailog()
    }
    navigate("/")
  }

  return (
    <>{(userName && jwtToken)?
     <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-row items-center justify-between w-3/4'>
      <Button className='ml-1' variant={props.closeDailog? "ghost" :"default"} disabled={isSubmiting} onClick={()=>{handleBackSubmit()}}>{props.closeDailog ? <Icons.Cross1Icon  className='text-red-500 h-8 w-8'/>:"Back"} </Button>
      <h2 className='text-2xl font-bold mx-auto'>{id?"Edit Address":"Add Address"}</h2>
      </div>
    <form action="" onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mb-4 mx-auto p-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="md:col-span-2">
            {requiredLabel("Title")}
          <Input
            {...register("title")}
            type="text"
            placeholder="ex. College"
            className="mt-1 p-2 "
          />
          {errors.title && <p className='text-red-500 font-light text-sm' >{errors.title.message}</p>}
        </div>



        <div>
          {requiredLabel("Full Name")}
          <Input
            {...register("fullname")}
            type="text"
            id="fullname"
            placeholder="ex. Prudhvi Sai"
            className="mt-1 p-2"
          />
          {errors.fullname && <p className='text-red-500 font-light text-sm'>{errors.fullname.message}</p>}
        </div>

        <div>
          {requiredLabel("Email")}
          <Input 
          {...register("email")}
          type='text'
          placeholder='ex. prudhvi.narra@cimpress.com'
          className='mt-1 p-2'
          />
          {errors.email && <p className='text-red-500 font-light text-sm'>{errors.email.message}</p>}
        </div>

        <div>
           {requiredLabel("Mobile Number")}
          <Input
            {...register("mobilenumber")}
            type="string"
            id="mobilenumber"
            placeholder="ex. 6301033307"
            className="mt-1 p-2"
          />
          {errors.mobilenumber && <p className='text-red-500 font-light text-sm'>{errors.mobilenumber.message}</p>}
        </div>

        <div>
           {requiredLabel("Pincode")}
          <Input
            {...register("pincode")}
            type="string"
            id="pincode"
            placeholder="ex. 523274"
            className="mt-1 p-2"
          />
          {errors.pincode && <p className='text-red-500 font-light text-sm'>{errors.pincode.message}</p>}
        </div>

        <div>
           {requiredLabel("Flat, House no., Building, Company, Apartment")}
          <Input
            {...register("area1")}
            type="text"
            id="area1"
            placeholder="ex. NIT Delhi"
            className="mt-1 p-2"
          />
          {errors.area1 && <p className='text-red-500 font-light text-sm'>{errors.area1.message}</p>}
        </div>

        <div>
          <Label htmlFor="area2" className="block text-sm font-medium text-gray-700">
            Area, Street, Sector, Village
          </Label>
          <Input
            {...register("area2")}
            type="text"
            id="area2"
            placeholder="ex. GTK Road ,Bakoli"
            className="mt-1 p-2"
          />
          {errors.area2 && <p className='text-red-500 font-light text-sm'>{errors.area2.message}</p>}
        </div>

        <div>
          <Label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
            Landmark
          </Label>
          <Input
            {...register("landmark")}
            type="text"
            id="landmark"
            placeholder="ex. "
            className="mt-1 p-2"
          />
          {errors.landmark && <p className='text-red-500 font-light text-sm'>{errors.landmark.message}</p>}
        </div>

        <div>
           {requiredLabel("Town/City")}
          <Input
            {...register("city")}
            type="text"
            id="city"
            placeholder="ex. Delhi"
            className="mt-1 p-2"
          />
          {errors.city && <p className='text-red-500 font-light text-sm'>{errors.city.message}</p>}
        </div>

        <div>
           {requiredLabel("State")}
          <Input
            {...register("state")}
            type="text"
            id="state"
            placeholder="ex. Delhi"
            className="mt-1 p-2"
          />
          {errors.state && <p className='text-red-500 font-light text-sm'>{errors.state.message}</p>}
        </div>


        <div className="md:col-span-2">
        <Button className="mx-auto my-2 px-12 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold" disabled={isSubmiting || (mode === "edit" && !isEdited)}>
                   {id?"Update Address":"Add Address"}
                  </Button>
          
            <Dialog open = {isSubmiting} >

              <DialogContent>
              <style>{`[data-state="open"] .absolute.right-4.top-4 { display: none !important; }`}</style>
                <DialogHeader>
                  <DialogTitle className='text-center'>{id?"Updating Your Address....":"Adding Your Address...."} </DialogTitle>
                 
                  <DialogDescription className='text-center'>
                  {/* {progress?<Progress value={progress} className="w-[80%] my-3" /> : <div></div>} */}
                  { progress? <ThreeDot variant="bounce" color="#000000" size="medium"  textColor="" />: <div></div>}
                  </DialogDescription>
                </DialogHeader>
                
              </DialogContent>
            </Dialog>


         

        </div>
      </div>
    </form>
   
    </div>
    : <div className='flex items-center justify-center font-semibold my-5 text-2xl'>Please Login To add Your Addresses</div>}
    </>
  );
};

export default Form;

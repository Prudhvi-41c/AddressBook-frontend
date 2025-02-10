import * as React from 'react';
import { Input } from './ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from './ui/button';
import { Address, AddressSchema } from '@/Types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate,useLocation, useParams } from 'react-router-dom';


interface IFormProps {
  closeDailog?: () => void;
  fetchAddresses: () => void;
}

const Form: React.FunctionComponent<IFormProps> = (props) => {
   
  const {id}=useParams()

  let mode;
  if(id){
    mode= "edit"
  }else{
    mode="add"
  }

  const navigate = useNavigate();

  // to fetch the address sent along with the current route
   const location=useLocation()
   const address=location.state?.address

  // use React Hook Forms
  const { register, handleSubmit, formState: { errors } } = useForm<Address>({ resolver: zodResolver(AddressSchema),defaultValues:{
    title:address?.title,
    fullname:address?.fullname,
    mobilenumber:address?.mobilenumber,
    pincode:address?.pincode,
    area1:address?.area1,
    area2:address?.area2,
    landmark:address?.landmark,
    city:address?.city,
    state:address?.state
  }})



  const onSubmit: SubmitHandler<Address> = async (data) => {

    const serverUrl = import.meta.env.VITE_SERVER_URL;
    let submitedData;

    if( mode=== "add"){
    const result = await axios.post(`${serverUrl}/api/addaddress`, data);
     submitedData = result.data;
    }

    if(mode === "edit"){
      const dataWithId={...data,id:id}
      console.log(dataWithId);
      const result= await axios.patch(`${serverUrl}/api/updateaddress/${id}`,dataWithId)
       submitedData=result.data
    }

    alert(submitedData.message);
    navigate("/");
    if (props.closeDailog) {
      props.closeDailog();
    }
    props.fetchAddresses();
    console.log(data);

  };

  const requiredLabel = (label: string) => (
    <span className="block text-sm ">
      {label} <span className="text-red-500">*</span>
    </span>
  );

  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className='text-2xl font-bold '>{id?"Edit Address":"Add Address"}</h2>
    <form action="" onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mb-4 mx-auto p-6 ">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
            {requiredLabel("Title")}
          <Input
            {...register("title")}
            type="text"
            placeholder="ex. College"
            className="mt-1 p-2 "
          />
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
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
          {errors.fullname && <p className='text-red-500'>{errors.fullname.message}</p>}
        </div>

        <div>
           {requiredLabel("Mobile Number")}
          <Input
            {...register("mobilenumber", {
              valueAsNumber: true,
              validate: (value) => {
                if ((value + "").length === 10) {
                  return true
                } else {
                  return ` must be a 10 digit number`
                }
              }
            })}
            type="number"
            id="mobilenumber"
            placeholder="ex. 6301033307"
            className="mt-1 p-2"
          />
          {errors.mobilenumber && <p className='text-red-500'>{errors.mobilenumber.message}</p>}
        </div>

        <div>
           {requiredLabel("Pincode")}
          <Input
            {...register("pincode", {
              valueAsNumber: true,
              validate: (value) => {
                if ((value + "").length === 6) {
                  return true
                } else {
                  return ` must be a 6 digit number`
                }
              }
            })}
            type="number"
            id="pincode"
            placeholder="ex. 523274"
            className="mt-1 p-2"
          />
          {errors.pincode && <p className='text-red-500'>{errors.pincode.message}</p>}
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
          {errors.area1 && <p className='text-red-500'>{errors.area1.message}</p>}
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
          {errors.area2 && <p className='text-red-500'>{errors.area2.message}</p>}
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
          {errors.landmark && <p className='text-red-500'>{errors.landmark.message}</p>}
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
          {errors.city && <p className='text-red-500'>{errors.city.message}</p>}
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
          {errors.state && <p className='text-red-500'>{errors.state.message}</p>}
        </div>


        <div className="md:col-span-2">
          <Button className="mx-auto my-2 px-12 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold ">
            {id?"Edit Address":"Add Address"}
          </Button>
        </div>
      </div>
    </form>
    </div>
  );
};

export default Form;
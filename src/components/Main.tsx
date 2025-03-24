import * as React from 'react';
import AddAddress from './AddAddress';
import Addresses from './Addresses';
import { Address } from '@/types';
import axios from "axios"





const Main: React.FunctionComponent = () => {
  
  const serverUrl=import.meta.env.VITE_SERVER_URL
     
    // setTimeout(function(){
    //   localStorage.removeItem("userName")
    //   localStorage.removeItem("userEmail")
    // },3600000)

    const [addresses,setAddresses]= React.useState<Address[]>([])
    const fetchAddresses=async()=>{

      const result = await axios.get(`${serverUrl}/api/getalladdresses`,{
        withCredentials:true
      })
      setAddresses(result.data)
      console.log(result.data);
    }

    React.useEffect(()=>{
      fetchAddresses()
    },[])
   
    
  return (
    <>
    <AddAddress fetchAddresses={fetchAddresses}/>
    <Addresses addresses={addresses} fetchAddresses={fetchAddresses}/>
    
    </>
  );
};

export default Main;

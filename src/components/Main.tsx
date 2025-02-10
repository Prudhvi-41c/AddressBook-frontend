import * as React from 'react';
import AddAddress from './AddAddress';
import Addresses from './Addresses';
import { Address } from '@/Types';
import axios from "axios"




const Main: React.FunctionComponent = () => {
  const serverUrl=import.meta.env.VITE_SERVER_URL

    const [addresses,setAddresses]= React.useState<Address[]>([])
    const fetchAddresses=async()=>{
      const result = await axios.get(`${serverUrl}/api/getalladdresses`)
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

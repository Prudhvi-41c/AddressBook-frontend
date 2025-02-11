

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Icons from "@radix-ui/react-icons";
import { useNavigate } from 'react-router-dom';
import { Address } from '@/Types';
import axios from 'axios';

interface IAddressesProps {
  addresses: Address[];
  fetchAddresses: () => void;
}

const Addresses: React.FunctionComponent<IAddressesProps> = ({ addresses, fetchAddresses }) => {
  const navigation = useNavigate();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // sort the addresses to display the latest first
  const sortedAddresses = [...addresses].sort((a, b) => b.id - a.id);

  const deleteAddress = async (id: number | undefined) => {
    const result = await axios.delete(`${serverUrl}/api/deleteaddress/${id}`);
    alert(result.data.message);
    fetchAddresses();
  };

  return (
    <>
      <div className="p-20"> 
        <h1 className="text-3xl font-bold mb-4">Your Addresses</h1> 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ">
          {sortedAddresses.map((address) => (
            <Card key={address.id} className='shadow-[4px_4px_0px_rgba(0,0,0,1)] border border-black rounded-none'>
              <CardHeader>
                <CardTitle className="font-bold text-lg">{address.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center my-1 font-bold">
                  <p className="">{address.fullname}</p>
                  <div className="ml-4 flex flex-row items-center">
                    <Icons.MobileIcon className="h-5 w-5 text-gray-500" />
                    <p className="ml-1">{address.mobilenumber}</p>
                  </div>
                </div>

                <div className="flex items-center my-1">
                  <Icons.SewingPinFilledIcon className="h-8 w-8  text-gray-500" />
                  <div className="flex flex-col">
                    <p className="text-gray-700 py-1 ml-1">{address.area1}, {address.area2}, {address.landmark}</p>
                    <p className="text-gray-700 py-1 ml-1"> {address.city}, {address.state} - {address.pincode}</p>
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

                <Button
                  variant="ghost"
                  onClick={() => {
                    deleteAddress(address.id);
                  }}
                >
                  <span style={{ display: "inline-block", transform: "scale(1.4)" }}>
                    <Icons.TrashIcon className="h-8 w-8 text-red-500" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Addresses;
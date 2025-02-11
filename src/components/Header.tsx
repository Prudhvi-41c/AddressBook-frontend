import * as React from "react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props) => {
  const navigate= useNavigate()
  return (
    <header className="bg-gray-200 py-4 my-4 px-8 flex justify-between items-center">
      <div className="text-xl font-bold">My Website</div> 
      <nav className="flex space-x-4"> 
        <Button variant="ghost" onClick={()=>{navigate("/")}}>Home</Button>
        <Button variant="ghost" onClick={()=>{navigate("/address/add")}} >Add Address</Button>
      </nav>

    </header>
  );
};

export default Header;
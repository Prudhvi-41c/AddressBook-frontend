import * as React from "react";
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
import axios from "axios";
import {jwtDecode } from "jwt-decode"

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

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {ThreeDot} from "react-loading-indicators"

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> =  (props) => {
  const navigate= useNavigate()
  const serverUrl=import.meta.env.VITE_SERVER_URL
    
    const [isAuthenticated, setIsAuthenticated]=React.useState(false)
    const [progress,setProgress]=React.useState(0)
    const [loggingOut,setLoggingOut]=React.useState(false)
    let userName = localStorage.getItem("userName");
    let userEmail= localStorage.getItem("userEmail");
    let jwtToken=Cookies.get("jwtToken")
    const [activePage,setActivePage]=React.useState("home")

     
    setTimeout(function(){
      jwtToken=Cookies.get("jwtToken")
      console.log("Cookie is read again");
      if(jwtToken){
        setIsAuthenticated(true)
      }else{
        setIsAuthenticated(false)
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        localStorage.removeItem("loginTime")
      }
    },3600000)

    React.useEffect(()=>{
      if(jwtToken){
        userName = localStorage.getItem("userName");
        userEmail= localStorage.getItem("userEmail");
        setIsAuthenticated(true)
      }
    },[jwtToken])
     

     const handleLogOut = async()=>{
      setLoggingOut(true)
      setProgress(13)
      
        try {

      
          const res= await axios.post(`${serverUrl}/api/logout`,{
            withCredentials:true
          })
          
          setTimeout(function(){
            if(res){
              setProgress(50)
            }
          },500)

          setTimeout(function(){
            if(res.status === 200 ){
              localStorage.removeItem("userName")
              localStorage.removeItem("userEmail")
              setProgress(75)
              setIsAuthenticated(false);
              setLoggingOut(false)
              navigate("/auth"); 
              setActivePage("authPage")
              setProgress(100)
              setProgress(0)
              Cookies.remove("jwtToken")
              }
          },700)


          
        } catch (error) {
          console.log(error);
          setProgress(0)
          setLoggingOut(false)
          
        }
     }
     React.useEffect(() => {
      setActivePage(window.location.pathname);
      console.log(window.location.pathname);
      
    }, [window.location.pathname]);
   console.log(userName)
   console.log(userEmail)
  return (
    <header className="bg-gray-200 py-4 my-4 md:px-10 flex justify-between items-center">
      
      <div className="text-xl font-bold">{isAuthenticated? userName: "My website"} </div> 
      <nav className="flex space-x-3 sm:space-x-4"> 
        <ul className="flex justify-between items-center space-x-3 sm:space-x-4">
        <li>
        <Button  variant={activePage === "/"? "outline":"ghost"} onClick={()=>{navigate("/");}}>Home</Button>
        </li>
         <li>
        {isAuthenticated && <Button variant={activePage === "/address/add"? "outline":"ghost"} onClick={()=>{navigate("/address/add"); }} >Add Address</Button>}
        </li>
        <li>
        {isAuthenticated? <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button >Logout </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be logged out from the account Please save the changes before you log out
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={()=>{navigate("/")}}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>{handleLogOut()}} className="bg-red-500 text-white hover:bg-red-400">Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog> : <Button  variant={activePage === "/auth"? "outline":"ghost" } onClick={()=>{navigate("/auth");}} >Login</Button>}
                  </li>
       </ul>
      </nav>
           <Dialog open={loggingOut}>
             <DialogContent>
             <style>{`[data-state="open"] .absolute.right-4.top-4 { display: none !important; }`}</style>
                <DialogHeader>
                  <DialogTitle className="text-center">Logging You out ... </DialogTitle>
                  <DialogDescription className="text-center">
                  {/* {progress?<Progress value={progress} className="w-[80%] my-3" /> : <div></div>} */}
                  { progress? <ThreeDot variant="bounce" color="#000000" size="medium"  textColor="" />: <div></div>}

                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          

    </header>
  );
};

export default Header;
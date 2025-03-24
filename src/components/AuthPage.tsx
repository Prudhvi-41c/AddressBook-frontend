import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"



interface IAuthPageProps {
}

const AuthPage: React.FunctionComponent<IAuthPageProps> = (props) => {
   
    const [activeTab,setActiveTab]=React.useState("login")

  return (
    <>
        <div className='flex justify-center items-center'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="my-5 w-[400px]">
        <TabsList className='grid w-full grid-cols-2'> 
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">SignUp</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className='my-20'>
           
        <Card>
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>
              Paaword Should be at least 8 characters long 
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <LoginForm />
          </CardContent>

        </Card>

            
        </TabsContent>

        <TabsContent value="signup" className='my-5'>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Password Should be at least 8 characters long and Password,Confirm Password should be same
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <SignUpForm onSucess={()=>setActiveTab("login")} />
          </CardContent>

        </Card>

        </TabsContent>

        </Tabs>
        </div>
    </>
  );
};

export default AuthPage;

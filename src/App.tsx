
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Main from './components/Main'
import Form from './components/Form'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import AuthPage from './components/AuthPage'
import { useEffect } from 'react'
import Cookies from "js-cookie"




function App() {
  
  useEffect(()=>{
    const now= new Date().getTime();
    const loginTime= localStorage.getItem("loginTime")
    if(now-Number(loginTime)>3600000){
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("loginTime")
      Cookies.remove("jwtToken")
    }
    console.log(now-Number(loginTime));
    
  },[])

  setTimeout(function(){
    location.reload()
    console.log("Website is reloaded after 1hr");
    
  },3600500)

   
  return (
    

    <>
      <BrowserRouter>
      <div className='min-h-screen flex flex-col'>

      <Header />
      <Routes>
       <Route path='/' element={<Main/>}></Route>
       <Route path='/address/add' element={<Form />}></Route>
       <Route path='/address/edit/:id' element={<Form/>}></Route>
       <Route path='/auth'element={<AuthPage/>} ></Route>
     </Routes>
     <Footer />
   
     </div>
     </BrowserRouter>
    </>
  )
}

export default App

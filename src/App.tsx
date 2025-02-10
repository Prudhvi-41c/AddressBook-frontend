
import './App.css'
import Footer from './components/Footer'
import Header from './components/Header'
import Main from './components/Main'
import Form from './components/Form'
import { BrowserRouter,Routes,Route } from "react-router-dom"




function App() {


  return (
    <>
      <BrowserRouter>
     <Header />
      <Routes>
       <Route path='/' element={<Main/>}></Route>
       <Route path='/address/add' element={<Form/>}></Route>
       <Route path='/address/edit/:id' element={<Form/>}></Route>
     </Routes>
     
     <Footer/>
     </BrowserRouter>
    </>
  )
}

export default App

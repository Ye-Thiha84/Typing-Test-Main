import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
function App() {
  const [count, setCount] = useState(0)
  const [arry,setArray]=useState([]);
  const fetchApi=async()=>{
    const response=await axios.get("http://localhost:8181/api");
    setArray(response.data.fruits);
    console.log(response.data.fruits);
    };
    useEffect(()=>{
      fetchApi();
    },[]);
  return (
  <>
    {arry.map((fruits, index) => (
      <div key={index} className="">
        <p>{fruits}</p>
        <br />
      </div>
    ))}
  </>
);
}

export default App

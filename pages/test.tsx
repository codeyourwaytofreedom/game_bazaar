import { useEffect } from "react";

const Test = () => {
    useEffect(()=>{
        try{
            fetch('https://fastapi-xi.vercel.app/api/pt',{method:"POST"}).then(r=>console.log(r))
        }catch(error){
            console.log(error)
        }
    },[])
    return ( <>
    <div style={{background:"white", height:"100vh"}}>
        <h1>Hello Test</h1>
    </div>
            
    </> );
}
 
export default Test;
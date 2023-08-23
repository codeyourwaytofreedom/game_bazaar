import { useEffect } from "react";

const Test = () => {
    useEffect(()=>{
        fetch('/api/crypto');
    },[])
    return ( <>
    <div style={{background:"white", height:"100vh"}}>
        <h1>Hello Test</h1>
    </div>
            
    </> );
}
 
export default Test;
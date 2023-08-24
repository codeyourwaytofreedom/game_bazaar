import { useEffect } from "react";

const Test = () => {
    useEffect(()=>{
        //fetch('/api/crypto').then(r => r.json()).then(rj => window.location.href = rj.redirectUrl)
        fetch('/api/crypto')
    },[])
    return ( <>
    <div style={{background:"white", height:"100vh"}}>
        <h1>Hello Test</h1>
    </div>
            
    </> );
}
 
export default Test;
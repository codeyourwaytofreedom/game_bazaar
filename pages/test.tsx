import { useEffect, useState } from "react";

const Test = () => {
    const [message, setMessage] = useState("");

    const execute_Test = async () => {
        const response = await fetch('/api/check_trade');
        console.log(response);
        if(response.status === 200){
            const resJspon = await response.json();
            setMessage(resJspon.message);
        }
    }
    return ( <>
    <div style={{background:"white", height:"100vh", display:"grid", justifyContent:"center"}}>
        <h1>Hello Test</h1>
        <button onClick={execute_Test}>EXECUTE TEST</button>
        <h1>{message}</h1>
    </div>
            
    </> );
}
 
export default Test;
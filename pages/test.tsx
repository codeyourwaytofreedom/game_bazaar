import { useEffect, useState } from "react";

const Test = () => {
    const [message, setMessage] = useState("");

    const execute_Test = async () => {
        const response = await fetch('/api/cron/check_trade');
        console.log(response);
        if(response.status === 200){
            const resJspon = await response.json();
            setMessage(resJspon.message);
        }
    }

    const tempo = async () => {
        const response = await fetch('/api/temporary');
        console.log(response);
    }
    return ( <>
    <div style={{background:"white", height:"100vh", display:"grid", justifyContent:"center"}}>
        <h1>Hello Test</h1>
        <button onClick={execute_Test}>EXECUTE TEST</button>
        <button onClick={tempo}>TEMPORARY ENDP</button>
        <h1>{message}</h1>
    </div>
            
    </> );
}
 
export default Test;
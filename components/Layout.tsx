
import { ReactNode } from "react";
import h from "../styles/Home.module.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Layout_props = {
    children:ReactNode
}

const Layout = ({children}:Layout_props) => {
    const [alt_bar, setAlt] = useState<boolean>(false);
    const [modalVis, setModalVis] = useState<string>("default");
    const universal_feedback = useSelector((state:any)=>state.loginSlice.universal_feedback);

    useEffect(()=>{
        const setter = () => {
          setAlt(false)
        }
        window.addEventListener("resize", setter)
  
        return () => window.removeEventListener("resize", setter)
      },[]);

    return ( <>
        <div className={h.homie}>
            <Navbar alt_bar={alt_bar} setAlt={setAlt} modalVis={modalVis} setModalVis={setModalVis}/>
            {children}
            {
                universal_feedback && universal_feedback.message.length > 0 && 
                <div className={h.universal_feedback}>
                    <div className={h.universal_feedback_oval}>
                        <h1 style={{color:universal_feedback.color}}>{universal_feedback.message}</h1>
                    </div>
                </div>
            }
        </div>
    </> );
}
 
export default Layout;
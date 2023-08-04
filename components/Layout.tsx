
import { ReactNode } from "react";
import h from "../styles/Home.module.css";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";

type Layout_props = {
    children:ReactNode
}

const Layout = ({children}:Layout_props) => {
    const [alt_bar, setAlt] = useState<boolean>(false);
    const [modalVis, setModalVis] = useState<boolean>(false);

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
        </div>
    </> );
}
 
export default Layout;
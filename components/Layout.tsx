
import { ReactNode } from "react";
import h from "../styles/Home.module.css";
import Navbar from "./Navbar";

type Layout_props = {
    children:ReactNode
}

const Layout = ({children}:Layout_props) => {

    return ( <>
        <div className={h.homie}>
            <Navbar/>
            {children}
        </div>
    </> );
}
 
export default Layout;
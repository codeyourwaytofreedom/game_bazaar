import { useEffect, useState } from "react";
import c from "../styles/Home.module.css";



const Chart = () => {
    const Y_axis = ["January", "February","March","April","May","June","July","August","September"];
    const X_axis = [4,7,2,3,9,1,5,5,9];
    const[scr_wid,setScrWd] = useState<number>();
    const max_height = scr_wid && scr_wid > 765 ? 400 : 200;
    const unit = max_height / Math.max(...X_axis);

    useEffect(()=>{
        setScrWd(window.innerWidth);
    },[]);
    useEffect(()=>{
        const setter = () =>{
            setScrWd(window.innerWidth);
        }
        window.addEventListener("resize", setter)
        return ()=> window.removeEventListener("resize",setter)
    },[]);
    return ( <>
        <div className={c.homie_product_holder_orders_kernel_chart}>
            <div className={c.homie_product_holder_orders_kernel_chart_Y}>
                {
                    Y_axis.map((e,i)=>
                    <div key={i}>{Y_axis[Y_axis.length-1-i]}</div>
                    )
                }
            </div>
            <div className={c.homie_product_holder_orders_kernel_chart_X}>
                {
                    X_axis.map((e,i)=>
                    <div key={i} style={{
                        width:scr_wid && scr_wid > 765 ? unit*X_axis[X_axis.length-1-i] : "auto",
                        height:scr_wid && scr_wid < 765 ? unit*X_axis[X_axis.length-1-i] : "auto"}}
                        ></div>
                    )
                }
            </div>
        </div>
    </> );
}
 
export default Chart;
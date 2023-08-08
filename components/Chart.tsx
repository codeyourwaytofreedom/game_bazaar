import { useEffect, useRef, useState } from "react";
import c from "../styles/Home.module.css";



const Chart = () => {
    const Y_axis = ["January", "February","March","April","May","June","July","August","September"];
    const X_axis = [1,3,3,4,5,9,3,7,1];
    const[scr_wid,setScrWd] = useState<number>();
    const max_height = scr_wid && scr_wid > 765 ? 400 : 200;
    const unit = max_height / Math.max(...X_axis);
    const cnv = useRef<HTMLCanvasElement>(null);
    const chart_container = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        setScrWd(window.innerWidth);
    },[]);
    useEffect(()=>{
        const setter = () =>{
            setScrWd(window.innerWidth);
        }
        window.addEventListener("resize", setter)
        return ()=> window.removeEventListener("resize",setter);
    },[]);

    useEffect(()=>{
        const canvas = cnv.current;
        if(canvas && chart_container.current){
            const containerRect = chart_container.current.getBoundingClientRect();
            canvas.width = containerRect.width;
            canvas.height = containerRect.height;
            const x_unit = containerRect.width / Y_axis.length;
            const y_unit = containerRect.height / Math.max(...X_axis);

            const ctx = canvas.getContext('2d');
            //ctx!.clearRect(0, 0, canvas.width, canvas.height);
            const drawLine = (x1:any, y1:any, x2:any, y2:any) => {
                ctx!.beginPath();
                ctx!.moveTo(x1, y1);
                ctx!.lineTo(x2, y2);
                ctx!.strokeStyle = "#FFC300";
                ctx!.lineWidth = 2;
                ctx!.stroke();
              };
              
            {
                X_axis.map((e,index)=>
                {
                    drawLine(
                                x_unit*index, containerRect.height - y_unit*X_axis[index],
                                x_unit*(index+1), containerRect.height - y_unit*X_axis[index+1]
                        )
                }
                
                )
            }
            
        }
    },[]);
    return ( <>
        <div className={c.homie_product_holder_orders_kernel_chart} ref={chart_container}>
{/*             <div className={c.homie_product_holder_orders_kernel_chart_Y}>
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
            </div> */}
            <canvas ref={cnv}>

            </canvas>
        </div>
    </> );
}
 
export default Chart;
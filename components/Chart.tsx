import { useEffect, useRef, useState } from "react";
import c from "../styles/Home.module.css";



const Chart = () => {
    const Y_axis = ["January", "February","March","April","May","June","July","August","September"];
    const X_axis = [1,3,3,4,5,9,3,7,1];
    const pure:any[] = [];
    X_axis.map(e=>!pure.includes(e) ? pure.push(e) : null);
    console.log(pure)

    const[scr_wid,setScrWd] = useState<number>();
    const max_height = scr_wid && scr_wid > 765 ? 400 : 200;
    const unit = max_height / Math.max(...X_axis);
    const cnv = useRef<HTMLCanvasElement>(null);
    const chart_container = useRef<HTMLDivElement>(null);
    const [sizes, setSize] = useState<any>();

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
            canvas.width = containerRect.width / X_axis.length * (X_axis.length-1) ;
            canvas.height = containerRect.height;
            const inset = 90;
            const x_unit = (containerRect.width - inset )/ Y_axis.length;
            const y_unit = (containerRect.height-20) / Math.max(...X_axis);
            

            const ctx = canvas.getContext('2d');

            const drawLine = (x1:number, y1:number, x2:number, y2:number,t:number,color:string) => {
                    ctx!.beginPath();
                    ctx!.moveTo(x1, y1);
                    ctx!.lineTo(x2, y2);
                    ctx!.strokeStyle = color;
                    ctx!.lineWidth = t;
                    ctx!.stroke();
              };
            
              const drawLetterOnPoint = (x:number, y:number, letter:string, fontSize:number, color:string) => {                
                ctx!.font = fontSize + 'px Arial';
                ctx!.fillStyle = color;
                ctx!.fillText(letter, x, y);
            };
            
            {
                pure.sort().map((e,i)=>
                    drawLetterOnPoint((inset-20)/2, containerRect.height-y_unit*pure[i], e, 14, 'white')
                )
            }

            {
                pure.map((e,index)=>
                {
                    drawLine(
                        (inset-20), containerRect.height - y_unit*pure[index],
                        containerRect.width-(inset-20), containerRect.height - y_unit*pure[index],0.5,"white"
                        )
                }
                
                )
            }
            const animateDrawLines = (index:any) => {
                if (index >= X_axis.length - 1) {
                    return;
                }
            
                const startX = (inset - 20) + x_unit * index;
                const startY = containerRect.height - y_unit * X_axis[index];
                const endX = (inset - 20) + x_unit * (index + 1);
                const endY = containerRect.height - y_unit * X_axis[index + 1];
            
                drawLine(startX, startY, endX, endY, 3, "gold");
            
                setTimeout(() => {
                    animateDrawLines(index + 1);
                }, 200);
            };
            
            animateDrawLines(0);

            
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
{/*             <div className={c.homie_product_holder_orders_kernel_chart_yy}>
                {
                    pure.sort().map((e,i)=> <div>{pure[pure.length-1-i]}</div>
                    )
                }
            </div> */}
            <canvas ref={cnv}></canvas>
        </div>
    </> );
}
 
export default Chart;
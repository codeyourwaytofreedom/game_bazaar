import React, { useEffect, useRef, useState } from "react";
import c from "../styles/Home.module.css";



const Chart = () => {
    const Y_axis = ["January", "February","March","April","May","June","July","August","September"];
    const X_axis = [6,3,3,4,5,9,3,7,1];
    const pure:any[] = [];
    X_axis.map(e=>!pure.includes(e) ? pure.push(e) : null);
    const[scr_wid,setScrWd] = useState<number>();
    const max_height = scr_wid && scr_wid > 765 ? 400 : 200;
    const unit = max_height / Math.max(...X_axis);
    const cnv = useRef<HTMLCanvasElement>(null);
    const chart_container = useRef<HTMLDivElement>(null);
    const [coors, setCoors] = useState<any[]>([]);
    const [closest,setClosest] = useState<number>();
    const [cursorPosition, setPosition] = useState<any>();

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

    const dotter = (canvas_context:any,startX:number,startY:number,color:string, rad:number) => {
        canvas_context.beginPath();
        canvas_context.arc(startX, startY, rad, 0, 2 * Math.PI, false);
        canvas_context.fillStyle = color;
        canvas_context.fill();
        canvas_context.closePath();
    }
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

            const drawRect = (x:any,y:any,w:any,h:any) =>{
                ctx!.fillStyle = "silver";
                ctx!.textAlign ="center"
                ctx!.fillRect(x,y,w,h);
            }

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
            const rec_Size = 70;
            {
                X_axis.map((e,index)=>
                {
                    const startX = (inset - 20) + x_unit * index;
                    const startY = containerRect.height - y_unit * X_axis[index];
                    const endX = (inset - 20) + x_unit * (index + 1);
                    const endY = containerRect.height - y_unit * X_axis[index + 1];

                    drawLine(startX, startY, endX, endY, 3, "gold");
                    index === closest ? dotter(ctx,startX,startY,"whitesmoke",7) :dotter(ctx,startX,startY,"crimson",5)
                    index === closest && drawLine(startX, 0, startX, chart_container.current!.offsetHeight, 1, "white");

                    /* index === closest && drawRect(index === X_axis.length-1 ? startX-rec_Size : startX-(rec_Size/2),
                        startY > containerRect.height / 2 ? startY-(rec_Size) : startY+(rec_Size*0.6),rec_Size,rec_Size), */

      /*               index === closest && drawLetterOnPoint(
                        index === X_axis.length-1 ? startX-rec_Size*0.8 : startX-(rec_Size/3),
                        startY > containerRect.height / 2 ? startY-(rec_Size*0.5) : startY+(rec_Size*1.2),"X_axis[index].toString()",14,"black"
                    ) */

                    coors[index] = {x:startX,y:startY}
                }
                )
            }
        }
    },[window.innerWidth,closest]);

    const pointer_detector = (e:React.MouseEvent) => {
        const x_cor = e.clientX - cnv.current!.getBoundingClientRect().left;
        const y_cor = Math.floor(e.clientY -  cnv.current!.getBoundingClientRect().top);

        setPosition({left:x_cor, top:y_cor})
        let difs:number[] = [];

        coors.forEach(coordinate => {
            const difference = (Math.floor(Math.abs((coordinate.x - x_cor)) + Math.abs((coordinate.y - y_cor))));
            console.log(difference)
            difs.push(difference)
        } )
        const nearest = difs.indexOf(Math.min(...difs));
        console.log(nearest)
        setClosest(nearest);
    }

    
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
                
                
                <div id={c.result} style={{
                                    left:closest && scr_wid && scr_wid < 765 && closest === X_axis.length-1 ? (coors[closest].x-50) : (coors[closest!].x), 
                                    top:closest ? coors[closest].y : "50%"
                                    
                                    }}>
                    {
                        X_axis.map((e,i)=> i === closest && <>{e}-{Y_axis[i]}</> )
                    }
                </div>
                
            <canvas ref={cnv} onMouseMove={pointer_detector}></canvas>
        </div>
    </> );
}
 
export default Chart;
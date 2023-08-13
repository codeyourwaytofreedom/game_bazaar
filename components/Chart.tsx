import React, { useEffect, useRef, useState } from "react";
import c from "../styles/Home.module.css";
import { Dispatch, SetStateAction } from 'react';



const Chart = ({item_details}:any) => {
    const XX = item_details?.XX || []
    const YY = item_details?.YY || []
    const pure:any[] = [];
    YY.map((e:any)=>!pure.includes(e) ? pure.push(e) : null);
    const[scr_wid,setScrWd] = useState<number>();
    const max_height = scr_wid && scr_wid > 765 ? 400 : 200;
    const unit = max_height / Math.max(...YY);
    const cnv = useRef<HTMLCanvasElement>(null);
    const chart_container = useRef<HTMLDivElement>(null);
    const [coors, setCoors] = useState<any[]>([]);
    const [closest,setClosest] = useState<number>(0);
    const [cursorPosition, setPosition] = useState<any>();

    useEffect(()=>{
        setScrWd(window.innerWidth);
    },[]);

    useEffect(()=>{
        const setter = () =>{
            setScrWd(window.innerWidth);
            setClosest(0)
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
            canvas.width = containerRect.width / YY.length * (YY.length-1) ;
            canvas.height = containerRect.height;
            const inset = 90;
            const up = 50;
            const x_unit = (containerRect.width - inset )/ XX.length;
            const y_unit = ((containerRect.height-20) / Math.max(...YY))-5;
            

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
                    drawLetterOnPoint((inset-20)/2, containerRect.height-up-y_unit*pure[i]+4, e, 14, 'white')
                )
                    drawLetterOnPoint((inset-20)/2, containerRect.height-up+2, "0", 14, 'white')
            }

            {
                pure.map((e,index)=>
                {
                    drawLine(
                        (inset-20), containerRect.height-up - y_unit*pure[index],
                        containerRect.width-(inset-20), containerRect.height-up - y_unit*pure[index],0.5,"white"
                        )
                }
                )
                drawLine(
                    (inset-20), containerRect.height-up,
                    containerRect.width-(inset-20), containerRect.height-up,0.5,"white"
                    )

            }
            const rec_Size = 70;
            {
                YY.map((e:any,index:any)=>
                {
                    const startX = (inset - 20) + x_unit * index;
                    const startY = containerRect.height - up - y_unit * YY[index];
                    const endX = (inset - 20) + x_unit * (index + 1);
                    const endY = containerRect.height -up- y_unit * YY[index + 1];

                    drawLine(startX, startY, endX, endY, 3, "gold");
                    index === closest ? dotter(ctx,startX,startY,"whitesmoke",7) :dotter(ctx,startX,startY,"crimson",5)
                    index === closest && drawLine(startX, 0, startX, chart_container.current!.offsetHeight, 1, "white");

                    drawLetterOnPoint(index === 0 ? startX : startX-10,containerRect.height-up+15,XX[index].substring(0,3).toLowerCase(),10,"white");
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
                <div id={c.result} style={{
                                    left:closest && scr_wid && scr_wid < 765 && closest === YY.length-1 ? (coors[closest].x-50) : (closest && coors[closest!].x), 
                                    top:closest ? coors[closest].y : "50%"
                                    
                                    }}>
                    {
                        YY.map((e:any,i:any)=> i === closest && <>{e}-{XX[i]}</> )
                    }
                </div>
                
            <canvas ref={cnv} onMouseMove={pointer_detector}></canvas>
        </div>
    </> );
}
 
export default Chart;
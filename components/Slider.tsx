import h from "../styles/Items_Slider.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dispatch, SetStateAction } from 'react';
import { NextPage } from "next";

interface ItemsSliderProps {
  setChosen: Dispatch<SetStateAction<string>>;
  chosen:string
}

const Items_slider /* : NextPage<ItemsSliderProps> */ = () =>  {
  const forward = useRef<HTMLDivElement>(null);
  const anchor = useRef<HTMLDivElement>(null);
  const [traX, setX] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [forVis, setForVis] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;

      const widthChange = currentWidth - previousWidth;

      if(currentWidth > previousWidth){
        if(traX !== 0 && traX < 0){
          setX(traX + widthChange)
        }
        else{
          setX(0)
        }
      }
      previousWidth = currentWidth;
    }

    let previousWidth = window.innerWidth;

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [traX]);


  useEffect(() => {
    const calculateDistance = () => {
      if (forward.current && anchor.current) {
        const forwardRect = forward.current.getBoundingClientRect();
        const anchorRect = anchor.current.getBoundingClientRect();
        const distanceX = forwardRect.left - anchorRect.left;
        setDistance(distanceX);
      }
    };

    calculateDistance();

    const resizeHandler = () => {
      calculateDistance();
    };

    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);
  
  const step_size = 100;
  const handle_forward = () =>{
      setX(traX-step_size);
      setTimeout(() => {
        setDistance(distance+step_size)
      }, 100);
  }

  const handle_backward = () =>{
    if(traX + step_size > 0){
      setX(0)
    }
    else{
      setX(traX+step_size)
    }
  }

  useEffect(()=>{
    if(anchor.current && forward.current){
      if(anchor.current?.getBoundingClientRect().left > forward.current?.getBoundingClientRect().left){
        setForVis(true)
      }
      else{
        setForVis(false)
      }
    }
  },[anchor.current?.getBoundingClientRect().left, forward.current?.getBoundingClientRect().left]);

  useEffect(()=>{
    if(anchor.current && forward.current){
      const margin = forward.current.getBoundingClientRect().left -  anchor.current!.getBoundingClientRect().left;
        if(margin > 0){
          setX(traX + (margin-10))
        }
    }
  },[forVis])

  const [on_it, setOn_it] = useState<string>("");

  return ( 
  <div className={h.slider}>
        <button id={h.back} onClick={handle_backward} style={{visibility: traX < 0 ? "visible" : "hidden"}}> 
        &#x276E;
        </button>
      <div className={h.slider_topBanner}>
        <div className={h.slider_topBanner_menu} style={{ transform: `translateX(${traX}px)` }}>
            {
              [...Array(15)].map((item:any,index:any )=>
            <div className={h.slider_topBanner_menu_double} key={index} /* style={{borderBottom: chosen === item.name ? "6px solid black" : "none"}} */>
                    <button /* onClick={()=> setChosen(item.name)} onMouseEnter={()=> setOn_it(item.name)} onMouseLeave={()=> setOn_it("")} */>
                        <div /* id={chosen === item.name ? h.text : on_it === item.name ? h.text : h.hide } */>Mini Item</div>
                        <Image src={`/${Math.floor(Math.random() * (15))}.png`} alt={"dagger"} width={40} height={40}/>
                    </button>
            </div>
            )
            }
            <div ref={anchor}></div>
        </div>
        <div id={h.name} ref={forward} style={{visibility:forVis ? "visible" : "hidden"}}>
          <button onClick={handle_forward} id={h.forward}>
            &#10095;
          </button>
        </div>
      </div>
  </div>
  )
  
}

export default Items_slider;
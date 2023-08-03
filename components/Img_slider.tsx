import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "../styles/Img_slider.module.css";

const Img_slider = () => {
  const urls = ["/sld5.png","/sld7.png"];
  const forward = useRef<HTMLButtonElement>(null);
  const [chosen, setChosen] = useState<number>(0);

  const move = (e:React.MouseEvent<HTMLButtonElement>) => {
    if(chosen + parseInt(e.currentTarget.value) > urls.length-1){
      setChosen(0)
    }
    else if(chosen + parseInt(e.currentTarget.value) < 0){
      setChosen(urls.length-1)
    }
    else{
      setChosen(chosen + parseInt(e.currentTarget.value))
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (forward.current) {
        forward.current.click();
      }
    }, 5000); // 1000 milliseconds = 1 second, change this value for the desired interval

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  return ( <>
  
      <div className={s.slider}>
        <button id={s.left} value={-1} onClick={(e)=> move(e)}>&#8249;</button>
        <button id={s.right} value={1} onClick={(e)=> move(e)} ref={forward}>&#8250;</button>
        {/* <h1>Image Showroom Text</h1> */}
            {
              urls.map((url,index)=>
                <Image src={url}  width={1000} height={1000} alt={"slider image"} id={index === chosen ? s.image_active : s.image_passive} key={index}/>
              )
            }
{/*             <h1 style={{color:"yellow"}}>{chosen}</h1>
 */}      </div>
  </> );
}
 
export default Img_slider;
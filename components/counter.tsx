import { useEffect, useState } from "react";
import t from "../styles/Pages.module.css";
import { useDispatch } from "react-redux";
import { note_universal_feedback } from "../redux/loginSlice";

function getTimeDifference(givenTime: any, del: number) {
  let givenDate: any = new Date(givenTime);
  if (del === 12) {
    givenDate.setHours(givenDate.getHours() + 12);
  } else {
    givenDate.setMinutes(givenDate.getMinutes() + 15);
  }

  const calculateDifference = () => {
    const currentDate:any = new Date();
    const timeDifference = givenDate - currentDate;
  
    const secondsDifference = Math.floor(timeDifference / 1000);
    
    const hours = Math.floor(secondsDifference / 3600);
    const minutes = Math.floor((secondsDifference % 3600) / 60);
    const seconds = secondsDifference % 60;
  
    const formattedDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
    const twelveHourDifference = -((hours - 12) * 3600 + minutes * 60 + seconds);
  
    const cancel = twelveHourDifference > 30 * 60;

    const finito = secondsDifference < 0;
  
    return {
      dif: formattedDifference,
      cancel: cancel,
      finito
    };
  };
  

  return calculateDifference();
}

const Counter = ({ time, del, cancel,order, setTrigger }: any) => {
  const [difference, setDifference] = useState<any>(getTimeDifference(time, del));
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newDifference = getTimeDifference(time, del);
      setDifference(newDifference);
    }, 1000);

    if (difference && difference.dif.split(":")[0] < "00") {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [time, del, difference]);

  const handle_cancel =async (order:any) => {
    dispatch(note_universal_feedback({message:"Cancelling order...", color:"gold"}))
    try{
      const response = await fetch('/api/cancel_order',{method:"POST", body:JSON.stringify(order)});
      if(response.status === 200){
        setTrigger((pr:boolean)=>!pr);
        const resJson = await response.json();
        dispatch(note_universal_feedback({message:resJson.message, color:resJson.color}))
        setTimeout(() => {
          dispatch(note_universal_feedback({message:"", color:resJson.color}))
        }, 1500);
      }
      else{
        const resJson = await response.json();
        dispatch(note_universal_feedback({message:resJson.message, color:resJson.color}));
        setTimeout(() => {
          dispatch(note_universal_feedback({message:"", color:resJson.color}))
        }, 1500);
      }
    }catch(err){
      console.log(err)
    }
  }
  return (
    <>
    <div id={t.counter}>
        {difference && cancel && del === 12 && difference.cancel &&  <button onClick={()=>handle_cancel(order)}>X</button> }
        <span style={{ fontSize: "large", color: "red", fontWeight: "bold" }} suppressHydrationWarning>
            {difference && !difference.finito && difference.dif}
            {difference && difference.finito && "00:00:00"}
        </span>
    </div>
    </>
  );
};

export default Counter;

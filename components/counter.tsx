import { useEffect, useState } from "react";
import t from "../styles/Pages.module.css";

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

    console.log(cancel)
  
    return {
      dif: formattedDifference,
      cancel: cancel,
    };
  };
  

  return calculateDifference();
}

const Counter = ({ time, del, cancel }: any) => {
  const [difference, setDifference] = useState<any>(getTimeDifference(time, del));

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

  return (
    <>
    <div id={t.counter}>
        {difference && cancel && difference.cancel &&  <button>X</button> }
        <span style={{ fontSize: "large", color: "red", fontWeight: "bold" }} suppressHydrationWarning>
            {difference && difference.dif}
        </span>
    </div>
    </>
  );
};

export default Counter;

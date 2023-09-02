import { useEffect, useState } from "react";

function getTimeDifference(givenTime: any) {
    let givenDate: any = new Date(givenTime);
    
    givenDate.setHours(givenDate.getHours() + 12);

    const calculateDifference = () => {
        const currentDate: any = new Date();
        const timeDifference = givenDate - currentDate;

        const secondsDifference = Math.floor(timeDifference / 1000);
        const hours = Math.floor(secondsDifference / 3600);
        const minutes = Math.floor((secondsDifference % 3600) / 60);
        const seconds = secondsDifference % 60;

        const formattedDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return {
            dif: formattedDifference
        };
    };

    let difference = calculateDifference();

    const interval = setInterval(() => {
        difference = calculateDifference();
    }, 1000);

    return {
        ...difference,
        stop: () => clearInterval(interval)
    };
}


const Counter = ({time}:any) => {
    const [difference, setDifference] = useState<any>();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDifference(getTimeDifference(time));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [time]);


    return ( <>
        <span style={{fontSize:"medium", color:"crimson"}} suppressHydrationWarning>{difference && difference.dif}</span>
    </> );
}
 
export default Counter;
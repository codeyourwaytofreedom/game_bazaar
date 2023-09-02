import Layout from "../components/Layout";
import t from "../styles/Pages.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Counter from "../components/counter";

const Trades = () => {
    const formatter = (price:string) => {
        const price_numbered = parseFloat(price);
        const price_rounded = Math.round(price_numbered * 100) / 100;
        //console.log(price_rounded)
        if(price_rounded === 0.00){
            return "--"
        }
        else{
            const price_formatted = `$${price_rounded.toFixed(2)}`;
            return price_formatted;
        }
    }

    const [chosen, setChosen] = useState(0);
    const [transactions, setTransactions] = useState<any>();
    const [orders_to_me, setOrders_to_me] = useState<any>([])

    const tabs = ["All transactions", "Completed", "Pending", "Failed"]
    const actions = [
                        {status:"All transactions", icon:"|||", color:"skyblue", date:"06.09.2023 14:47" },
                        {status:"Completed", icon:"★", color:"lightgreen",date:"06.09.2023 14:47"}, 
                        {status:"Pending", icon:"♨", color:"gold",date:"06.09.2023 14:47"},
                        {status:"Failed", icon:"☓", color:"crimson",date:"06.09.2023 14:47"}
                    ]

    const statuses = [
        {status:"Completed", icon:"★", color:"lightgreen"}, 
        {status:"Pending", icon:"♨", color:"gold"},
        {status:"Failed", icon:"☓", color:"crimson"}
    ]


    useEffect(()=>{
        let dummy:any = [];
        [...Array(15)].map(e=> dummy.push(actions.slice(1,4)[Math.floor(Math.random() * 3)]));
        if(chosen === 0){
            setTransactions(dummy)
        }
        else{
            setTransactions(dummy.filter((e:any)=> e.status === actions[chosen].status));
        }
    },[chosen])

    useEffect(()=>{
        const fetch_trades =async () => {
            const response = await fetch('/api/show_trades');
            const resJson = await response.json();
            setOrders_to_me(resJson)
        }
        fetch_trades();
    },[])

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
    
    

    return ( 
        
        <Layout searchbox={false}>
            <div className={t.trades}>
                <div className={t.trades_titles}>
                    {
                        actions.map((e,i)=>
                            <span key={i} style={{color:i === chosen ? e.color : "whitesmoke"}} onClick={()=>setChosen(i)}><span>{e.icon}</span>{e.status}</span>
                        )
                    }
                </div>
                <div className={t.trades_all}>
                    {
                        orders_to_me && orders_to_me.map((e:any,i:any)=>
                            <div className={t.trades_all_each} style={{background:i%2 ? "#36454F" : "#13242f"}} key={i} suppressHydrationWarning>
                               <span suppressHydrationWarning style={{color:statuses.find(s=>s.status === e.status)?.color, fontSize:"x-large", paddingRight:"40px"}}>{statuses.find(s=>s.status === e.status)?.icon}</span>
                               <div id={t.name} style={{color:statuses.find(s=>s.status === e.status)?.color}}>
                                    <span>{e.assetid}</span>
                                    <Counter time={e.when} />
                               </div>
                               <div id={t.image}>
                                    {/* <span style={{boxShadow:`0 0 35px 14px ${statuses.find(s=>s.status === e.status)?.color}`}}></span> */}
                                    <Image alt={"steam image"} src={e.image} width={70} height={70}/>
                               </div>
                               
                               
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.status} <br />{e.trade_link}</span>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.status !== "Failed" && formatter(e.price)} </span>
                            </div>
                        )
                    }
                </div>
            </div>
        </Layout>
     );
}
 
export default Trades;
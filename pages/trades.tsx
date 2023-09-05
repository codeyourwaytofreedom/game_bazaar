import Layout from "../components/Layout";
import t from "../styles/Pages.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Counter from "../components/counter";

const Trades = () => {
    const formatter = (price:string) => {
        const price_numbered = parseFloat(price);
        const price_rounded = Math.round(price_numbered * 100) / 100;
        if(price_rounded === 0.00){
            return "--"
        }
        else{
            const price_formatted = `$${price_rounded.toFixed(2)}`;
            return price_formatted;
        }
    }

    const [chosen, setChosen] = useState(0);
    const [orders, setOrders] = useState<any>();
    const [trigger, setTrigger] = useState(false);

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
        const fetch_trades =async () => {
            const response = await fetch('/api/show_trades');
            if(response.status === 200){
                const resJson = await response.json();
                console.log(resJson)
                setOrders(resJson)
            }
            else{
                console.log(response)
            }
        }
        fetch_trades();
    },[trigger])

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
                    <h1>Items to Send</h1>
                    {
                        orders && orders.they_ordered && orders.they_ordered.map((e:any,i:any)=>
                            <div className={t.trades_all_each} style={{background:i%2 ? "#36454F" : "#13242f"}} key={i} suppressHydrationWarning>
                                {
                                    e.status === "Pending" &&
                                    <Counter time={e.when} del={e.delivery_time === "12 hr" ? 12 : 15} cancel={false} order={e}/>
                                }
                               
                               <div id={t.image}>
                                    <Image alt={"steam image"} src={e.image} width={70} height={70}/>
                               </div>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.assetid} <br />{e.trade_link}</span>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.status}</span>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.status !== "Failed" && formatter(e.price)} </span>
                            </div>
                        )
                    }
                </div>

                <div className={t.trades_all}>
                    <h1>Items to Get</h1>
                    {
                        orders && orders.I_ordered &&  orders.I_ordered.map((e:any,i:any)=>
                            <div className={t.trades_all_each} style={{background:i%2 ? "#36454F" : "#13242f"}} key={i} suppressHydrationWarning>
                                {
                                    e.status === "Pending" &&
                                    <Counter time={e.when} del={e.delivery_time === "12 hr" ? 12 : 15} cancel={true} order={e} setTrigger={setTrigger} />
                                }
                               <div id={t.image}>
                                    <Image alt={"steam image"} src={e.image} width={70} height={70}/>
                               </div>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.assetid} <br />{e.trade_link}</span>
                               <span style={{color:statuses.find(s=>s.status === e.status)?.color}}>{e.status}</span>
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
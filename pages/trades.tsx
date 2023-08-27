import Layout from "../components/Layout";
import t from "../styles/Pages.module.css";
import Image from "next/image";
import { useState } from "react";

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
    const [chosen, setChosen] = useState(-1);

    const tabs = ["All transactions", "Completed", "Pending", "Failed"]
    const actions = [{status:"All transactions", icon:"⛓", color:"silver"},{status:"Completed", icon:"★", color:"lightgreen"}, {status:"Pending", icon:"♨", color:"gold"},{status:"Failed", icon:"☓", color:"crimson"}]

    let dummy:any = [];
    [...Array(15)].map(e=> dummy.push(actions.slice(1,4)[Math.floor(Math.random() * 3)]));

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
                        dummy.map((e:any,i:any)=>
                            <div className={t.trades_all_each} style={{background:i%2 ? "#36454F" : "#13242f"}} key={i}>
                               <span suppressHydrationWarning style={{color:e.color, fontSize:"x-large", paddingRight:"40px"}}>{e.icon}</span>
                               <div id={t.name} style={{color:e.color}}>
                                    <span>Item Name goes here...</span>
                                    <span style={{fontSize:"small"}}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                               </div>
                               <div id={t.image}>
                                    <span style={{boxShadow:`0 0 35px 14px ${e.color}`}}></span>
                                    <Image alt={"steam image"} src={`/${Math.floor(Math.random() * 10)}.png`} width={70} height={70}/>
                               </div>
                               
                               
                               <span style={{color:e.color}}>{e.status}</span>
                               <span></span>
                            </div>
                        )
                    }
                </div>
            </div>
        </Layout>
     );
}
 
export default Trades;
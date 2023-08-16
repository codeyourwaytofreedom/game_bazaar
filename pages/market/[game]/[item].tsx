import Image from "next/image";
import { useEffect, useState } from "react";
import Chart from "../../../components/Chart";
import Layout from "../../../components/Layout";
import i from "../../../styles/Home.module.css";


type item_details = {
    item_name:string,
    item_quality:string,
    item_category:string,
    item_type:string,
    item_price:number,
    XX:any[],
    YY:any[],
    sellers:any[]

}

const Item_details = () => {
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Sell","Buy", "Price Trends"];
    const [item_details,setDetails] = useState<item_details>();
    useEffect(()=>{
        fetch('/api/item_fetcher').then(r=>r.json()).then(rj => setDetails(rj));
    },[])

    return ( 
        <Layout>
            <>
                <div className={i.homie_product}>
                    <div id={i.blacken}></div>
                    <Image id={i.cover} src={"/hell1.jpg"} alt={"cosmic"} width={2000} height={2000} />

                    <div className={i.homie_product_holder}>
                        <Image id={i.item} src={"/rifle.png"} alt={"item"} width={300} height={300} />
                        <div className={i.homie_product_holder_details}>
                            <div className={i.homie_product_holder_details_title}>{item_details && item_details.item_name}</div>
                            <div className={i.homie_product_holder_details_explain}>
                                <div><span>Quality :</span><span> {item_details && item_details.item_quality}</span></div>
                                <div><span>Category :</span><span> {item_details && item_details.item_category}</span></div>
                                <div><span>Type :</span><span> {item_details && item_details.item_type}</span></div>
                            </div>
                            <div className={i.homie_product_holder_details_price}>
                                <span>Price :</span><span> $ {item_details && item_details.item_price}</span>
                            </div>
                            <div className={i.homie_product_holder_details_buts}><button>Sell</button><button>Buy</button></div>
                        </div>

                        <div className={i.homie_product_holder_orders}>
                            <div className={i.homie_product_holder_orders_kernel}>
                                <div className={i.homie_product_holder_orders_kernel_tabs}>
                                {
                                    tabs.map((e,ind)=>
                                        <button key={ind} 
                                            onClick={()=> setChosen(ind)} style={{color:chosen === ind ? "#FFC300" : "whitesmoke"}}
                                            >
                                                {e}
                                            <div id={chosen !== ind ? i.line : ""}></div>
                                        </button>
                                    )
                                }
                                </div>
                                {
                                    chosen === 0 || chosen === 1 ? 

                                <div className={i.homie_product_holder_orders_kernel_options}>
                                    <div id={i.titles}>
                                        <div>Items</div><div>Seller</div><div>Price</div>
                                    </div>
                                    {
                                       item_details &&  item_details.sellers.map((e,index)=>
                                    <div className={i.homie_product_holder_orders_kernel_options_option} key={index}>
                                        <div><Image src={"/rifle.png"} alt={"item"} width={200} height={200} /></div>
                                        <div>{e.seller}</div>
                                        <div>${e.price}</div>
                                        <div><button>{chosen === 0 ? "Buy" : "Sell"}</button></div>
                                    </div>
                                        )
                                    }
                                </div>

                                : chosen === 2 ? 

                                <Chart item_details={item_details}/>

                                : null

                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </Layout>
     );
}
 
export default Item_details;
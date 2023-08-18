import Image from "next/image";
import { useEffect, useState } from "react";
import Chart from "../../../components/Chart";
import Layout from "../../../components/Layout";
import i from "../../../styles/Home.module.css";
import { useRouter } from 'next/router';


type item_details = [
        {
            steamId:string,
            delivery_time:string,
            filteredDescriptions:any
        }
    ];

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


const Item_details = () => {
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Sell","Buy", "Price Trends"];
    const [item_details,setDetails] = useState<item_details>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";
    const [active, setActive] = useState<any>();
    const router = useRouter();
    const {appid,classid} = router.query;

    useEffect(() => {
        const fetchData = async () => {
          if (appid && classid) {
            try {
              const response = await fetch(`/api/item_fetcher/?appid=${appid}&classid=${classid}`);
              const data = await response.json();
              setDetails(data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
        };
      
        fetchData();
      }, [appid, classid]);
      
    useEffect(()=>{
        if(item_details){
            const active_user_id = localStorage.getItem("id");
            const active_user = item_details.find(e=> e.steamId === active_user_id);
            if(active_user){
                const type = active_user.filteredDescriptions[0].tags[0].localized_tag_name;
                const category = active_user.filteredDescriptions[0].tags[1].category;
                const quality = active_user.filteredDescriptions[0].tags[3].localized_tag_name;
                const price = active_user.filteredDescriptions[0].price;

                setActive({type:type, category:category, quality:quality,price:price});

                console.log(type, category,quality,price)
            }
        }
    },[item_details])


    return ( 
        <Layout>
            <>
                <div className={i.homie_product}>
                    <div id={i.blacken}></div>
                    <Image id={i.cover} src={"/hell1.jpg"} alt={"cosmic"} width={2000} height={2000} />

                    <div className={i.homie_product_holder}>
                        {
                            item_details && 
                            <>
                            <Image id={i.item} src={`${base_url}${item_details[0].filteredDescriptions[0].icon_url}`}  alt={"item"} width={300} height={300} />
                            <div className={i.homie_product_holder_details}>
                                <div className={i.homie_product_holder_details_title}>{item_details[0].filteredDescriptions[0].market_name}</div>
                                <div className={i.homie_product_holder_details_explain}>
                                    <div><span>Quality :</span><span> {active && active.quality}</span></div>
                                    <div><span>Category :</span><span> {active && active.category}</span></div>
                                    <div><span>Type :</span><span> {active && active.type}</span></div>
                                </div>
                                <div className={i.homie_product_holder_details_price}>
                                    <span>Price :</span><span>{active && formatter(active.price)}</span>
                                </div>
                                <div className={i.homie_product_holder_details_buts}><button>Sell</button><button>Buy</button></div>
                            </div>
                            </>
                        }

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
                                        <div>Items</div>
                                        <div>
                                            <div>Seller</div><div>Price</div>
                                        </div>
                                    </div>
                                    {
                                       item_details &&  item_details.map((e,index)=>
                                       e.filteredDescriptions[0].price ?
                                    <div className={i.homie_product_holder_orders_kernel_options_option} key={index}>
                                        <div id={i.image}>
                                            <span></span>
                                            <Image src={`${base_url}${e.filteredDescriptions[0].icon_url}`} alt={"item"} width={200} height={200} />
                                        </div>
                                        <div id={i.triple}>
                                            <div>
                                                ID:{e.steamId.slice(-4)} &nbsp;&nbsp;&nbsp; 
                                                <span style={{color:"red", textDecoration:"underline"}}>{e.delivery_time}</span>
                                            </div>
                                            <div>{formatter(e.filteredDescriptions[0].price)}</div>
                                            <div><button>{chosen === 0 ? "Buy" : "Sell"}</button></div>
                                        </div>
                                    </div> : null
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
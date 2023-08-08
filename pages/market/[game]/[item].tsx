import Image from "next/image";
import { useState } from "react";
import Chart from "../../../components/Chart";
import Layout from "../../../components/Layout";
import i from "../../../styles/Home.module.css";

const Item_details = () => {
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Sell","Buy", "Gallery", "Price Trends"]
    return ( 
        <Layout>
            <>
                <div className={i.homie_product}>
                    <div id={i.blacken}></div>
                    <Image id={i.cover} src={"/hell1.jpg"} alt={"cosmic"} width={2000} height={2000} />

                    <div className={i.homie_product_holder}>
                        <Image id={i.item} src={"/rifle.png"} alt={"item"} width={300} height={300} />
                        <div className={i.homie_product_holder_details}>
                            <div className={i.homie_product_holder_details_title}>M4A4 | Urban DDPAT (Field-Tested)</div>
                            <div className={i.homie_product_holder_details_explain}>
                                <div><span>Quality :</span><span> Industrial Grade</span></div>
                                <div><span>Category :</span><span> Normal</span></div>
                                <div><span>Type :</span><span> Rifles</span></div>
                            </div>
                            <div className={i.homie_product_holder_details_price}>
                                <span>Price :</span><span> $3.55</span>
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
                                    chosen === 0 ? 

                                <div className={i.homie_product_holder_orders_kernel_options}>
                                    <div id={i.titles}>
                                        <div>Items</div><div>Seller</div><div>Price</div>
                                    </div>
                                    {
                                        [...Array(5)].map((e,index)=>
                                    <div className={i.homie_product_holder_orders_kernel_options_option} key={index}>
                                        <div><Image src={"/rifle.png"} alt={"item"} width={200} height={200} /></div>
                                        <div>Seller {index}</div>
                                        <div>${3.5 + index}</div>
                                        <div><button>Buy</button></div>
                                    </div>
                                        )
                                    }
                                </div>

                                : chosen === 3 ? 

                                <Chart />

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
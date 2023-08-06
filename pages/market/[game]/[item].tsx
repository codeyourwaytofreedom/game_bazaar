import Image from "next/image";
import Layout from "../../../components/Layout";
import i from "../../../styles/Home.module.css";

const Item_details = () => {
    return ( 
        <Layout>
            <>
                <div className={i.homie_product}>
                    <div id={i.blacken}></div>
                    <Image id={i.cover} src={"/hell.jpg"} alt={"cosmic"} width={2000} height={2000} />

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

{/*                         <div className={i.homie_product_holder_orders}>
                            <div className={i.homie_product_holder_orders_kernel}>
                                <div className={i.homie_product_holder_orders_kernel_tabs}><button>One</button><button>Two</button></div>
                                <div className={i.homie_product_holder_orders_kernel_options}>
                                </div>
                            </div>
                        </div> */}

                    </div>
                </div>
            </>
        </Layout>
     );
}
 
export default Item_details;
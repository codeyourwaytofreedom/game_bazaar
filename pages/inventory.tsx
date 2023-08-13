import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import i from "../styles/Pages.module.css";

const Inventory = () => {
    const [inventory, setInventory] = useState<any[]>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";
    const game = "csgo"
    useEffect(() => {
        fetch(`/api/inventory?game=${game}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setInventory(data)
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
            });
    }, []);
    return ( 
        <Layout>
            <div className={i.inventory}>
{/*                 <h1>{inventory && inventory.length}</h1>
 */}                <div className={i.inventory_kernel}>
{/*                     <div className={i.inventory_kernel_item} key={199911}>
                        <button>Selected Category</button>
                    </div> */}
                    {
                        inventory && inventory.map((item,index)=>
                        <div className={i.inventory_kernel_item} key={index}
                            style={{backgroundColor:index%2 ? "rgb(40,40,40)" : "rgb(30,30,30)"}}
                        >
                            <span id={i.icon}>
                                <Image alt={"steam image"} src={`${base_url}${item.icon_url}`} width={90} height={90}/>
                                <span style={{boxShadow: index%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                            </span>
                            <span>{item.market_name}</span>
                            <span>Price</span>
                            <span>Edit Price</span>
                            <span><Image alt={"delete steam"} src={index%2 ? "/delete4.png" : "/delete3.png" } width={20} height={20}/></span>
                        </div>
                        )
                    }
                </div>
            </div>
        </Layout>
     );
}
 
export default Inventory;
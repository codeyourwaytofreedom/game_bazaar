import Image from "next/image";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import i from "../styles/Pages.module.css";

const Inventory = () => {
    const [inventory, setInventory] = useState<any[]>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/"

    useEffect(() => {
        fetch('/api/inventory')
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
                    <div className={i.inventory_kernel_item} key={199911}>
                        <span>Selected Category</span>
                    </div>
                    {
                        inventory && inventory.map((item,index)=>
                        <div className={i.inventory_kernel_item} key={index}
                            style={{backgroundColor:index%2 ? "rgb(40,40,40)" : "gray"}}
                        >
                            <span>
                                <Image alt={"steam image"} src={`${base_url}${item.icon_url}`} width={90} height={90}/>
                            </span>
                            <span>{item.market_name}</span>
                            <span>Price</span>
                            <span>Edit</span>
                            <span>Delete</span>
                        </div>
                        )
                    }
                </div>
            </div>
        </Layout>
     );
}
 
export default Inventory;
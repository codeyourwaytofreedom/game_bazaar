import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import i from "../styles/Pages.module.css";
import { useRouter } from "next/router";

const Inventory = () => {
    const [inventory, setInventory] = useState<any[]>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";
    const game = "csgo";
    const category = useSelector((state:any) => state.loginSlice.category);
    const search = useRef<HTMLInputElement>(null);
    const [filterVal, setFilterVal] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/inventory?game=${category}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setInventory(data)
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
            });
    }, [category]);

    const handle_search = () =>{
        if(search.current){
            console.log(search.current.value);
            setFilterVal(search.current.value);
        }
    }

    const handle_item_choose = (item_name:string) =>{
        router.push(`/market/${category}/${item_name}`);
    }

    return ( 
        <Layout>
            <div className={i.inventory}>
                <div className={i.inventory_kernel}>
                    <div className={i.inventory_kernel_item} key={98765}>
                        <input type="text" placeholder={'search...'} onChange={handle_search} ref={search}/>
                    </div>
                    {
                        inventory && inventory.filter(e=>e.market_name.toLowerCase().includes(filterVal.toLowerCase())).length === 0 && 
                        <h1>No result found !!!</h1>
                    }
                    {
                        inventory && inventory.filter(e=>e.market_name.toLowerCase().includes(filterVal.toLowerCase())).map((item,index)=>
                        <div className={i.inventory_kernel_item} key={index}
                            style={{backgroundColor:index%2 ? "rgb(40,40,40)" : "rgb(30,30,30)"}}
                        >
                            <span id={i.icon}>
                                <Image alt={"steam image"} src={`${base_url}${item.icon_url}`} width={90} height={90}/>
                                <span style={{boxShadow: index%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                            </span>
                            <span onClick={() => handle_item_choose(item.market_name)}>{item.market_name}</span>
                            <span>None</span>
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
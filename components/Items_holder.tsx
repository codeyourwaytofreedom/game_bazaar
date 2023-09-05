import Image from "next/image";
import { useEffect,useRef,useState } from "react";
import h from "../styles/Home.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import { note_filterBy, note_scroll } from "../redux/loginSlice";

const Items_holder = () => {
    const category = useSelector((state:any) => state.loginSlice.category);
    const inn = useSelector((state:any) => state.loginSlice.inn);
    const filterBy = useSelector((state:any) => state.loginSlice.filterBy);
    const scroll = useSelector((state:any) => state.loginSlice.scroll);

    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";

    const [inventory, setInventory] = useState<any>();
    const [feedback, setFeedback] = useState<string>("Inventory loading...");
    const container = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const router = useRouter();

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
    useEffect(() => {
        setInventory(null);
        setFeedback("Inventory loading...")
        fetch(`/api/inventory?game=${category}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        //console.log(data.message);
                        setFeedback(data.message);
                        //throw new Error(`Response status: ${response.status}`);
                    });
                }
            })
            .then(data => {
                if (data) {
                    console.log(data)
                    setInventory(data);
                    setFeedback("")
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [inn]);


    useEffect(()=>{
        if(scroll){
            container.current?.scrollIntoView();
        }
        if(filterBy.length === 0){
            dispatch(note_scroll(false));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },[scroll]);

    const handle_item_choose = (item:any) =>{
        router.push(`/market/${category}/${item.market_name}?appid=${item.appid}&assetid=${item.assetid}`);
    }

    useEffect(()=>{
        if(router.query.q){
            router.push(router.pathname,{});
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        dispatch(note_filterBy(""));
    },[])

    return ( 
        <div className={h.homie_items} ref={container}>
                <div className={h.homie_items_shell}>
                    {
                        inventory && inventory.filter((e:any)=>e.market_name.toLowerCase().includes(filterBy.toLowerCase())).map((item:any,index:any)=>
                                <div className={h.homie_items_shell_each} key={index} onClick={()=>handle_item_choose(item)}>
                                    <div id={h.icon}>
                                        <Image src={"/item_icon.png"} alt={"sword"} width={30} height={30}/>
                                    </div>
                                    <div className={h.homie_items_shell_each_image}>
                                        <Image src={`${base_url}${item.icon_url}`} alt={"dagger"} width={100} height={100}/>
                                    </div>
                                    <div className={h.homie_items_shell_each_details}>
                                        <h2>{item.market_name}</h2>
                                        <h3>$ {formatter(item.price)}</h3>
                                    </div>
                                </div>
                        )
                    }
                    {inventory && inventory.filter((e:any)=>e.market_name.toLowerCase().includes(filterBy.toLowerCase())).length === 0 &&
                        <h1 style={{color:"white"}}>No matching item !!!</h1>
                    }
                </div>
            </div>
     );
}
 
export default Items_holder;
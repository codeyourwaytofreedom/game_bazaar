import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import i from "../styles/Pages.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { note_category, note_universal_feedback } from "../redux/loginSlice";

const Inventory = () => {
    const [inventory, setInventory] = useState<any>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";
    const game = "csgo";
    const category = useSelector((state:any) => state.loginSlice.category);
    const search = useRef<HTMLInputElement>(null);
    const [filterVal, setFilterVal] = useState<string>("");
    const router = useRouter();

    const [modal, setModal] = useState<boolean>(false);
    const [chosen, setChosen] = useState<any>();
    const price_input = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<string>("Inventory loading...");
    const [popup, setPopup] = useState<number>(0);
    const [hoverDeetails, setHoverDetails] = useState<any>();
    const {assetid} = router.query; 
    const dispatch = useDispatch();
    const [trigger, setTrigger] = useState(false);

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
    }, [category,trigger]);
    
    useEffect(()=>{
        if(assetid && inventory && search.current){
            console.log("assetid available")
            console.log(assetid);
            console.log(inventory.find((e:any)=> e.assetid === assetid))
            search.current.value =  inventory.find((e:any)=> e.assetid === assetid).market_hash_name;
            setTimeout(() => {
                setFilterVal(inventory.find((e:any)=> e.assetid === assetid).market_hash_name);
            }, 300);
        }
        router.replace(router.asPath, {});
    },[inventory])
    
    

    useEffect(() => {
        if(feedback === "Price updated"){
            setTimeout(() => {
                setModal(false);
            }, 1500);
            fetch(`/api/inventory?game=${category}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log(response.statusText)
                    //throw new Error(`Response status: ${response.status}`);
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
        }
    }, [feedback]);

    const handle_search = () =>{
        if(search.current){
            console.log(search.current.value);
            setFilterVal(search.current.value);
        }
    }

    const handle_item_choose = (item:any) =>{
        router.push(`/market/${category}/${item.market_name}?appid=${item.appid}&assetid=${item.assetid}`);
    }

    const handle_price_editing = (item:any) => {
        setChosen(item);
        setModal(true);
        console.log(item);
    }

    const handle_update = (e:any) => {
        let ready:boolean = false;
        console.log(typeof chosen.price);
        if(price_input.current){
            ready = price_input.current.value.length > 0 && 
            parseFloat(price_input.current.value) > 0 &&
            price_input.current.value !== chosen.price
        }
        if(!ready){setFeedback("Enter a valid number different from current price!!!")}
        if(ready){
            setFeedback("Updating price...");
            fetch('/api/price_update',{
                method:'POST',
                body:JSON.stringify(
                    {
                        assetid:chosen.assetid,
                        price:price_input.current!.value, 
                        appId:chosen.appid
                    }
                )
            }).then(r=> r.text()).then(rt => setFeedback(rt))
        } 
    }

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

    const handle_popup = (item:any) =>{
        let level;
        let paint;
        let craftable;
        let spell;
        let sheen;
        if(item.type){
             level = item.type;
        }
        if (item.descriptions) {
            item.descriptions.map((i:any) => {
                if (i.value.toLowerCase().includes("effect")) {
                    //console.log(i)
                }
                if (i.value.toLowerCase().includes("✔") && i.value.toLowerCase().includes("paint")) {
                    paint = i.color;
                }
                if (i.value.includes("Usable in Crafting")) {
                    craftable = "Craftable - " + item.market_hash_name;
                }
                if (i.value.toLowerCase().includes("spell")) {
                    spell = i.value;
                }
                if (i.value.toLowerCase().includes("sheen")) {
                    sheen = i.value;
                }
            });
        }

        setHoverDetails({
            level:level, paint:paint, craftable:craftable, spell:spell, sheen:sheen
        })
        if(!level && !paint && !craftable && !spell && !sheen){
            setHoverDetails(null)
        }
        

    }

    const handle_remove_from_sale = async (item:any) => {
        if(confirm("Are you sure that you want to remove this item from sale?")){
            dispatch(note_universal_feedback({message:"Removing item from sale...", color:"gold"}))
            const response = await fetch('/api/remove_from_sale',{
                method:"POST",
                body:JSON.stringify(
                    {
                        assetid:item.assetid,
                        appId:item.appid,
                        KEY:null
                    })
            })
            const status = response.status;
            if(status === 200){
                setTrigger(tr=>!tr);
                dispatch(note_universal_feedback({message:"Item removed from sale...", color:"green"}));             
                setTimeout(() => {
                    dispatch(note_universal_feedback({message:"", color:"green"}));
                }, 1500);
            }
            else{
                const text = await response.text();
                dispatch(note_universal_feedback({message:text, color:"red"}));
                setTimeout(() => {
                    dispatch(note_universal_feedback({message:"", color:"red"}));
                }, 1500);
            }
        }
    }


    return ( 
        <Layout searchbox={false}>
            <div className={i.inventory}>
                <div className={i.inventory_kernel}>
                    {
                        modal && 
                        
                        <div id={i.modal}>
                        <div className={i.inventory_kernel_item} key={0} id={i.chosen}
                            style={{backgroundColor:0%2 ? "rgb(40,40,40)" : "rgb(30,30,30)",
                            pointerEvents:feedback?.includes("Updating") ? "none" : "auto"}}
                        >
                            <h1 style={{
                                color:feedback?.includes("Updating")? "whitesmoke" : feedback?.includes("updated") ? "gold" : "red"
                                }}>{feedback && feedback}</h1>
                            <span id={i.icon}>
                                <Image alt={"steam image"} src={`${base_url}${chosen.icon_url}`} width={90} height={90}/>
                                <span style={{boxShadow: 0%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                            </span>
                            <span>{chosen.market_name}</span>
                            <span> $<input ref={price_input} type="number" placeholder={chosen.price ? chosen.price : "0"} /></span>
                            <button onClick={handle_update}>Save</button>
                            <button id={i.close} onClick={()=> {setModal(false); setFeedback("")}}>X</button>
                        </div>
                        </div>
                    }
                    {
                        inventory && 
                        <div className={i.inventory_kernel_item} key={98765}>
                            <input type="text" placeholder={'search...'} onChange={handle_search} ref={search}/>
                        </div>
                    }
                    {
                        inventory && inventory.filter((e:any)=>e.market_name.toLowerCase().includes(filterVal.toLowerCase())).length === 0 && 
                        <h1>No result found !!!</h1>
                    }
                    {
                        inventory ? inventory.filter((e:any)=>e.market_name.toLowerCase().includes(filterVal.toLowerCase())).map((item:any,index:any)=>
                        <div className={i.inventory_kernel_item} key={index}
                            style={{backgroundColor:index%2 ? "rgb(40,40,40)" : "rgb(30,30,30)"}}
                        >
                            <span id={i.icon}>
                                <Image alt={"steam image"} src={`${base_url}${item.icon_url}`} width={90} height={90} 
                                    onMouseEnter={()=> {category === "tm2" && handle_popup(item); setPopup(index)}}
                                    onMouseLeave={()=> category === "tm2" && setPopup(-1)}
                                />
                                <span style={{boxShadow: index%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                                {popup === index && hoverDeetails && category === "tm2" && 
                                    <div id={i.popup}>
                                        {
                                            <>
                                            <p>{hoverDeetails.level && hoverDeetails.level }</p>
                                            <p>{hoverDeetails.craftable && hoverDeetails.craftable }</p>
                                            <p>{hoverDeetails.paint && hoverDeetails.paint }</p>
                                            <p>{hoverDeetails.sheen && hoverDeetails.sheen }</p>
                                            <p>{hoverDeetails.spell && hoverDeetails.spell }</p>
                                            </>
                                        }
                                    </div>} 
                            </span>
                            <span onClick={() => handle_item_choose(item)}>{item.market_name}</span>
                            <span style={{color:item.price === 0 ? "whitesmoke" : "gold"}}>
                                {   
                                    item.price ? formatter(item.price.toString()) : "--"
                                }
                                
                                </span>
                            <button onClick={()=> handle_price_editing(item)}>Edit Price</button>
                            <span onClick={()=>handle_remove_from_sale(item)} style={{cursor:"pointer"}}>
                                <Image alt={"delete steam"} src={index%2 ? "/delete4.png" : "/delete3.png" } width={20} height={20}/>
                            </span>
                        </div>
                        )
                        : 
                        <div id={i.tempo}>
                            {feedback && feedback}
                        </div>
                    }
                </div>
            </div>
        </Layout>
     );
}
 
export default Inventory;
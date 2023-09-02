import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Chart from "../../../components/Chart";
import Layout from "../../../components/Layout";
import i from "../../../styles/Home.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { note_universal_feedback } from "../../../redux/loginSlice";


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
    const {appid,assetid} = router.query;
    const [popup, setPopup] = useState<number>(0);
    const [hoverDeetails, setHoverDetails] = useState<any>();
    const category = useSelector((state:any) => state.loginSlice.category);
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const [buymodal, setBuymodal] = useState(false);
    const bmodal = useRef<HTMLDivElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const price = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [buyOrders, setOrders] = useState<any>();
    const [triggerUpdate, setTrigger] = useState(false);
    const [paginationIndex, setPaginationIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
          if (appid && assetid) {
            try {
              const response = await fetch(`/api/item_fetcher/?appid=${appid}&assetid=${assetid}`);
              const data = await response.json();
              console.log(data)
              setDetails(data);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
        };
      
        fetchData();
      }, [appid, assetid]);
      
    useEffect(()=>{
        if(item_details){
            const active_user_id = localStorage.getItem("id");
            const active_user = item_details.find(e=> e.steamId === active_user_id);
            if(active_user){
                const type = active_user.filteredDescriptions[0].tags.find((i:any)=> i.category === "Type").localized_tag_name;
                console.log(type)
                const category = active_user.filteredDescriptions[0].type;
                const quality = active_user.filteredDescriptions[0].tags.find((i:any)=> i.category === "Quality").localized_tag_name;
                const price = active_user.filteredDescriptions[0].price;

                setActive({type:type, category:category, quality:quality,price:price});

                console.log(type, category,quality,price)
            }
        }
    },[item_details]);



    useEffect(()=>{
        const fetch_orders = async () => {
            if(item_details){
                const item_name = item_details[0].filteredDescriptions[0].market_hash_name;
                const response = await fetch(`/api/orders?item=${item_name}`);
                const status = response.status;
                const resJson = await response.json();
                if(status === 200){
                    let pool:any = [];
                    resJson.forEach((element:any) => {
                        const orders = element.matchingOrders;
                        if(orders){
                            orders.forEach((order:any) => {
                                const each_order = {
                                    id:element.steamId,
                                    orderedItem: order.orderedItem,
                                    orderedQuantity: order.orderedQuantity,
                                    orderedPrice: order.orderedPrice
                                }
                                pool.push(each_order)
                            });
                        }
                    });
                    pool.sort((a:any, b:any) => {
                        const priceA = a.orderedPrice;
                        const priceB = b.orderedPrice;
                    
                        // Compare prices and return -1, 0, or 1 based on the comparison
                        if (priceA < priceB) {
                            return 1;
                        } else if (priceA > priceB) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    //console.log(resJson);
                    setOrders(pool);
                }else{
                    console.log("Could not fetch orders")
                }

            }
        }
        fetch_orders();
    },[item_details,triggerUpdate])

    const handle_popup = (item:any) =>{
        console.log("pop up function working");
        console.log(item)
        let level;
        let paint;
        let craftable;
        let spell;
        let sheen;
        if(item.filteredDescriptions){
             level = item.filteredDescriptions[0].type;
        }
        if (item.filteredDescriptions) {
            item.filteredDescriptions[0].descriptions.map((i:any) => {
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

    const handleBuyClick = () => {
        setBuymodal(true);
        setTrigger(false);
/*         if (bmodal.current) {
            bmodal.current.scrollIntoView({behavior:"smooth"});
        } */
      };

    const handle_place_order = async () => {
    console.log(item_details![0].filteredDescriptions[0].market_hash_name)
    if(price.current && quantity.current){
        if(price.current.value !== "" && quantity.current.value !== ""){
            dispatch(note_universal_feedback({message:"Placing order...", color:"gold"}));
            const priceFloat = parseFloat(price.current.value);
            const quantityInt = parseInt(quantity.current.value);
            const balanceEnough = parseFloat(balance) > priceFloat * quantityInt;
            if(balanceEnough){
                const response = await fetch('/api/place_order',{
                    method:'POST',
                    body:JSON.stringify({
                        price:price.current.value,
                        quantity:quantity.current.value,
                        name:item_details![0].filteredDescriptions[0].market_hash_name
                    })
                });
                const status = response.status;
                const resJson = await response.json();
                if(status === 200){
                    setTrigger(true);
                    dispatch(note_universal_feedback({message:"Order placed...", color:resJson.color}));
                    setTimeout(() => {
                        dispatch(note_universal_feedback({message:"", color:"green"}));
                        quantity.current!.value = "";
                        price.current!.value = "";
                    }, 2000);
                    setTimeout(() => {
                        setBuymodal(false)
                    }, 2100);
                }else{
                    dispatch(note_universal_feedback({message:"Not enough balance !", color:resJson.color}));
                    setTimeout(() => {
                        dispatch(note_universal_feedback({message:"", color:resJson.color}))
                    }, 1000);
                }
            }else{
                dispatch(note_universal_feedback({message:"Not enough balance !", color:"red"}));
                setTimeout(() => {
                    dispatch(note_universal_feedback({message:"", color:"red"}))
                }, 1000);
            }
        }
        else{
            dispatch(note_universal_feedback({message:"Invalid input !", color:"red"}))
            setTimeout(() => {
                dispatch(note_universal_feedback({message:"", color:"red"}))
            }, 1000);
        }
    }
    }

    const handle_Pagination = (i:any) => {
        setPaginationIndex(i)
    }
    const handle_buy_order =async (e:any) => {
        const buyDetails = e.filteredDescriptions[0];
        const assetid = buyDetails.assetid;
        const delivery_time = e.delivery_time;
        const image = base_url + buyDetails.icon_url;
        const sellerId = e.steamId;

        console.log(buyDetails);

        dispatch(note_universal_feedback({message:"Placing BUY ORDER ...", color:"gold"}));

        try{
            const response = await fetch('/api/want_to_buy',{
                method:"POST",
                body:JSON.stringify({
                    sellerId:sellerId,
                    assetid:assetid,
                    delivery_time:delivery_time,
                    image:image,
                    trade_link:"trade link of buyer",
                    price:buyDetails.price,
                    status:"Pending",
                    when:new Date()
                })
            });
            const resJson = await response.json();
            if(response.status === 200){
                dispatch(note_universal_feedback({message:resJson.message, color:resJson.color}));
                setTimeout(() => {
                    dispatch(note_universal_feedback({message:"", color:resJson.color}));
                }, 1500);
            }
            else{
                dispatch(note_universal_feedback({message:resJson.message, color:resJson.color}));
                setTimeout(() => {
                    dispatch(note_universal_feedback({message:"", color:resJson.color}));
                }, 1500);
            }
        }catch(err){
            console.log(err)
        }
    }

    return ( 
        <Layout searchbox={false}>
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
                                <div className={i.homie_product_holder_details_title}>{item_details[0].filteredDescriptions[0].market_hash_name}</div>
                                <div className={i.homie_product_holder_details_explain}>
                                    <div><span>Quality :</span><span> {active && active.quality}</span></div>
                                    <div><span>Category :</span><span> {active && active.category}</span></div>
                                    <div><span>Type :</span><span> {active && active.type}</span></div>
                                </div>
                                <div className={i.homie_product_holder_details_price}>
                                    <span>Price :</span><span>{active && formatter(active.price)}</span>
                                </div>
                                <div className={i.homie_product_holder_details_buts}>
                                    <button onClick={()=>router.push(`/inventory?assetid=${assetid}`)}>Sell</button>
                                    <button onClick={handleBuyClick}>Buy</button>
                                </div>
                            </div>
                            </>
                        }

                        <div className={i.homie_product_holder_orders} style={{visibility:!buymodal ? "visible" : "hidden"}}>
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
                                {
                                    chosen === 0 || chosen === 1 &&
                                    <div id={i.pagination}>
                                        <h3 onClick={()=>setPaginationIndex(paginationIndex - 1 < 0 ? 0 : paginationIndex -1)}>&#x2190;</h3>&nbsp;&nbsp;
                                        {
                                            chosen === 1 && buyOrders &&
                                            [...Array(Math.ceil(buyOrders.length/5))].map((e,i)=>
                                            <span key={i} 
                                                onClick={()=> handle_Pagination(i)} 
                                                style={{background:i === paginationIndex ? "gold" : "",color:i === paginationIndex ? "black" : ""}}
                                            >{i+1}</span>
                                            )
                                        }
                    &nbsp;&nbsp;<h3 onClick={()=>setPaginationIndex(paginationIndex + 1 > Math.ceil(buyOrders.length/5)-1 ? Math.ceil(buyOrders.length/5)-1  : paginationIndex + 1)}>&#x2192;</h3>
                                    </div>
                                }
                                    
                                    <div id={i.buypopup} ref={bmodal} style={{visibility:buymodal ? "visible" : "hidden"}}>
                                        <button id={i.close} onClick={()=>setBuymodal(false)}>X</button>
                                        <div id={i.kernel}>
                                            <div>
                                                <span>Quantity</span><br />
                                                <input type="number" min={1} max={10} ref={quantity} />
                                            </div>
                                            <div>
                                                <span>Buy at ($)</span><br />
                                                <input type="number" min={0.1} max={100000} ref={price}/>
                                            </div>
                                            <button onClick={handle_place_order}>Place Order</button>
                                        </div>
                                    </div>
                                    
                                    <div id={i.titles}>
                                        <div>Items</div>
                                        <div>
                                            <div>{chosen === 0 ? "Seller" : "Buyer"}</div><div>Price</div>
                                        </div>
                                    </div>

                                    { 
                                        chosen === 0 &&
                                       item_details &&  item_details.map((e,index)=>
                                       e.filteredDescriptions[0].price ?
                                    <div className={i.homie_product_holder_orders_kernel_options_option} key={index}>
                                        <div id={i.image}>
                                            <span></span>
                                            <Image src={`${base_url}${e.filteredDescriptions[0].icon_url}`} alt={"item"} width={200} height={200} 
                                                onMouseEnter={()=> {category === "tm2" && handle_popup(e); setPopup(index)}}
                                                onMouseLeave={()=> category === "tm2" && setPopup(-1)}
                                            />
                                                {popup === index && hoverDeetails &&
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
                                                </div>
                                                } 

                                        </div>
                                        <div id={i.triple}>
                                            <div>
                                                ID:{e.steamId.slice(-4)} &nbsp;&nbsp;&nbsp; 
                                                <span style={{color:"red", textDecoration:"underline"}}>{e.delivery_time}</span>
                                            </div>
                                            <div>{formatter(e.filteredDescriptions[0].price)}</div>
                                            <div>
                                                
                                                {
                                                    chosen === 0 ? 
                                                    
                                                    <button onClick={()=>handle_buy_order(e)}>Buy</button>
                                                
                                                    : <button>Sell</button>}

                                                    
                                                
                                            </div>
                                        </div>
                                    </div> : null
                                        )
                                    }

                                    { 
                                    chosen === 1 &&
                                    buyOrders &&  buyOrders.slice(5*paginationIndex,5*paginationIndex+5).map((e:any,index:any)=>
                                    
                                    <div className={i.homie_product_holder_orders_kernel_options_option} key={index}>
                                    <div id={i.image}>
                                        <span></span>
                                        <Image src={`${base_url}${item_details![0].filteredDescriptions[0].icon_url}`} alt={"item"} width={200} height={200} 
                                            onMouseEnter={()=> {category === "tm2" && handle_popup(item_details![0]); setPopup(index)}}
                                            onMouseLeave={()=> category === "tm2" && setPopup(-1)}
                                        />
                                            {popup === index && hoverDeetails &&
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
                                            </div>
                                            } 
                                    </div>
                                    <div id={i.triple}>
                                        <div>
                                            ID:{e.id.slice(-4)} &nbsp;&nbsp;&nbsp; 
                                           {/*  <span style={{color:"red", textDecoration:"underline"}}>{e.delivery_time}</span> */}
                                        </div>
                                        <div>{formatter(e.orderedPrice)} / {e.orderedQuantity} pcs</div>
                                        <div><button>Sell</button></div>
                                    </div>
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
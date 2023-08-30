import Layout from "../components/Layout";
import c from "../styles/Home.module.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { note_balance, note_login, note_ppicture, note_universal_feedback } from "../redux/loginSlice";
import Link from "next/link";

const Profile = () => {
    const dispatch = useDispatch();
    const inn = useSelector((state:any) => state.loginSlice.inn);
    const url = useSelector((state:any) => state.loginSlice.ppicture);
    const ak = useRef<HTMLInputElement>(null);
    const link = useRef<HTMLInputElement>(null);
    const [profile_details, setDetails] = useState<any>();
    const [feedback, setFeedback] = useState<{color:string,content:string}>({color:"whitesmoke",content:""});
    const list_items = useRef<HTMLButtonElement>(null);
    const [showItems, setShowItems] = useState(false);
    const [modal, setModal] = useState<boolean>(false);
    const [chosen, setChosen] = useState<any>();
    const price_input = useRef<HTMLInputElement>(null);
    const [fBack, setfBack] = useState<string>("Inventory loading...");
    const [myItems, setmyItems] = useState<any>();
    const base_url = "https://community.cloudflare.steamstatic.com/economy/image/";


    const dels = ["12 hr", "15 min"]

/*     useEffect(()=>{
        const fetch_user = async () => {
            try{
                const response = await fetch('/api/user');
                const status = response.status;
                if(status === 200){
                    const resJson = await response.json();
                    setDetails(resJson);
                }
                else{
                    console.log(response);
                }
            }catch(err){
                console.log(err);
            }
            
        }
        fetch_user();
    },[]) */

    const handle_ak = () => {
        if(ak.current && ak.current.value.length === 32){
            fetch('/api/ak',{
                method:'POST',
                body:ak.current!.value
            }).then(r => {
                if(r.status === 200){
                    console.log("API KEY geçerli")
                }
                else{
                    console.log("API KEY Yanlış")
                }
            })
        }
    }
    const handle_link = () => {
        if(link.current && link.current.value.length > 0){
            fetch('/api/lk',{
                method:'POST',
                body:link.current!.value
            }).then(r=> {
                if(r.status === 200){
                    console.log("Geçerli Trade Link")
                }
                else{console.log("Yanlış Trade Link")}
            })
        }
        }
    
    useEffect(()=>{
        if(profile_details){
                dispatch(note_balance(profile_details.balance));
                localStorage.setItem("balance", profile_details.balance);
        }
      },[profile_details]);

      const formatter = (price:string) => {
        const price_numbered = parseFloat(price);
        const price_rounded = Math.round(price_numbered * 100) / 100;
        const price_formatted = `$${price_rounded.toFixed(2)}`;
        return price_formatted;
    }
    
    const handle_delivery = async (e: any) => {
        if (profile_details && e !== profile_details.delivery && confirm(`Do you want to set delivery time to ${e}?`)) {
            setFeedback({color:"whitesmoke",content:"Updating delivery time..."});
    
            try {
                const response = await fetch('/api/profile_update', {
                    method: 'POST',
                    body: e
                });
    
                if (response.status === 200) {
                    const updatedDetails = await response.json();
                    setDetails(updatedDetails);
                    setFeedback({color:"green",content:"Delivery time updated!"});
                } else {
                    throw new Error("Failed to update delivery time");
                }
            } catch (error) {
                console.error(error);
                setFeedback({color:"red",content:"Failed to update delivery time"});
            } finally {
                setTimeout(() => {
                    setFeedback({color:"whitesmokte", content:""})
                }, 1000);
            }
        }
    }
    
    const handle_create_key = async () => {
        try{
            setFeedback({color:"gold", content:"Generating key..."})
            const response = await fetch('/api/key_generator');
            const resStatus = response.status;
            const resJSON = await response.json();
            if(resJSON.message){
                setFeedback(resJSON.message);
            }
            if(resJSON.updated_user){
                setFeedback({color:"green", content:"Key generated !!!"});
                setDetails(resJSON.updated_user);
                navigator.clipboard.writeText("");
            }
            setTimeout(() => {
                setFeedback({color:"whitesmoke", content:""})
            }, 1500);
        }
        catch(error){
            console.log("Something went wrong...",error)
        }
    }

    const handleCopy = (event:any) => {
        if(profile_details){
            navigator.clipboard.writeText(profile_details.game_bazaar_api_key)
        }
        setFeedback({color:"green", content:"Copied"});
        setTimeout(() => {
            setFeedback({color:"whitesmoke", content:""})
        }, 900);
    };

    const handle_list_items = async () => {
        setShowItems(!showItems);
        if(!myItems){
            dispatch(note_universal_feedback({message:"Loading items...", color:"gold"}))
            try {
                const response = await fetch('/api/list_items',{
                    method:"POST",
                    body:JSON.stringify({
                        KEY:profile_details.game_bazaar_api_key
                    })
                });
                const status = response.status;
                if(status === 200){
                    const rejson = await response.json();
                    let separated_items:any = [];
                    rejson.map((e:any) => e.map((ee:any)=> separated_items.push(ee)));
                    setmyItems(separated_items);
                    console.log(separated_items);
                    dispatch(note_universal_feedback({message:"", color:"gold"}))
                }
                else{
                    console.log("Unintented response code");
                }
            } catch (error) {
                console.log("Fetch problem", error)
            }
        }
/*         if(list_items.current){
            if(showItems){
                list_items.current.scrollIntoView({behavior:"smooth"});
            }
            else{
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        setShowItems(!showItems) */
    }

    const handle_update = async (e:any) => {
        let ready:boolean = false;
        console.log(typeof chosen.price);
        if(price_input.current){
            ready = price_input.current.value.length > 0 && 
            parseFloat(price_input.current.value) > 0 &&
            price_input.current.value !== chosen.price
        }
        if(!ready){setfBack("Enter a valid number different from current price!!!")}
        if(ready){
            setfBack("Updating price...");
            const response = await fetch('/api/price_update',{
                method:'POST',
                body:JSON.stringify(
                    {
                        assetid:chosen.assetid,
                        price:price_input.current!.value, 
                        appId:chosen.appid,
                        KEY:profile_details.game_bazaar_api_key
                    }
                )
            })
            const status = response.status;
            if(status === 200){

                setmyItems((prevItems:any) => {
                    const updatedItems = prevItems.map((item:any) => {
                      if (item.market_name === chosen.market_name) {
                        return { ...item, price: price_input.current?.value };
                      }
                      return item;
                    });
                    return updatedItems;
                  });


                const text = await response.text();
                setfBack(text);
                setTimeout(() => {
                    setModal(false);
                    setfBack("");
                }, 1500);
            }
        } 
    }

    const handle_price_editing = (item:any) => {
        setChosen(item);
        setModal(true);
        console.log(item);
        setfBack("")
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
                        KEY:profile_details.game_bazaar_api_key
                    })
            })
            const status = response.status;
            if(status === 200){
                dispatch(note_universal_feedback({message:"Item removed from sale...", color:"green"}));
                setmyItems((prevItems:any) => {
                    const updatedItems = prevItems.filter((el:any) => el.market_name !== item.market_name);
                    return updatedItems;
                  });                
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

    return ( <Layout searchbox={false}>
        <div className={c.homie_profile}>
            <div className={c.homie_profile_kernel}>
                {
                    feedback?.content.length > 0 &&                 
                    <div id={c.modal}>
                        <h1 style={{color:feedback.color}}>{feedback.content}</h1>
                    </div>
                }
                <div className={c.homie_profile_kernel_column}>
                    <div className={c.homie_profile_kernel_column_intro}>
                        <Image src={inn && url ? url : "/login.png"} alt={"sword"} width={30} height={30}/>
                        <h3>Username here</h3>
                        <span>||</span>
                        <h3>{profile_details ? profile_details.id : "User ID"}</h3>
                    </div>
                    <div className={c.homie_profile_kernel_column_balance}>
                        <h3>Balance</h3>
                        <div id={c.double}>
                            <h2>{profile_details ? formatter(profile_details.balance) : ""}</h2>
                            <div>
                                <div>&#x2729; Frozen: $ --</div>
                                <div>&#x2729; Active: $ --</div>
                            </div>  
                            <div id={c.buts}>
                                <span>+</span><span>&#8722;</span>
                            </div>
                        </div>
                    </div>
                    <div className={c.homie_profile_kernel_column_API}>
                        <h3>Game Bazaar API</h3>
                        <h4>API Key</h4>
                        <div>
                            <div id={c.key}>
                                <div id={c.actual}>{profile_details && profile_details.game_bazaar_api_key}</div>
                                <div id={c.censor}>{profile_details && profile_details.game_bazaar_api_key.split("").map((e:any) => "x")}</div>
                            </div>
                            <Image src={"/copy.png"} width={25} height={25} alt={"copy"} onClick={handleCopy}/>
                            <button onClick={handle_create_key}>Create KEY</button>
                        </div>
                    </div>

                    <div className={c.homie_profile_kernel_column_API}>
                        <div style={{display:"flex", columnGap:"10px", alignItems:"center", marginBottom:"10px"}}>
                            <Image src={"/delivery.png"} alt={"steam"} width={35} height={35}/>
                            <h4 style={{color:"#FFC300"}}>Delivery Time</h4>
                        </div>
                        <span></span>
                        <div id={c.delivery}>
                            {
                                dels.map((e,i)=>
                                <button onClick={()=>handle_delivery(e)} key={i}>
                                    {profile_details && profile_details.delivery === e && 
                                    <span style={{fontSize:"x-large", color:"green"}}> &#10004;</span> } 
                                    {e}
                                </button>
                                )
                            }
                        </div>
                    </div>

                </div>

                <div className={c.homie_profile_kernel_column}>
                    <div className={c.homie_profile_kernel_column_intro}>
                        <Image src={"/steamm.png"} alt={"steam"} width={30} height={30}/>
                        <h3>Steam Account</h3>
                        <h4 style={{position:"absolute", right:"0"}}>STEAM ID: {profile_details && profile_details.id}</h4>
                    </div>

                    <div className={c.homie_profile_kernel_column_API}>
                        <div style={{display:"flex", columnGap:"10px", alignItems:"center", marginBottom:"10px"}}>
                            <Image src={"/link.png"} alt={"steam"} width={30} height={30}/>
                            <h4 style={{color:"#FFC300"}}>Steam Trade Link</h4>
                        </div>
                        <span></span>
                        <div>
                            <input id={c.link} type={"text"} placeholder={"Trade Link"} ref={link}/>
                            <Image src={"/edit.png"} width={25} height={25} alt={"copy"}/>
                            <Link href={"http://steamcommunity.com/my/tradeoffers/privacy#trade_offer_access_url"} target={"_blank"}>Get it</Link>
                        </div>
                    </div>

                    <div className={c.homie_profile_kernel_column_API}>
                        <div style={{display:"flex", columnGap:"10px", alignItems:"center", marginBottom:"10px"}}>
                            <Image src={"/steamm.png"} alt={"steam"} width={30} height={30}/>
                            <h4 style={{color:"#FFC300"}}>Steam API Key</h4>
                        </div>
                        <span></span>
                        <div>
                            <input id={c.key} type={"password"} placeholder={"Your Steam API key"} ref={ak}/>
                            <Image src={"/edit.png"} width={25} height={25} alt={"copy"}/>
                            <Link href={"https://steamcommunity.com/dev/apikey"} target={"_blank"}>Get it</Link>
                        </div>
                    </div>

                    <div className={c.homie_profile_kernel_column_API}>
                        <div style={{display:"flex", columnGap:"10px", alignItems:"center", marginBottom:"10px"}}>
                            <Image src={"/at.png"} alt={"steam"} width={30} height={30}/>
                            <h4 style={{color:"#FFC300"}}>Email (optional)</h4>
                        </div>
                        <span></span>
                        <div>
                            <input id={c.key} type={"text"} placeholder={"Your email address"} ref={ak}/>
                            <button>Save</button>
                        </div>
                    </div>

                </div>
            </div>
            <button onClick={handle_list_items} ref={list_items} id={c.list_items}>{!showItems ? "Show my items" : "Hide items"}</button>

            <div className={c.homie_profile_items} style={{visibility:showItems ? "visible" : "hidden"}}>
                {
                    myItems && myItems.map((item:any,index:number)=>
                    <div className={c.homie_profile_items_item} 
                         style={{backgroundColor:index%2 ? "rgb(40,40,40)" : "rgb(30,30,30)"}} 
                         key={index}>
                        <span id={c.icon}>
                            <Image alt={"steam image"} src={`${base_url}${item.icon_url}`} width={90} height={90}/>
                            <span style={{boxShadow: index%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                        </span>
                        <span>{item.market_name}</span>
                        <span style={{color:"gold"}}>
                            {   
                                formatter(item.price)
                            }
                        </span>
                        <button onClick={()=>handle_price_editing(item)}>Edit Price</button>
                        <span><Image onClick={()=>handle_remove_from_sale(item)} alt={"delete steam"} style={{cursor:"pointer"}} 
                            src={index%2 ? "/delete4.png" : "/delete3.png" } width={20} height={20}/></span>
                    </div>
                    )
                }
            </div>
                    {
                        modal && 
                        
                        <div id={c.modal}>
                        <div className={c.homie_profile_items_item} key={999} id={c.chosen}
                        >
                            <h1 style={{
                                color:fBack?.includes("Updating")? "whitesmoke" : fBack?.includes("updated") ? "gold" : "red"
                                }}>{fBack && fBack}</h1>
                            <span id={c.icon}>
                                <Image alt={"steam image"} src={`${base_url}${chosen.icon_url}`} width={90} height={90}/>
                                <span style={{boxShadow: 0%2 ? "0 0 35px 15px whitesmoke" : "0 0 35px 15px gold"}}></span>
                            </span>
                            <span>{chosen.market_name}</span>
                            <span> $<input ref={price_input} type="number" placeholder={chosen.price ? chosen.price : "0"} /></span>
                            <button onClick={handle_update}>Save</button>
                            <button id={c.close} onClick={()=> {setModal(false); setfBack("")}}>X</button>
                        </div>
                        </div>
                    }
        </div>
    </Layout> );
}
 
export default Profile;
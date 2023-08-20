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

    const dels = ["12 hr", "15 min"]

    useEffect(()=>{
        fetch('/api/user').then(r=> r.json()).then(rj => setDetails(rj))
    },[])

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

    return ( <Layout>
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
        </div>
    </Layout> );
}
 
export default Profile;
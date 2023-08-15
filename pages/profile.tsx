import Layout from "../components/Layout";
import c from "../styles/Home.module.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { note_login, note_ppicture } from "../redux/loginSlice";
import Link from "next/link";

const Profile = () => {
    const dispatch = useDispatch();
    const inn = useSelector((state:any) => state.loginSlice.inn);
    const url = useSelector((state:any) => state.loginSlice.ppicture);
    const ak = useRef<HTMLInputElement>(null);
    const link = useRef<HTMLInputElement>(null);

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
        if(localStorage.getItem('userLoginStatus')){
            dispatch(note_login(true));
        }
        if(localStorage.getItem('url')){
            dispatch(note_ppicture(localStorage.getItem('url')))
        }
      },[]);


    return ( <Layout>
        <div className={c.homie_profile}>
            <div className={c.homie_profile_kernel}>

                <div className={c.homie_profile_kernel_column}>
                    <div className={c.homie_profile_kernel_column_intro}>
                        <Image src={inn && url ? url : "/login.png"} alt={"sword"} width={30} height={30}/>
                        <h3>Username here</h3>
                        <span>||</span>
                        <h3>User ID</h3>
                    </div>
                    <div className={c.homie_profile_kernel_column_balance}>
                        <h3>Balance</h3>
                        <div id={c.double}>
                            <h2>$ 45</h2>
                            <div>
                                <div>&#x2729; Frozen: $15</div>
                                <div>&#x2729; Active: $30</div>
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
                        <div id={c.key}>--------------------</div>
                            <Image src={"/copy.png"} width={25} height={25} alt={"copy"}/>
                            <button>Create KEY</button>
                        </div>
                    </div>
                </div>

                <div className={c.homie_profile_kernel_column}>
                    <div className={c.homie_profile_kernel_column_intro}>
                        <Image src={"/steamm.png"} alt={"steam"} width={30} height={30}/>
                        <h3>Steam Account</h3>
                        <h4 style={{position:"absolute", right:"0"}}>STEAM ID: 987320578264</h4>
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
                </div>
            </div>
        </div>
    </Layout> );
}
 
export default Profile;
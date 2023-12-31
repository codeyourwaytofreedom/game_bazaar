import Link from "next/link";
import Image from "next/image";
import h from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import { Dispatch, SetStateAction } from 'react';
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { note_login, note_ppicture,note_category,note_balance,note_filterBy, note_scroll } from "../redux/loginSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

interface Navbar_props {
    setAlt: Dispatch<SetStateAction<boolean>>;
    alt_bar:boolean,
    setModalVis:Dispatch<SetStateAction<string>>,
    modalVis:string,
    searchbox:boolean
  }

const Navbar:NextPage<Navbar_props> = ({alt_bar, setAlt, modalVis, setModalVis,searchbox}) => {

    const dispatch = useDispatch();
    const router = useRouter();
    const inn = useSelector((state:any) => state.loginSlice.inn);
    const url = useSelector((state:any) => state.loginSlice.ppicture);
    const balance = useSelector((state:any) => state.loginSlice.balance);

    const [after_login, setAfterLogin] = useState<boolean>(false);
    const [dynamicUrl, setUrl] = useState<string>("");
    const search_big = useRef<HTMLInputElement>(null);
    const search_small = useRef<HTMLInputElement>(null);
    const currentUrl = router.asPath;
    const scroll = useSelector((state:any) => state.loginSlice.scroll);

    const handle_steam = async () => {
        window.location.href = '/api/login';
    }

const handle_Logout = async () => {
    const result = await fetch('/api/logout',{method:"POST"}).then(
        (r) =>{
            if(r.status === 200){
                localStorage.removeItem('userLoginStatus');
                localStorage.removeItem('url');
                localStorage.removeItem('balance');
                localStorage.removeItem('id');
                dispatch(note_login(false));
                dispatch(note_ppicture(""));
                return true
            }
        }
    ).catch((error) => {
        console.log(error)
    })
    if(result){
        window.location.href = "/";
    }
}

    useEffect(()=>{
        if(localStorage.getItem('userLoginStatus')){
            dispatch(note_login(true));
        }
        if(localStorage.getItem('url')){
            dispatch(note_ppicture(localStorage.getItem('url')!))
        }
        if(localStorage.getItem('balance')){
            dispatch(note_balance(localStorage.getItem('balance')!))
        }
      },[]);

      const formatter = (price:string) => {
        const price_numbered = parseFloat(price);
        const price_rounded = Math.round(price_numbered * 100) / 100;
        const price_formatted = `$${price_rounded.toFixed(2)}`;
        return price_formatted;
    }
    
    useEffect(()=>{
        const check_cookie =async () => {
            const response = await fetch('/api/clear_navbar');
            const status = response.status;
            if(status === 404){
                if(localStorage.getItem('userLoginStatus')){
                    localStorage.removeItem('userLoginStatus')
                }
                if(localStorage.getItem('url')){
                    localStorage.removeItem('url')
                }
                if(localStorage.getItem('balance')){
                    localStorage.removeItem('balance')
                }
                dispatch(note_login(false));
            }
        }
        check_cookie();
    },[])



    const handle_URL = () => {
        dispatch(note_scroll(false));
        setTimeout(() => {
            dispatch(note_scroll(true));
        }, 400);
        if(search_big.current){
            dispatch(note_filterBy(search_big.current.value))
            setUrl(search_big.current.value);
            console.log(search_big.current.value.length);
        }
        router.push({
            pathname: router.pathname,
            query: { ...router.query, q: search_big.current?.value },
          });
          if(search_big.current?.value.length === 0){
            router.push(router.pathname,{});
            dispatch(note_scroll(false));
        }
    }

    const handle_enter = (e:any) => {
        if (e.key === 'Enter') {
            dispatch(note_scroll(true));
          }
    }

    return ( 
        <div className={h.homie_banner}>
                <Link href={"/"}><div><Image src={"/banner_sword.png"} alt={"sword"} width={40} height={40}/></div></Link>
                <Link href={"/"}><h3>Game Bazaar</h3></Link>

                <div id={h.dropdown} onClick={()=> setModalVis("open")}>
                    <Image src={modalVis === "csgo" ? "/csgo_icon.png" : modalVis === "tm2" ? "/tm2_icn.png" :  "/csgo_icon.png"} 
                        alt={"category"} width={70} height={60} id={h.category}/>
                </div>
                <div id={h.modal} style={{display:modalVis === "open" ? "flex" : "none"}}>
                    <div onClick={()=> {setModalVis("tm2");dispatch(note_category("tm2"))}}>
                        Team Fortress 2
                        <Image src={"/tm2.jpeg"} alt={"tm2"} width={190} height={100}/>
                    </div>
                    <div onClick={()=> {setModalVis("csgo"); dispatch(note_category("csgo"))}}>
                        Csgo
                        <Image src={"/cs.jpeg"} alt={"tm2"} width={190} height={100}/>
                    </div>
                </div>

                <Image src={"/srch.png"} alt={"sword"} width={30} height={30} id={h.alt_search} onClick={()=> setAlt(true)}/>

                
                {
                    searchbox &&
                    <>
                <div className={h.homie_banner_search2} style={{display:alt_bar ? "grid": "none"}}>
                    <div className={h.homie_banner_search2_kernel}>
                        <Image src={"/srch2.png"} alt={"sword"} width={30} height={30}/>
                        <input type="text" placeholder={"Search for items..."} onChange={handle_URL}/>
                        <span onClick={()=> setAlt(false)}>X</span>
                    </div>
                </div>

                <div className={h.homie_banner_search}>
                    <div className={h.homie_banner_search_kernel}>
                        <Image src={"/srch.png"} alt={"sword"} width={30} height={30}/>
                        <input type="text" 
                                placeholder={"Search for items..."} 
                                onChange={handle_URL} 
                                onKeyDown={handle_enter}
                                ref={search_big} 
                        />
                             <span>{scroll ? "scroll" : ""}</span>   
                    </div>
                </div>
                    </>
                }

                <div id={h.login} onClick={inn ? ()=> setTimeout(() => {setAfterLogin(after_login=>!after_login)}, 200) : handle_steam}
                        onBlur={()=> setTimeout(() => setAfterLogin(after_login=>!after_login), 300)}>
                    {inn && <Image id={h.w} src={"/w.png"} alt={"sword"} width={25} height={25}/>}
                    <span>{inn ? formatter(balance) : "Steam"}</span>
                    <Image src={inn && url ? url : "/login.png"} alt={"sword"} width={30} height={30}/>
                    {
                       inn && url && after_login && <div id={h.afterlogin}>
                            {/* <Link href={"/profile"}> */}<button onClick={()=>router.push("/profile")}><Image src={"/profile.png"} alt={"sword"} width={30} height={30}/>
                            <span>Profile</span></button>{/* </Link> */}

                            <Link href={"/balance"}><button><Image src={"/balance.png"} alt={"sword"} width={30} height={30}/>
                            <span>Balance</span></button></Link>

                            <button onClick={handle_Logout}>
                                <Image src={"/out.png"} alt={"sword"} width={30} height={30}/>
                                <span>Logout</span>
                            </button>
                        </div>
                    }
                </div>
            </div>
     );
}
 
export default Navbar;
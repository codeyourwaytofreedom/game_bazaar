import Link from "next/link";
import Image from "next/image";
import h from "../styles/Home.module.css";
import { useState } from "react";
import { Dispatch, SetStateAction } from 'react';
import { NextPage } from "next";

interface Navbar_props {
    setAlt: Dispatch<SetStateAction<boolean>>;
    alt_bar:boolean,
    setModalVis:Dispatch<SetStateAction<string>>,
    modalVis:string
  }


const Navbar:NextPage<Navbar_props> = ({alt_bar, setAlt, modalVis, setModalVis}) => {

    const handle_steam = () => {
        window.location.href = '/api/login';
    }

    return ( 
        <div className={h.homie_banner}>
                <Link href={"/"}><div><Image src={"/banner_sword.png"} alt={"sword"} width={40} height={40}/></div></Link>
                <Link href={"/"}><h2>Game Bazaar</h2></Link>
                <div id={h.dropdown} onClick={()=> setModalVis("open")}>
                    <Image src={modalVis === "csgo" ? "/csgo_icon.png" : modalVis === "tm2" ? "/tm2_icn.png" :  "/csgo_icon.png"} 
                        alt={"category"} width={70} height={60} id={h.category}/>
                </div>
                <div id={h.modal} style={{display:modalVis === "open" ? "flex" : "none"}}>
                    <div onClick={()=> setModalVis("tm2")}>
                        Team Fortress 2
                        <Image src={"/tm2.jpeg"} alt={"tm2"} width={190} height={100}/>
                    </div>
                    <div onClick={()=> setModalVis("csgo")}>
                        Csgo
                        <Image src={"/cs.jpeg"} alt={"tm2"} width={190} height={100}/>
                    </div>
                </div>

                <Image src={"/srch.png"} alt={"sword"} width={30} height={30} id={h.alt_search} onClick={()=> setAlt(true)}/>
                <div className={h.homie_banner_search2} style={{display:alt_bar ? "grid": "none"}}>
                    <div className={h.homie_banner_search2_kernel}>
                        <Image src={"/srch2.png"} alt={"sword"} width={30} height={30}/>
                        <input type="text" placeholder={"Search for items..."} />
                        <span onClick={()=> setAlt(false)}>X</span>
                    </div>
                </div>

                <div className={h.homie_banner_search}>
                    <div className={h.homie_banner_search_kernel}>
                        <Image src={"/srch.png"} alt={"sword"} width={30} height={30}/>
                        <input type="text" placeholder={"Search for items..."} />
                    </div>
                </div>


                <button id={h.login} onClick={handle_steam}>
                    <Image src={"/login.png"} alt={"sword"} width={30} height={30}/>
                    <span>Steam</span>
                </button>
                <Link id={h.comments} href={"/comments"}>
                    <Image src={"/cmmt.png"} alt={"sword"} width={30} height={30}/>
                </Link>
            </div>
     );
}
 
export default Navbar;
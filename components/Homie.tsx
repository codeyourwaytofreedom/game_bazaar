import Image from "next/image";
import { useEffect } from "react";
import h from "../styles/Home.module.css";
import Link from "next/link";
import { Issuer } from 'openid-client';
import Items_slider from "./Slider";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Img_slider from "./Img_slider";

const Homie = () => {
    const router = useRouter();
    const authenticateWithSteam = async () => {
        try {
          const steamIssuer = await Issuer.discover('https://steamcommunity.com/openid');
          const client = new steamIssuer.Client({
            client_id: '<YOUR_STEAM_API_KEY>',
            redirect_uris: ['http://localhost:3000/auth/steam/callback'],
          });
      
          const url = client.authorizationUrl({
            scope: 'openid',
            redirect_uri: 'http://localhost:3000/auth/steam/callback',
          });
          window.open(url, 'steamLoginWindow', 'width=800,height=600');
        } catch (error) {
          console.error('Steam authentication error:', error);
        }
      };

    return ( <>
        <div className={h.homie}>
          <br />
            <Img_slider/>
            {/* <div className={h.homie_wallpaper}></div> */}
            <Navbar/>
            <div className={h.homie_categories}>
                <div className={h.homie_categories_each} onClick={()=>router.push("/tm2")}>
                    <h3>Team Fortress 2</h3>
                    <Image src={"/tm2.jpeg"} alt={"tm2"} width={800} height={400}/>
                    <div id={h.hideout}><Image src={"/banner_sword.png"} alt={"sword"} width={50} height={50}/></div>
                </div>
                <div className={h.homie_categories_each} onClick={()=>router.push("/csgo")}>
                    <h3>Counter Strike Global Offensive</h3>
                    <Image src={"/cs.jpeg"} alt={"tm2"} width={800} height={400}/>
                    <div id={h.hideout}><Image src={"/banner_sword.png"} alt={"sword"} width={50} height={50}/></div>
                </div>
            </div>
            <Items_slider/>
            <br />
        </div>
    </> );
}
 
export default Homie;
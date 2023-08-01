import Image from "next/image";
import { useEffect } from "react";
import h from "../styles/Home.module.css";


function getRandomNumber() {
    return Math.floor(Math.random() * 10);
  }

const Homie = () => {
    useEffect(() => {
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/hello`;
        fetch(apiUrl)
          .then((r) => r.json())
          .then((rj) => console.log(rj));
      }, []);
    return ( <>
        <div className={h.homie}>
            <div className={h.homie_wallpaper}></div>
            <div className={h.homie_banner}>
                <div><Image src={"/banner_sword.png"} alt={"sword"} width={40} height={40}/></div>
                <h2>Game Bazaar</h2>
            </div>
            <div className={h.homie_items}>
                <div className={h.homie_items_shell}>
                    {
                        [...Array(24)].map((item,index)=>
                            <div className={h.homie_items_shell_each} key={index}>
                                <div id={h.icon}>
                                    <Image src={"/item_icon.png"} alt={"sword"} width={30} height={30}/>
                                </div>
                                <div className={h.homie_items_shell_each_image}>
                                    <Image src={`/${getRandomNumber()}.png`} alt={"dagger"} width={100} height={100}/>
                                </div>
                                <div className={h.homie_items_shell_each_details}>
                                    <h2>Item Name Here</h2>
                                    <h3>$ 4.50</h3>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </> );
}
 
export default Homie;
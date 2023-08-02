import Image from "next/image";
import { useEffect } from "react";
import h from "../styles/Home.module.css";
import Link from "next/link";

const Items_holder = () => {
    return ( 
        <div className={h.homie_items}>
                <div className={h.homie_items_shell}>
                    {
                        [...Array(24)].map((item,index)=>
                            <div className={h.homie_items_shell_each} key={index}>
                                <div id={h.icon}>
                                    <Image src={"/item_icon.png"} alt={"sword"} width={30} height={30}/>
                                </div>
                                <div className={h.homie_items_shell_each_image}>
                                    <Image src={`/${Math.floor(Math.random() * (15))}.png`} alt={"dagger"} width={100} height={100}/>
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
     );
}
 
export default Items_holder;
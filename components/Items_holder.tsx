import Image from "next/image";
import { useEffect,useState } from "react";
import h from "../styles/Home.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';

const Items_holder = () => {

    const router = useRouter();
    const urlPath = router.asPath;
    const partAfterBaseUrl = urlPath.replace(router.basePath, '');
    
    return ( 
        <div className={h.homie_items}>
                <div className={h.homie_items_shell}>
                    {
                        [...Array(24)].map((item,index)=>
                            <Link href={`${partAfterBaseUrl}/${index}_item`} key={index}>
                                <div className={h.homie_items_shell_each}>
                                    <div id={h.icon}>
                                        <Image src={"/item_icon.png"} alt={"sword"} width={30} height={30}/>
                                    </div>
                                    <div className={h.homie_items_shell_each_image}>
                                        <Image src={`/${Math.floor(Math.random() * (15))}.png`} alt={"dagger"} width={100} height={100}/>
                                    </div>
                                    <div className={h.homie_items_shell_each_details}>
                                        <h2>Item name here</h2>
                                        <h3>$ 4.50</h3>
                                    </div>
                                </div>
                            </Link>
                        )
                    }
                </div>
            </div>
     );
}
 
export default Items_holder;
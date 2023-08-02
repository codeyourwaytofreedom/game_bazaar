import Link from "next/link";
import Image from "next/image";
import h from "../styles/Home.module.css";


const Navbar = () => {
    return ( 
        <div className={h.homie_banner}>
                <Link href={"/"}><div><Image src={"/banner_sword.png"} alt={"sword"} width={40} height={40}/></div></Link>
                <Link href={"/"}><h2>Game Bazaar</h2></Link>

                <Link href={"/"} id={h.login}>
                    <Image src={"/login.png"} alt={"sword"} width={30} height={30}/>
                    <span>Log in with Steam</span>
                </Link>

                <Link id={h.comments} href={"/comments"}>
                    <Image src={"/cmmt.png"} alt={"sword"} width={30} height={30}/>
                </Link>
            </div>
     );
}
 
export default Navbar;
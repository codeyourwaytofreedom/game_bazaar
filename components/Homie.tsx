import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import h from "../styles/Home.module.css";
import Link from "next/link";
import { Issuer } from 'openid-client';
import Items_slider from "./Slider";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Img_slider from "./Img_slider";
import { useDispatch,useSelector } from "react-redux";
import { note_login,note_ppicture, note_balance,note_id } from "../redux/loginSlice";
import Items_holder from "./Items_holder";


const Homie = () => {
    const router = useRouter();
    const final_one = useRef<HTMLButtonElement>(null);
    const [distanceTop, setDistance] = useState<number>();
    const [initialWid, setInitial] = useState<number>(0);
    const [hei, setHei] = useState<number>(50);
    const [enlarged, setEnlarged] = useState<boolean>(false);
    const [alt_bar, setAlt] = useState<boolean>(false);
    const [modalVis, setModalVis] = useState<string>("default");
    const dispatch = useDispatch();

    const csgo_subs = ["Gloves","Heavy","Knife","Pistol","Rifle","SMG","Sticker","Container","Gift","Key","Pass","Tag","Graffiti"];

    useEffect(() => {
      fetch('/api/ins')
        .then(async(response) => {          
          if (response.status === 200) {
            dispatch(note_login(true));
            localStorage.setItem('userLoginStatus', 'in');      
            router.replace("/");
            const rj = await response.json();

            if(rj){
              dispatch(note_ppicture(rj.url));
              dispatch(note_balance(rj.balance));
              dispatch(note_id(rj.id));
              localStorage.setItem('url',rj.url);
              localStorage.setItem('balance',rj.balance);
              localStorage.setItem('id',rj.id);

            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, []);
    
    
    useEffect(()=>{
      if(final_one.current){
        setDistance(final_one.current.offsetTop);
      }
      setInitial(window.innerWidth)
    },[]);

    useEffect(()=>{
      const setter = () => {
        setAlt(false)
        if(final_one.current){
          setDistance(final_one.current.offsetTop);
          if(enlarged){
            setHei(final_one.current.offsetTop-50)
          }
          if(final_one.current.offsetTop < 141){
            setHei(50);
            setEnlarged(false)
          }
        }
      }
      window.addEventListener("resize", setter)

      return () => window.removeEventListener("resize", setter)
    },[enlarged]);

    return ( <>
        <div className={h.homie}>
          <br />
            <div className={h.homie_subs} style={{height:hei}}>
              {
                csgo_subs.slice(0,csgo_subs.length-1).map((e,i)=>
                  <button key={i}>{e}</button>
                )
              }
              <button ref={final_one} key={677}>{csgo_subs[csgo_subs.length-1]}</button>
              <button style={{display:enlarged ? "block" : "none"}}  key={111} id={h.shrink} onClick={()=>{setHei(50);setEnlarged(false)}}>&#8593;</button>
              <button id={h.showall} onClick={()=> {setHei(distanceTop!-55); setEnlarged(true)}} 
                      style={{display:distanceTop && distanceTop > 141 && !enlarged ? "block" : "none"}}>
                <span></span>
                <h4>&#8595;</h4>
              </button>
            </div>
            {/* <h1 style={{color:"whitesmoke"}}>{distanceTop && distanceTop} - {hei}</h1> */}
            <Img_slider/>
            <Items_slider/>
            {/* <div className={h.homie_wallpaper}></div> */}
            <Navbar alt_bar={alt_bar} setAlt={setAlt} modalVis={modalVis} setModalVis={setModalVis}/>
{/*             <div className={h.homie_categories}>
                <div className={h.homie_categories_each} onClick={()=>router.push("/market/tm2")}>
                    <h3>Team Fortress 2</h3>
                    <Image src={"/tm2.jpeg"} alt={"tm2"} width={800} height={400}/>
                    <div id={h.hideout}><Image src={"/banner_sword.png"} alt={"sword"} width={50} height={50}/></div>
                </div>
                <div className={h.homie_categories_each} onClick={()=>router.push("/market/csgo")}>
                    <h3>Counter Strike Global Offensive</h3>
                      <Image src={"/cs.jpeg"} alt={"tm2"} width={800} height={400}/>
                    <div id={h.hideout}><Image src={"/banner_sword.png"} alt={"sword"} width={50} height={50}/></div>
                </div>
            </div> */}
            <Items_holder />
            <br />
        </div>
    </> );
}
 
export default Homie;
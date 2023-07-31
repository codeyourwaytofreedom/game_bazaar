import h from "../styles/Home.module.css";


const Homie = () => {
    return ( <>
        <div className={h.homie}>
            <div className={h.homie_wallpaper}></div>
            <div className={h.homie_banner}>Top Banner</div>
            <div className={h.homie_categories}>
                {
                    [...Array(15)].map((item,index)=>
                        <div>Item</div>
                    )
                }
            </div>
        </div>
    </> );
}
 
export default Homie;
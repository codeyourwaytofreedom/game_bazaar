import h from "../styles/Home.module.css";


const Homie = () => {
    return ( <>
        <div className={h.homie}>
            <div className={h.homie_wallpaper}></div>
            <div className={h.homie_banner}>Top Banner</div>
            <div className={h.homie_items}>
                <div className={h.homie_items_shell}>
                    {
                        [...Array(24)].map((item,index)=>
                            <div className={h.homie_items_shell_each}>Item</div>
                        )
                    }
                </div>
            </div>
        </div>
    </> );
}
 
export default Homie;
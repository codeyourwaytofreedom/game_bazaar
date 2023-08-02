import Items_holder from "../components/Items_holder";
import Navbar from "../components/Navbar";
import tm from "../styles/Home.module.css";


const Csgo = () => {
    return ( <>  
        <div className={tm.homie}>
            <Navbar/> 
            <Items_holder/>
        </div> 
    </> );
}
 
export default Csgo;
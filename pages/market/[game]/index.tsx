import Items_holder from "../../../components/Items_holder";
import Navbar from "../../../components/Navbar";
import m from "../../../styles/Home.module.css";


const Market = () => {
    return ( <>  
        <div className={m.homie}>
            <Navbar/> 
            <Items_holder/>
        </div> 
    </> );
}
 
export default Market;
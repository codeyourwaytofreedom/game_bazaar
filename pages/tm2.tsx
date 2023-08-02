import Items_holder from "../components/Items_holder";
import Navbar from "../components/Navbar";
import tm from "../styles/Home.module.css";


const Tm_2 = () => {
    return ( <>  
        <div className={tm.homie}>
            <Navbar/> 
            <Items_holder/>
        </div> 
    </> );
}
 
export default Tm_2;
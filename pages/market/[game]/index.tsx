import Items_holder from "../../../components/Items_holder";
import Layout from "../../../components/Layout";
import Navbar from "../../../components/Navbar";
import m from "../../../styles/Home.module.css";


const Market = () => {
    return ( <>  
    <Layout searchbox={false}>
        <Items_holder/>
    </Layout>
    </> );
}
 
export default Market;
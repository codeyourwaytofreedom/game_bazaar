import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import i from "../styles/Pages.module.css";

const Inventory = () => {
    const [inventory, setInventory] = useState<any[]>();

    useEffect(() => {
        fetch('/api/inventory')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setInventory(data)
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
            });
    }, []);
    return ( 
        <Layout>
            <div className={i.inventory}>
                <h1>{inventory && inventory.length}</h1>
            </div>
        </Layout>
     );
}
 
export default Inventory;
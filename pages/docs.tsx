import e from "cors";
import React, { useState } from "react";
import Layout from "../components/Layout";
import d from "../styles/Pages.module.css";

const Docs = () => {
    const [docs, setDocs] = useState<any>();
    const [chosen,setChosen] = useState<string>();
    const endpoints = [
        {method:"GET", url:"/api/list_items", explain:"Lists priced items from inventories"},
        {method:"POST", url:"/api/remove_from_sale", explain:"Removes priced item from sale"},
        {method:"POST", url:"/api/price_update", explain:"Updates price of listed item"},
        {method:"GET", url:"/api/user", explain:"Brings user profile details"},

    ]
    const handle_docs = async (e:React.MouseEvent<HTMLButtonElement>) => {
        setChosen(e.currentTarget?.value);
        if(!docs){
            const response = await fetch('/api/doc/doc');
            const resJson = await response.json();
            setDocs(resJson.paths)
            console.log(resJson.paths)
        }
    }

    return ( 
        <Layout searchbox={false}>
            <div className={d.docs}>
                {
                    endpoints.map((ep, index) =>
                    <>

                        <button onClick={handle_docs} value={ep.url}>
                            <span>{ep.method}</span>
                            <h3>{ep.url}</h3>
                            <span>{ep.explain}</span>
                        </button>   
                        {
                            chosen === ep.url && 
                            <div className={d.docs_each}>
                                <pre>
                                { docs && JSON.stringify(docs[chosen],null, 2)}
                                </pre>
                        </div>  
                        }
                    </>
                    )
                }          
            </div>
            
        </Layout>
     );
}
 
export default Docs;
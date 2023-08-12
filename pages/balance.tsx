import Layout from "../components/Layout";
import b from "../styles/Pages.module.css";
import Image from "next/image";
import { useState } from "react";

const Balance = () => {
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Deposit","Withdraw","Transactions"]
    return ( 
        <Layout>
            <div className={b.balance}>
                <div className={b.balance_kernel}>
                    <div className={b.balance_kernel_tabs}>
                        <div className={b.balance_kernel_tabs_each}>
                            <Image src={"/wallet.png"} alt={"steam"} width={40} height={40}/>
                            <div className={b.balance_kernel_tabs_each_double}>
                                <h4>Balance</h4>
                                <h3>$ 126</h3>
                            </div>
                        </div>
                    </div>

                    <div className={b.balance_kernel_triple}>

                        <div className={b.balance_kernel_triple_buts}>
                                {
                                    tabs.map((e,i)=>
                                    <button key={i}  onClick={()=> setChosen(i)} style={{color:chosen === i ? "gold" : "whitesmoke"}}
                                    >
                                        <span>{e}</span>
                                        <span id={chosen !== i ? b.enlarge : ""}></span>
                                        <span id={b.active} style={{color:"gold", display:chosen === i ? "block" : "none"}}>&#9660;</span>
                                    </button>
                                    )
                                }
                        </div>

                        {
                            chosen === 0 ? 
                            <div className={b.balance_kernel_triple_explain}>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div>Deposit amount</div>
                                <input type={"number"} placeholder={"000"} min={1}/>
                            </div>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div>Deposit method</div>
                                <button>                    
                                    <Image src={"/bitcoin.png"} alt={"bitcoin"} width={30} height={30}/> <span>Crypto</span>
                                </button>
                                <button>
                                    <Image src={"/debit.png"} alt={"bitcoin"} width={30} height={30}/> <span>Debit Card</span>
                                </button>
                            </div>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div></div>
                                <button>
                                    <span style={{fontSize:"14px", width:"70px", padding:"3px"}}>Confirm</span>
                                </button>
                            </div>
                            </div>
                            :
                            <div className={b.balance_kernel_triple_explain}>

                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
     );
}
 
export default Balance;
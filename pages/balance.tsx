import Layout from "../components/Layout";
import b from "../styles/Pages.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const Balance = () => {
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Deposit","Withdraw","Transactions"];
    const balance = useSelector((state:any) => state.loginSlice.balance);

    console.log(balance)

/*     useEffect(()=>{
        fetch('/api/checkout').then(r=> r.text()).then(rt => window.location.href = rt)
    },[]) */
    return ( 
        <Layout>
            <div className={b.balance}>
                <div className={b.balance_kernel}>
                    <div className={b.balance_kernel_tabs}>
                        <div className={b.balance_kernel_tabs_each}>
                            <Image src={"/wallet.png"} alt={"steam"} width={50} height={50}/>
                            <div className={b.balance_kernel_tabs_each_double}>
                                <h4>Balance</h4>
                                <h3>$ {balance}</h3>
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
                            chosen === 0 || chosen === 1 ? 
                            <div className={b.balance_kernel_triple_explain}>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div>{chosen === 0 ? "Deposit" : "Withdraw"}  amount</div>
                                <input type={"number"} placeholder={"000"} min={1}/>
                            </div>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div>{chosen === 0 ? "Deposit" : "Withdraw"} method</div>
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
                                <div className={b.balance_kernel_triple_explain_transactions}>
                                    <span className={b.balance_kernel_triple_explain_transactions_tab}>Type</span>
                                    <span className={b.balance_kernel_triple_explain_transactions_tab}>Changes</span>
                                    <span className={b.balance_kernel_triple_explain_transactions_tab}>Balance ($)</span>
                                    <span className={b.balance_kernel_triple_explain_transactions_tab}>Create time</span>
                                    {
                                        [...Array(10)].map((e,i)=>
                                            <>
                                            <span>{i%2 ? "Sell" : "Buy"}</span>
                                            <span>{(Math.random() * 41 - 20).toString().substring(0,4)}</span>
                                            <span>{(Math.random() * 151 + 50).toString().substring(0,6)}</span>
                                            <span>{(new Date).toLocaleString()}</span>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
     );
}
 
export default Balance;
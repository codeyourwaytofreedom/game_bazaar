import Layout from "../components/Layout";
import b from "../styles/Pages.module.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { note_universal_feedback } from "../redux/loginSlice";
const Balance = () => {
    const dispatch = useDispatch();
    const [chosen, setChosen] = useState<number>(0);
    const tabs = ["Deposit","Withdraw","Transactions"];
    const balance = useSelector((state:any) => state.loginSlice.balance);
    const depo_amount = useRef<HTMLInputElement>(null);
    const [feedback, setFeedback] = useState<{message:string, color:string}>({message:"", color:"whitesmoke"});

    const formatter = (price:string) => {
        const price_numbered = parseFloat(price);
        const price_rounded = Math.round(price_numbered * 100) / 100;
        const price_formatted = `$${price_rounded.toFixed(2)}`;
        return price_formatted;
    }

    const checkOut = async () => {
        if(depo_amount.current && depo_amount.current.value.length !== 0){
            dispatch(note_universal_feedback({message:"Adding funds to balance",color:"gold"}))
            try{
                const response = await fetch('/api/checkout',{
                    method:"POST", body:depo_amount.current?.value
                });
                const status = response.status;
                const resJson = await response.json();
                if(status === 200){
                    if(resJson){
                        window.location.href = resJson;
                    }
                }
                else{
                    console.log(status, "Sorun var!!! Ama halledilir");
                    dispatch(note_universal_feedback({message:resJson.message,color:"red"}))
                }
            }
            catch(error){
                console.log(error)
            }
        }
        else{
            dispatch(note_universal_feedback({message:"No valid input !!!",color:"red"}));
            setTimeout(() => {
                dispatch(note_universal_feedback({message:"",color:"red"}));
            }, 1000);
        }
    }

    return ( 
        <Layout>
            <div className={b.balance}>
                <div className={b.balance_kernel}>
                    <div className={b.balance_kernel_tabs}>
                        <div className={b.balance_kernel_tabs_each}>
                            <Image src={"/wallet.png"} alt={"steam"} width={50} height={50}/>
                            <div className={b.balance_kernel_tabs_each_double}>
                                <h4>Balance</h4>
                                <h3>{formatter(balance)}</h3>
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
                                <h3 style={{color:feedback.color}}>{feedback.message}</h3>
                            <div className={b.balance_kernel_triple_explain_amount}>
                                <div>{chosen === 0 ? "Deposit" : "Withdraw"}  amount</div>
                                <input type={"number"} placeholder={"000"} min={1} ref={depo_amount}/>
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
                                <button onClick={checkOut}>
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
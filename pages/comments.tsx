import c from "../styles/Comments.module.css";
import { useEffect, useRef, useState } from "react";


const Comments = () => {

    const cmt = useRef<HTMLTextAreaElement>(null);
    const [comment, setComment] = useState("");
    const [disabled, setDisabled] = useState(false);

    const requestOptions = {
        method: 'POST',
        body: comment,
        headers: {
          'Content-Type': 'text/plain'
        }
      };

    const send_comment = () =>{
        if(cmt.current && cmt.current.value.length > 0){
            setDisabled(true);
            fetch('/api/hello',requestOptions)
              .then(
                (r) => 
                {
                    if(r.status === 200)
                    {cmt.current!.value = ""; setDisabled(false);}
                    else{
                        setDisabled(false);
                        cmt.current!.value = "Yorum ekleme başarısız";
                        cmt.current!.style.fontWeight = "bold";
                        cmt.current!.style.color = "red";
                    }
                })
        }
    }

    return ( <>
    <div className={c.comments}>
       <div>
       <h2>Yorum Geçmişi</h2>
        <div>
            {
                [...Array(7)].map((e,i)=>
                    <p key={i} style={{backgroundColor: i%2 ? "rgba($color: gray, $alpha: 0.3)" : "#2F4F4F",
                                    color: i%2 ? "rgba($color: gray, $alpha: 0.1)" : "white"}}>
                        Yorum metni burada yer alacak..
                    </p>
                )
            }
        </div>
        <br />
        <h2>Lütfen yorumlarınızı maddeler halinde ve net ifadelerle yazınız...</h2>
        <div className={c.comments_adder}>
            {
                disabled ?             
                <div className={c.comments_adder_temp}>
                    <h1>Yorum ekleniyor...</h1>
                </div> 
                : null
            }
            <span style={{color:comment.length === 500 ? "red" : "black"}}>500/{comment.length}</span>
            <textarea ref={cmt} rows={10} cols={5} maxLength={500}
                placeholder={"Yorum yazın..."} disabled={disabled}
                onChange={()=> {setComment(cmt.current!.value);cmt.current!.style.fontWeight = "normal";
                cmt.current!.style.color = "black"; }}>
                </textarea>
        </div>
        <button onClick={send_comment}>Ekle</button>
       </div>
    </div>

    </> );
}
 
export default Comments;
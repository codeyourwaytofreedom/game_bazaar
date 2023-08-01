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
                    {cmt.current!.value = ""; setDisabled(false)}
                })
        }
    }
    
    return ( <>
    <div className={c.comments}>
        <h2>Yorum Geçmişi</h2>
        <h1>{comment}</h1>
        <div>
            {
                [...Array(7)].map((e,i)=>
                    <p key={i}>{i}</p>
                )
            }
        </div>
        <h2>Lütfen yorumlarınızı maddeler halinde ve net ifadelerle yazınız...</h2>
        <div className={c.comments_adder}>
            <textarea ref={cmt} rows={10} cols={5} 
                placeholder={"Yorum yazın..."} disabled={disabled}
                onChange={()=> setComment(cmt.current!.value)}></textarea>
        </div>
        <button onClick={send_comment}>Ekle</button>
    </div>

    </> );
}
 
export default Comments;
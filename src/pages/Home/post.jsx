import React from "react"
import { NavLink } from "react-router-dom"

export default function Post(props){
    
    return(
        <>
        <div>
            <h1>{props.post.title}</h1>
        </div>
        <article>
            <p>{props.post.description}</p>
        </article>
        <section>
        <NavLink to= "/Profile" state={{clickedUser: props.post.userId}}>
            <p>@{props.post.username}</p>
        </NavLink> 

        <NavLink to= "/Profile" state={{clickedUser: props.post.userId}}>
        {props.post.pfp!=null && <img  referrerPolicy="no-referrer" src={props.post.pfp || ""} width={30} height={30}/>}
        </NavLink>
        </section>

        </>
    )
}
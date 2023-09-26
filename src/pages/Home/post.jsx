import React from "react"

export default function Post(props){
    console.log(props.post)
    return(
        <>
        <div>
            <h1>{props.post.title}</h1>
        </div>
        <article>
            <p>{props.post.description}</p>
        </article>
        <section>
            <p>@{props.post.username}</p>
        </section>

        </>
    )
}
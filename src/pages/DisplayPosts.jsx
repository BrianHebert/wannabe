import React from "react"
import { NavLink } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getDocs, where, collection, query} from "firebase/firestore"
import { auth, db } from "../config/firebase.js"
import { set } from "react-hook-form"
import "./displayposts.css"

const linkStyle ={
    textDecoration: "none"
}


export default function Post(props){
    
    const [user] = useAuthState(auth)


    //code to make it display the displayname set by the user
    const usersRef = collection(db, "users") //fetches posts documents

    const [displayName, setDisplayName] = React.useState("this works if i put litearlly anything in it")

    let nameDisplayed = ""

    async function getUser(){
        const test = query(usersRef, where("userId" , "==" , props.post.userId))
        const data = await getDocs(test)
        setDisplayName(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    React.useEffect(() => {
        getUser()
    }, [])

    if(displayName[0] != null){
        nameDisplayed = displayName[0].displayName
    }
    else{
        nameDisplayed = props.post.username
    }

    return(
        <div className="singlePost">
        <section>
            <NavLink to= "/Profile" state={{clickedUser: props.post.userId, clickedName: nameDisplayed, clickedPicture: props.post.pfp}}>
                {props.post.pfp!=null && <img  referrerPolicy="no-referrer" src={props.post.pfp || ""} className="pfp"/>}
            </NavLink>
            <NavLink to= "/Profile" state={{clickedUser: props.post.userId, clickedName: nameDisplayed, clickedPicture: props.post.pfp}} style={linkStyle}>
                <p className="username">@{nameDisplayed}</p>
            </NavLink> 
        </section>
        <div>
            <h1 className="postTitle">{props.post.title}</h1>
        </div>

        <article>
            <p className="postDescription">{props.post.description}</p>
        </article>

        { props.post.userId == user?.uid &&
            <NavLink to= "/EditPost" state={{docId: props.post.id}} style={linkStyle}><p className="editBtn">EditPost</p></NavLink>
        }

        </div>
    )
}
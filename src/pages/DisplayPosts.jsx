import React from "react"
import { NavLink } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth'
import { getDocs, where, collection, query} from "firebase/firestore"
import { auth, db } from "../config/firebase.js"
import { set } from "react-hook-form"

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
        <>
        <div>
            <h1>{props.post.title}</h1>
        </div>

        <article>
            <p>{props.post.description}</p>
        </article>

        <section>
            <NavLink to= "/Profile" state={{clickedUser: props.post.userId}}>
                <p>@{nameDisplayed}</p>
            </NavLink> 
            <NavLink to= "/Profile" state={{clickedUser: props.post.userId}}>
                {props.post.pfp!=null && <img  referrerPolicy="no-referrer" src={props.post.pfp || ""} width={30} height={30}/>}
            </NavLink>
        </section>

        { props.post.userId == user?.uid &&
            <NavLink to= "/EditPost" state={{docId: props.post.id}}>EditPost</NavLink>
        }

        </>
    )
}
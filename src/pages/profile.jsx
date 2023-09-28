import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx"
import { useAuthState } from 'react-firebase-hooks/auth'
import { addDoc, collection, serverTimestamp, getDocs,  orderBy, query, where  } from "firebase/firestore"
import { auth, db } from "../config/firebase.js"
import { useLocation } from "react-router-dom"
import { reach } from "yup"
import Post from "./DisplayPosts.jsx"




export default function Profile(props){
    const location = useLocation();
    const { clickedUser } = location.state
    const [user] = useAuthState(auth)

    const [postsList, setPostsList] = React.useState(null)
    const postsRef = collection(db, "posts")

    async function getPosts(){
        const test = query(postsRef, where("userId" , "==" , clickedUser ), orderBy("time", "desc")) //sorts by the userid
        const data = await getDocs(test)
        setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id}))) //pulls out the data that i actually need from firebase
        
        
    }

    useEffect(() => {
        getPosts()
    }, [])

    return(
        <>
        <Navbar />
        { clickedUser == user?.uid && //if the user wants to look at thier own profle this is what will show up
        <div>
        <p>{user?.displayName}</p>
        <img  referrerPolicy="no-referrer" src={user?.photoURL || ""} width={30} height={30}/>
        </div>
        }

        { //if the user wants to look at someone elses profile this will show up
        <div>
            {postsList?.map((post) => (<Post key={post.id} post={post}/> ))} {/*this loops through every post in the postLists array and returns the post component */}
        </div>
        }

        </>
    )
}
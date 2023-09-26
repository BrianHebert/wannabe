import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar.jsx"
import { getDocs, collection, orderBy, query } from "firebase/firestore"
import { db } from "../../config/firebase.js"
import { getIdToken, reload } from "firebase/auth";
import Post from "./post.jsx"

export default function Home(){
    const [postsList, setPostsList] = React.useState(null)
    const postsRef = collection(db, "posts")
    async function getPosts(){
        
        const test = query(postsRef, orderBy("time", "desc")) //sorts by timestamp
        const data = await getDocs(test)
        setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id}))) //pulls out the data that i actually need from firebase
       
        
    }
    
    

    useEffect(() => {
        getPosts()
    }, [])

    console.log(postsList)
    let sortPostsList = postsList
    return(
        
        <div>
            <Navbar />
            {postsList?.map((post) => (<Post key={post.id} post={post}/> ))} {/*this loops through every post in the postLists array and returns the post component */}
            
        </div>
    )
}
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx"
import { useAuthState } from 'react-firebase-hooks/auth'
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp, getDocs,  orderBy, query, where, updateDoc, doc  } from "firebase/firestore"
import { auth, db } from "../config/firebase.js"
import { useLocation } from "react-router-dom"
import Post from "./DisplayPosts.jsx"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import "./profile.css"





export default function Profile(props){
    const location = useLocation();
    const { clickedUser, clickedName, clickedPicture} = location.state
    const [user, loading] = useAuthState(auth)
    const navigate = useNavigate()

    const [postsList, setPostsList] = React.useState(null)
    const postsRef = collection(db, "posts")

    async function getPosts(){ //function to get all posts by the user that was clicked
        const test = query(postsRef, where("userId" , "==" , clickedUser ), orderBy("time", "desc")) //sorts by the userid
        const data = await getDocs(test)
        setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id}))) //pulls out the data that i actually need from firebase
    }

    useEffect(() => { //calls get posts function when page loads
        getPosts()
    }, [])

    //below is used to change displayname
    const usersRef = collection(db, "users")
    const updated_at_timestamp = serverTimestamp() //creates a timestamp

    const schema = yup.object().shape({
        displayName: yup.string().required("You must add a display name.").max(24,'cannot be longer than 24 chracters'),
    })

    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })

    async function createDisplayName(data){
        await addDoc(usersRef, {
            ...data,
            userId: user?.uid, 
            time: updated_at_timestamp, /* sets the timestamp upon creation */
        })
        await window.location.reload();
        
    }

    //updating username stuff
    const [displayName, setDisplayName] = React.useState(null)

    async function findDocIdInUsers(){
        const test = query(usersRef, where("userId" , "==" , clickedUser))
        const data = await getDocs(test)
       
        setDisplayName(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    useEffect(() => {
        findDocIdInUsers()
    }, [])

    const [updateName, setUpdateName] = React.useState("")

    async function findUserDoc(){
        const updateUsersRef = doc(db, "users", displayName[0]?.id) //fetches posts documents
        setUpdateName(updateUsersRef)
        
    }
    
    async function updateDisplayName(data){
        await updateDoc(updateName,
        {
            ...data
        })
        await window.location.reload();
        
    }


    //determines if user needs to create a display name or update it
    const [createOrUpdate, setCreateOrUpdate] = React.useState(false) //false means we are creating

    function areWeCreatingOrUpdating(){
        if ( displayName.length == 0){
            setCreateOrUpdate(false)
        }
        else setCreateOrUpdate(true)
    }


    //gets the current displayname 
    const [currentDisplayName, setCurrentDisplayName] = React.useState("this works if i put litearlly anything in it")

    let nameDisplayed = ""

    async function getUser(){
        const test = query(usersRef, where("userId" , "==" , user?.uid))
        const data = await getDocs(test)
        setCurrentDisplayName(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
        
    }

    if(currentDisplayName[0] != null){
        nameDisplayed = currentDisplayName[0].displayName
    }
    else{
        nameDisplayed = user?.displayName
    }

    return(
        <>
        <Navbar />

        {loading == true &&
        <></>
        }
        {loading == false &&
        < div onLoad={getUser}>

        { clickedUser == user?.uid && //if the user is looking at their own profile
        <div className="everythingSameUserProfile" onLoad={getPosts}>
        <img  referrerPolicy="no-referrer" src={user?.photoURL || ""} className="ProfilePagePFP"/>
        <h1 className="userNameProfile">{nameDisplayed}</h1>

        {createOrUpdate == false && 
        <form onSubmit={handleSubmit(createDisplayName)}>
        <div className="displayNameBtnDiv"><button className="displayNameBtn">Change Display Name</button></div>
        <input onClick={() => [findUserDoc(), areWeCreatingOrUpdating()]} placeholder="displayName..." {...register("displayName")} className="displayNameInput" required/> {/* the onclick function calls it after the displayName state is updated */}    
        {errors.displayName?.message && <p className="changeNameError" >{errors.displayName?.message}</p>}
        </form> || 
        createOrUpdate == true && 
        <form onSubmit={handleSubmit(updateDisplayName)}>
        <div className="displayNameBtnDiv"><button className="displayNameBtn">Change Display Name</button></div>
        <input onClick={() => [findUserDoc(), areWeCreatingOrUpdating()]}  placeholder="displayName..." {...register("displayName")} className="displayNameInput" required/> {/* the onclick function calls it after the displayName state is updated */}    
        {errors.displayName?.message && <p className="changeNameError">{errors.displayName?.message}</p>}
        </form>
        }
        
        </div>
        
        }

        { clickedUser != user?.uid && //if the user wants to look at a profile this will show up
        <div className="everythingDifUserProfile">
            <img  referrerPolicy="no-referrer" src={ clickedPicture || ""} className="ProfilePagePFP"/>
            <h1>{clickedName}</h1>
        </div>
        }
        {postsList?.map((post) => (<Post key={post.id} post={post}/> ))} {/*this loops through every post in the postLists array and returns the post component */}
        </div>
        }
        </>

    )
}
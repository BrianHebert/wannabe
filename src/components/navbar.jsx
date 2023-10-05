import React from "react";
import { auth, provider, db } from "../config/firebase.js"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup, onAuthStateChanged, reload } from "firebase/auth";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom"
import styled from "styled-components";
import {  collection, getDocs,  query, where } from "firebase/firestore"
import { useNavigate } from "react-router-dom";

const NavbarStyle = styled.div`
   border-bottom: black 2px solid;
`

export default function Navbar(props){

    const navigate = useNavigate()

    async function signInWithGoogle(){
        const result = await signInWithPopup(auth, provider)
        
    }

    const [user, loading] = useAuthState(auth) //loading determines if the user information is ready to be read yet


    async function signUserOut (){
        await signOut(auth)

    }
    

    //gets the username
    const usersRef = collection(db, "users") //fetches posts documents

    const [displayName, setDisplayName] = React.useState("this works if i put litearlly anything in it")

    let nameDisplayed = ""

    async function getUser(){ 
        const test = query(usersRef, where("userId" , "==" , user?.uid))
        const data = await getDocs(test)
        setDisplayName(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }

    if(displayName[0] != null){
        nameDisplayed = displayName[0].displayName
    }
    else{
        nameDisplayed = user?.displayName
    }

    

    return(
        <>{loading == true &&
        <></>
        }

        {loading == false &&
        <NavbarStyle onLoad={getUser}>
            <NavLink to={'/'} onClick={() => window.location='/'.reload()}><h1>HOME</h1></NavLink>
            {!user && //because the user becomes true when logged in it will no longer display the login button
            <div>
            <button onClick={signInWithGoogle}>Login</button>
            </div>}

            {user && 
            <div>
            <NavLink to= "/Profile" state={{clickedUser: user?.uid}} onClick={() => window.location.reload()}>
            <p>{nameDisplayed}</p>
            <img  referrerPolicy="no-referrer" src={user?.photoURL || ""} width={30} height={30}/>
            </NavLink>
            </div>}
            

            {user && 
            <div>
            <button onClick={signUserOut}>Log Out</button>
            </div>}

            {user && <NavLink to= "/CreatePost"> Create </NavLink>}
        </NavbarStyle>
        }
        </>
        
    )
}
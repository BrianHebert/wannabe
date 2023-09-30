import React from "react";
import { auth, provider } from "../config/firebase.js"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom"
import styled from "styled-components";

const NavbarStyle = styled.div`
   border-bottom: black 2px solid;
`

export default function Navbar(){

    async function signInWithGoogle(){
        const result = await signInWithPopup(auth, provider)
        
    }

    const [user] = useAuthState(auth)
    async function signUserOut (){
        await signOut(auth)

    }


    return(
        <NavbarStyle>
            <NavLink to= "/" reloadDocument><h1>HOME</h1></NavLink>
            {!user && //because the user becomes true when logged in it will no longer display the login button
            <div>
            <button onClick={signInWithGoogle}>Login</button>
            </div>}

            {user && 
            <div>
            <NavLink to= "/Profile" state={{clickedUser: user?.uid}}>
            <p>{user?.displayName}</p>
            <img  referrerPolicy="no-referrer" src={user?.photoURL || ""} width={30} height={30}/>
            </NavLink>
            </div>}
            

            {user && 
            <div>
            <button onClick={signUserOut}>Log Out</button>
            </div>}

            {user && <NavLink to= "/CreatePost"> Create </NavLink>}
            

        </NavbarStyle>
    )
}
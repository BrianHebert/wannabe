import React from "react";
import { auth, provider } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup } from "firebase/auth";
import { signOut } from "firebase/auth";

export default function Navbar(){

    async function signInWithGoogle(){
        const result = await signInWithPopup(auth, provider)
        console.log(result)
    }

    const [user] = useAuthState(auth)
    async function signUserOut (){
        await signOut(auth)

    }


    return(
        <div>
            {!user && 
            <div>
            <button onClick={signInWithGoogle}>Login</button>
            </div>}

            {user && 
            <div>
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""} width={30} height={30}/>
            </div>}

            {user && 
            <div>
            <button onClick={signUserOut}>Log Out</button>
            </div>}
        </div>
    )
}
import React from "react";
import { auth, provider } from "../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup } from "firebase/auth";

export default function Navbar(){

    async function signInWithGoogle(){
        const result = await signInWithPopup(auth, provider)
        console.log(result)
    }

    const [user] = useAuthState(auth)


    return(
        <div>
            <button onClick={signInWithGoogle}>Login</button>
            <p>{user?.displayName}</p>
            <img src={user?.photoURL || ""} width={30} height={30}/>
        </div>
    )
}
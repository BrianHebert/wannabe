import React from "react";
import { useForm } from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { addDoc, collection, serverTimestamp, query, where, getDocs} from "firebase/firestore"
import { auth, db } from "../../config/firebase.js"
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from "react-router-dom";
export default function CreateForm(){

    const updated_at_timestamp = serverTimestamp() //creates a timestamp

    const [user] = useAuthState(auth)

    const navigate = useNavigate()

    const schema = yup.object().shape({
        title: yup.string(),
        description: yup.string()

    })

    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })

    const postsRef = collection(db, "posts")

    async function onCreatePost(data){
        
        await addDoc(postsRef, {
            ...data,
            username: nameDisplayed,
            userId: user?.uid, 
            time: updated_at_timestamp, /* sets the timestamp upon creation */
            pfp: user?.photoURL
        })
        
        navigate("/")
    }


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
        <form onSubmit={handleSubmit(onCreatePost)}>
            {" "}
            <input className="titleTextbox" onClick={getUser }placeholder="Title..." {...register("title")} required/>
            <textarea className="descriptionTextBox" placeholder="Description..."{...register("description")}/>
            <input className="createSubmit" type="submit" />
        </form>
    )
}
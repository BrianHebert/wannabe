import React from "react";
import {useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import {addDoc, collection} from "firebase/firestore"
import { auth, db } from "../../config/firebase"
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from "react-router-dom";
export default function CreateForm(){

    const [user] = useAuthState(auth)

    const navigate = useNavigate()

    const schema = yup.object().shape({
        title: yup.string().required("You must add a title."),
        description: yup.string().max(500)

    })

    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })

    const postsRef = collection(db, "posts")

    async function onCreatePost(data){
        console.log(data)
        await addDoc(postsRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid
        })
        navigate("/")
    }

    return(
        <form onSubmit={handleSubmit(onCreatePost)}>
            {" "}
            <input placeholder="Title..." {...register("title")}/>
            <p style={{color: "red"}}>{errors.title?.message}</p>
            <textarea placeholder="Description..."{...register("description")}/>
            <input type="submit" />
        </form>
    )
}
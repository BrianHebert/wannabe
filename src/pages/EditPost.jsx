import { set, useForm } from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore"
import React from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../config/firebase.js"
import Navbar from "../components/navbar.jsx"
export default function EditPost(props) {
    
    const location = useLocation();
    const { docId } = location.state; 

    const [user] = useAuthState(auth);

    const navigate = useNavigate()

    const editRef = doc(db, "posts", docId) //fetches the single document from firestore that has the same id as the one clicked to get here

    const [postToEdit, setPostToEdit] = React.useState(null)

    async function getPost(){ //funtion that gets the post and stores the data into the postToEdit variable so it is displayable
    await getDoc(editRef)
        .then((post) =>{
            console.log(post.data().title)
            setPostToEdit(post.data())
        })
    }

    React.useEffect(() => { //makes it so the getPost function only runs once
        getPost()
    }, [])

    const schema = yup.object().shape({
        title: yup.string(),
        description: yup.string()

    })

    const { register, handleSubmit, formState: { errors }} = useForm({
        resolver: yupResolver(schema)
    })

    async function editButton(data){
    console.log(data.description)
    updateDoc(editRef,{
        ...data
    })
    navigate("/")
    }

    async function deletePost(){
        deleteDoc(doc(db, "posts", docId))
        navigate("/")
         
    }
    
    const [editTitle, setEditTitle] = React.useState(false)
    function changeTitle(){
        setEditTitle(prevState => !prevState)
    }

    const [editDesc, seteditDesc] = React.useState(false)
    function changeDesc(){
        seteditDesc(prevState => !prevState)
    }

    return (
        <>
        <Navbar />
        <form onSubmit={handleSubmit(editButton)}>
        <div>
            <h1>{postToEdit?.title}</h1>
            <button type="button" onClick={changeTitle}>edit title</button>
            {editTitle &&
                <input defaultValue={postToEdit?.title} {...register("title")}/>
            }
        </div>
       

        <article>
            <p>{postToEdit?.description}</p>
            <button type="button" onClick={changeDesc}>edit description</button>
            {editDesc &&
            <textarea defaultValue={postToEdit?.description} {...register("description")}/>
            }
        </article>

        <section>
            <NavLink to= "/Profile" state={{clickedUser: postToEdit?.userId}}>
                <p>@{postToEdit?.username}</p>
            </NavLink> 
            <NavLink to= "/Profile" state={{clickedUser: postToEdit?.userId}}>
                {postToEdit?.pfp!=null && <img  referrerPolicy="no-referrer" src={postToEdit?.pfp || ""} width={30} height={30}/>}
            </NavLink>
        </section>

        <button type="button" onClick={deletePost}>delete post</button>

        <input type="submit"></input>
        </form>
        </>
    );
}
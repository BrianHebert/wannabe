import { set, useForm } from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import { doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore"
import React from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from "../config/firebase.js"
import Navbar from "../components/navbar.jsx"
import "./editpost.css"

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
        <h1 className="editText">Edit a post</h1>
        <div className="editFormContainer">
        <section>
            <NavLink to= "/Profile" state={{clickedUser: postToEdit?.userId}}>
                {postToEdit?.pfp!=null && <img  referrerPolicy="no-referrer" src={postToEdit?.pfp || ""} className="pfp"/>}
            </NavLink>
            <NavLink to= "/Profile" state={{clickedUser: postToEdit?.userId}}>
                <p className="username">@{postToEdit?.username}</p>
            </NavLink> 
            
        </section>
        <form onSubmit={handleSubmit(editButton)}>
        <div className="titleEdit">
            <button className="editTitleBtn" type="button" onClick={changeTitle}><img className="editLogo"src="../src/assets/9349889.png"/></button>
            <h1 className="oldTitle">{postToEdit?.title}</h1>
            
        </div>
        {editTitle &&
                <textarea className="newTitle" defaultValue={postToEdit?.title} {...register("title")} required/>
        }
       

        <article className="descriptionEdit">
            <button className="editDescriptionBtn" type="button" onClick={changeDesc}><img className="editLogo"src="../src/assets/9349889.png"/></button>
            <p className="oldDescription">{postToEdit?.description}</p>
        </article>
        {editDesc &&
            <textarea className="newDescription" defaultValue={postToEdit?.description} {...register("description")}/>
        }

        

        <input className="editPostBtn" type="submit"></input>
        <button className="deletePostBtn" type="button" onClick={deletePost}>delete post</button>

        
        </form>
        </div>
        </>
    );
}
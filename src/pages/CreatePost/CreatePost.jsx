import React from "react";
import Navbar from "../../components/navbar.jsx"
import CreateForm from "./CreateForm.jsx";
import "./create.css"

export default function CreatePost(){


    return(
        <>
            <Navbar />
            <h1 className="createText">Create a post</h1>
            <CreateForm />
        </>
    )
}
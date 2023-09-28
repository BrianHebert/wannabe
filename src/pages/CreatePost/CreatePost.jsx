import React from "react";
import Navbar from "../../components/navbar.jsx"
import CreateForm from "./CreateForm.jsx";

export default function CreatePost(){


    return(
        <div>
            <Navbar />
            <h1>create post</h1>
            <CreateForm />
        </div>
    )
}
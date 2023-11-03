import React from "react";
import { auth, provider, db } from "../config/firebase.js"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signInWithPopup, onAuthStateChanged, reload } from "firebase/auth";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom"
import styled from "styled-components";
import {  collection, getDocs,  query, where } from "firebase/firestore"
import { useNavigate } from "react-router-dom";

const linkStyle ={
    textDecoration: "none"
}

const NavbarStyle = styled.div`
@media (min-width: 1280px){
   border: black 2px solid;
   width: 20%;
   height: 100%;
   position: fixed;
  
   h1{
    font-size: 1.5vw;
    padding-left: 2%;
    margin-top:0px;
    width: 26%;
    color: white;
   }
   h1:hover{
    background-color: rgb(64, 69, 79);
    border-radius: 25px;
    cursor:pointer;
   }

   .home{
    float: right;
  
   }
   
   .loginBtn{
    float: right;
    clear: right;
   }


   .profile{
    float: right;
    clear: right;
   }

   .imgContainer{
    width: 26%;
    float: right;
    clear: right;

   }
   
   img{
    float: left;
    width: 85%;
   }

   .logout{
    float: right;
    clear: right;

   }

   .create{
    float: right;
    clear: right;
   }
}


@media (max-width: 1279px) and (min-width: 901px){
   border: black 2px solid;
   width: 13%;
   height: 100%;
   position: fixed;
  
   h1{
    font-size: 2vw;
    margin-top: 0px;
    padding-left: 4%;
    width: 52%;
    color: white;
   }
   h1:hover{
    background-color: rgb(64, 69, 79);
    border-radius: 25px;
    cursor:pointer;
   }

   .home{
    float: right;
   }

   .loginBtn{
    float: right;
    clear: right;
   }

   .profile{
    float: right;
    clear: right;
   }

   .imgContainer{
    float: right;
    clear: right;
    width: 50%;
   }
   
   img{
    float: left;
    width: 85%;
   }

   .logout{
    float: right;
    clear: right;

   }

   .create{
    float: right;
    clear: right;
   }
}

@media (max-width: 900px){
    border: solid red 2px;
    text-decoration: none;
    h1{
        font-size: 4vw;
        margin-top: 0px;
        margin-left: 5px;
        margin-right: 5px;
        padding: 5px;
        color: white;
    }
    h1:hover{
        background-color: rgb(64, 69, 79);
        border-radius: 25px;
        cursor:pointer;
    }
    .imgContainer{
        display: none;
    }
    .everythingInNavbar{
        display: flex;
        justify-content: center;
        
    }



}
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

    function signOutAndLoadHome(){
        signUserOut()
        window.location.assign("/")
    }
    

    return(
        <>{loading == true &&
        <></>
        }

        {loading == false &&
        <NavbarStyle onLoad={getUser}>
            <div className="everythingInNavbar">
            <NavLink  to={'/'} onClick={() => window.location='/'.reload()} style={linkStyle}><h1 className="home">HOME</h1></NavLink>
            {!user && //because the user becomes true when logged in it will no longer display the login button
            <div>
            <h1  className="loginBtn" onClick={signInWithGoogle}>Login</h1 >
            </div>}

            {user && 
            <div>
            <NavLink  to= "/Profile" state={{clickedUser: user?.uid}} style={linkStyle}>
            <div className="imgContainer"> <img  referrerPolicy="no-referrer" src={user?.photoURL || ""} /></div>
            <h1 className="profile">Profile</h1>
            </NavLink>
            </div>}
            
            {user && <NavLink to= "/CreatePost" style={linkStyle}> <h1 className="create">Create</h1> </NavLink>}

            {user && 
            <div>
            <h1 className="logout" onClick={signOutAndLoadHome}>Logout</h1>
            </div>}
            </div>

            
        </NavbarStyle>
        }
        </>
        
    )
}
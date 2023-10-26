import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.jsx"
import { getDocs, collection, orderBy, query } from "firebase/firestore"
import { db, auth } from "../config/firebase.js"
import { getIdToken, reload } from "firebase/auth";
import Post from "./DisplayPosts.jsx"
import { Hits ,InstantSearch, SearchBox, Highlight} from "react-instantsearch";
import algoliasearch from 'algoliasearch';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom"
import { useAuthState } from 'react-firebase-hooks/auth'
import "./home.css"


export default function Home(){
    const [postsList, setPostsList] = React.useState(null)
    const postsRef = collection(db, "posts") //fetches posts documents

    async function getPosts(){
        const test = query(postsRef, orderBy("time", "desc")) //sorts by timestamp
        const data = await getDocs(test)
        setPostsList(data.docs.map((doc) => ({...doc.data(), id: doc.id}))) //pulls out the data that i actually need from firebase
        
    }

    useEffect(() => {
        getPosts()
    }, [])

    //starting search bar stuff
    const searchClient = algoliasearch('VLYWXCLV84', '77151a95d89f8404963f145f05d62fb1');

    const [user, loading] = useAuthState(auth)

    function Hit({ hit }) {
        
        return (
          <article>
            <div>
            <h1>{hit.title}</h1>
        </div>

        <article>
            <p>{hit.description}</p>
        </article>

        <section>
            <NavLink to= "/Profile" state={{clickedUser: hit.userId}}>
                <p>@{hit.username}</p>
            </NavLink> 
            <NavLink to= "/Profile" state={{clickedUser: hit.userId}}>
                {hit.pfp!=null && <img  referrerPolicy="no-referrer" src={hit.pfp || ""} width={30} height={30}/>}
            </NavLink>
        </section>

        { hit.userId == user?.uid &&
            <NavLink to= "/EditPost" state={{docId: hit.objectID}}>EditPost</NavLink>
        }
          </article>
        );
      }

      const [searched, setSearched] = React.useState(false)

      function handleSearch(){
        setSearched(true)
      }

      const queryHook = (query, search) => {
        handleSearch()
        search(query);
        if (query==""){
            setSearched(false)
        }
      };
      
      
    
    return(
        
        <div>
            <Navbar />
            <InstantSearch searchClient={searchClient} indexName="posts">
            <SearchBox
                classNames={{
                    root: "allOfSearch",
                    input: "searchInput",
                    submit: 'searchSubmit',
                    reset: "searchReset"
                    
                }}
                placeholder="Search for posts"
                queryHook={queryHook}
                
            />
            {searched &&
            <Hits hitComponent={Hit} 
                classNames={{
                    list: 'searchResults',
                    item: 'bitconfused'
                }}
            />
            }
            </InstantSearch>

            {!searched &&
            <div className="allPosts">
            {postsList?.map((post) => (<Post key={post.id} post={post}/> ))} {/*this loops through every post in the postLists array and returns the post component */}
            </div>
            }
        </div>
    )
}
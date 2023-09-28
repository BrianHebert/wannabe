import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost/CreatePost'
import Profile from './pages/profile'
import EditPost from "./pages/EditPost"
import './App.css'

function App() {

  return (
    <>
      <Router forceRefresh>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/EditPost" element={<EditPost />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import CreatePost from './pages/CreatePost/CreatePost'
import Profile from './pages/UserProfile/profile'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

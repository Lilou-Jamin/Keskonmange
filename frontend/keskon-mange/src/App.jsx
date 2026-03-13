import React from 'react';
import './App.css';
import Base from './pages/Base.jsx';
import MainNavigation from './components/MainNavigation.jsx';
//import axios from 'axios';

import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/login/Welcome.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/login/Register.jsx';
import Profile from './pages/profile/Profile.jsx';

import Home from './pages/Home.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

// const getAllIngredients = async () => {
//   let allIngredients = []
//   await axios.get(`${backendBaseUrl}/ingredients`).then((res) => {
//     allIngredients = res.data
//   })
//   return allIngredients
// }

// const router = createBrowserRouter([
//   {path: '/', element: <MainNavigation />, children: [
//     {path: '/', element: <Home />, loader: getAllIngredients},
//   ]},
// ])

// export default function App() {
//   return (
//     <><RouterProvider router={router} /></>
//   )
// }

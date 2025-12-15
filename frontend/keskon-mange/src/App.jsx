import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MainNavigation from './components/MainNavigation.jsx'
import axios from 'axios'

const getAllIngredients = async () => {
  let allIngredients = []
  await axios.get('http://localhost:5000/ingredients').then((res) => {
    allIngredients = res.data
  })
  return allIngredients
}

const router = createBrowserRouter([
  {path: '/', element: <MainNavigation />, children: [
    {path: '/', element: <Home />, loader: getAllIngredients},
  ]},
])

export default function App() {
  return (
    <><RouterProvider router={router} /></>
  )
}

import React from 'react'
import Navbar from '../components/Navbar'
import RecipeItem from '../components/RecipeItem'

export default function Home() {
  return (
    <>
        <h1>Bienvenue sur Keskon Mange !</h1>
        <div>
            <RecipeItem />
        </div>
    </>
  )
}

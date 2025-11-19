import React from 'react'
import { useLoaderData } from 'react-router-dom'

export default function RecipeItem() {
const allRecipes = useLoaderData()
console.log(allRecipes)
  return (
    <>
        <div>
            {allRecipes.map((recipe) => (
                <div key={recipe.id}>
                    <h2>{recipe.nom}</h2>
                </div>
            ))}
        </div>
    </>
  )
}

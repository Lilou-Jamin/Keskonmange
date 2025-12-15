import React from 'react'
import { useLoaderData } from 'react-router-dom'

export default function IngredientItem() {
const allIngredients = useLoaderData()
  return (
    <>
        <div>
            {allIngredients.map((ingredient) => (
                <div key={ingredient.id_ingredient}>
                    <h2>{ingredient.str_ingredient}</h2>
                </div>
            ))}
        </div>
    </>
  )
}

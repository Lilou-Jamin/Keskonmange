import React from 'react'
import Navbar from '../components/Navbar'
import IngredientItem from '../components/IngredientItem'
import Welcome from './login/Welcome'

export default function Base() {
  return (
    <>
        <div>
            <Welcome />
            {/* <IngredientItem /> */}
        </div>
    </>
  )
}

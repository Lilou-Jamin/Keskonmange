import React from 'react'
import HomeBlack from '../assets/home_black.svg'
import RecipesBlack from '../assets/recipes_black.svg'
import ProfileBlack from '../assets/profile_black.svg'
import HomeOrange from '../assets/home_orange.svg'
import RecipesOrange from '../assets/recipes_orange.svg'
import ProfileOrange from '../assets/profile_orange.svg'
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
        <nav className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-(--beige-color) flex justify-center items-center border-t-2 border-(--grey-color)">
          <ul className="flex w-full justify-around">
            <li>
              <NavLink to="/home" className="flex flex-col items-center">
                {({ isActive }) => (
                  <>
                    <img
                      src={isActive ? HomeOrange : HomeBlack}
                      alt="Icône accueil"
                      width={32}
                    />
                    <h2 className={isActive ? "text-orange-500" : "text-black"}>
                      Accueil
                    </h2>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/search-meal" className="flex flex-col items-center">
                {({ isActive }) => (
                  <>
                    <img src={isActive ? RecipesOrange : RecipesBlack} alt="Icône recettes" width={32} />
                    <h2 className={isActive ? "text-orange-500" : "text-black"}>Recettes</h2>
                  </>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className="flex flex-col items-center">
                {({ isActive }) => (
                  <>
                    <img src={isActive ? ProfileOrange : ProfileBlack} alt="Icône profil" width={32} />
                    <h2 className={isActive ? "text-orange-500" : "text-black"}>Profil</h2>
                  </>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>

    </>
  )
}

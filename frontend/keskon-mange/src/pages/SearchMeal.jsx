import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

export default function RecipePage() {
  return (
    <>
      <Header />
      <div className="p-4 mb-20 min-h-screen">
        <h1 className="">Rechercher</h1>
        <p className='flex justify-center text-justify'>Tu peux rechercher une recette ou sélectionner une catégorie de recettes pour trouver ton prochain repas </p>

        <div className="flex items-center border-2 border-gray-300 rounded-lg mt-4">
          <input
            type="text"
            placeholder="Rechercher une recette..."
            className="w-full px-4 py-2 focus:outline-none rounded-l-lg"
          />
        </div>
      </div>
      <Navbar />
    </>
  );
}

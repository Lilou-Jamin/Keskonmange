import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import ArrowOrange from '../assets/arrow_orange.svg';
import Navbar from '../components/Navbar';
import RecipePreview from '../components/RecipePreview';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils.js';

const fetch10RandomMeals = async () => {
  const res = await axios.get(`${backendBaseUrl}/meals/randommeals`);
  console.log(res.data);
  return res.data;
};

export default function Home() {
  const [randomMeals, setRandomMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetch10RandomMeals();
        setRandomMeals(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);
  return (
    <>
      <div className="p-4">
        <img src={Logo} alt="Keskon Mange Logo" className="" />
        <div>
          <h1 className="mt-4">Besoin d'idées de repas ?</h1>
          <p>Importez vos ingrédients et découvrez des recettes personnalisées en quelques secondes !</p>
          <div className="flex flex-row items-center gap-2">
            <img src={ArrowOrange} alt="Flèche orange" />
            <Link to="/search-meal" className="link-orange">
              Essayez
            </Link>
          </div>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {randomMeals.map((meal) => (
              <li key={meal.id_meal}>
                <RecipePreview id={meal.id_meal} title={meal.str_meal} thumb={meal.str_meal_thumb} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <Navbar />
    </>
  );
}

import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import HeartFilled from '../assets/heart_filled.svg';
import HeartOutlined from '../assets/heart_outlined.svg';

export default function RecipePage() {
    const { id } = useParams();
    const id_user = JSON.parse(localStorage.getItem('user'))?.id;
    const [nbPersonnes, setNbPersonnes] = useState(4);
    const [recipe, setRecipe] = useState(null);
    const [baseIngredients, setBaseIngredients] = useState([]);
    const [favorites, setFavorites] = useState({ isFavorite: false });

    const fetchRecipeById = async () => {
        const recipe = await axios.get(`${backendBaseUrl}/meals/${id}`);
        return recipe.data;
    };

    const fetchRecipeIngredients = async () => {
        const response = await axios.get(`${backendBaseUrl}/meals/${id}/ingredients`);
        return response.data;
    };

    const addToFavorites = async () => {
        try {
            await axios.post(`${backendBaseUrl}/users/addfavorite`, {
            id_user: JSON.parse(localStorage.getItem('user')).id,
            id_meal: id,
            });

            setFavorites({ isFavorite: true });
        } catch (e) {
            console.error(e);
        }
    };

    const removeFromFavorites = async () => {
        try {
            await axios.post(`${backendBaseUrl}/users/deletefavorite`, {
            id_user: JSON.parse(localStorage.getItem('user')).id,
            id_meal: id,
            });

            setFavorites({ isFavorite: false });
        } catch (e) {
            console.error(e);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/users/getfavorite/${id_user}`, {
            params: {
                id_user: JSON.parse(localStorage.getItem('user')).id,
                id_meal: id,
            },
            });
            return response.data;
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    const toggleFavorite = async () => {
        if (favorites.isFavorite) {
            await removeFromFavorites();
        } else {
            await addToFavorites();
        }
    };

    const updateQuantities = (newNbPersonnes) => {
        {/* on suppose que les quantités de base sont pour 4 personnes */ }
        {/* produit en croix pour ajuster les quantités en fonction du nombre de personnes */ }
        const ratio = newNbPersonnes / 4; 
        const newIngredients = baseIngredients.map((ingredient) => ({
            ...ingredient,
            quantity: Math.round(ingredient.quantity * ratio),
        }));

        setRecipe((prev) => ({
            ...prev,
            ingredients: newIngredients,
        }));
    };

    const increaseQuantity = () => {
        const newNb = nbPersonnes + 1;
        setNbPersonnes(newNb);
        updateQuantities(newNb);
    };

    const decreaseQuantity = () => {
        const newNb = Math.max(1, nbPersonnes - 1);
        setNbPersonnes(newNb);
        updateQuantities(newNb);
    };

    useEffect(() => {
        const loadRecipe = async () => {
            try {
            const recipe = await fetchRecipeById();
            const ingredients = await fetchRecipeIngredients();
            const data = {
                meal: recipe,
                ingredients: ingredients,
            };

            setRecipe(data);
            setBaseIngredients(data.ingredients);

            const favs = await fetchFavorites();
            const isFavorite = favs?.isFavorite; 
            setFavorites({ isFavorite });
            } catch (e) {
            console.error(e);
            }
        };
        loadRecipe();
    }, [id]);
  return (
    <>
      <Header />
      <div className="p-4 mb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className='text-lg font-bold mb-4'>{recipe?.meal.str_meal}</h3>
          <img src={recipe?.meal.str_meal_thumb} alt={recipe?.meal.str_meal} className="mx-auto mb-4 w-78 h-48 object-cover rounded-lg" />
          
          {/* on affiche le bouton en fonction de si la recette est déjà dans les favoris ou pas */ }
        <button type="button" className="mb-4" onClick={toggleFavorite}>
            <img src={favorites.isFavorite ? HeartFilled : HeartOutlined} alt="Icône favoris" className="inline-block h-6 w-6 mr-2" />
            {favorites.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </button>

          <h4 className='text-lg font-bold mt-4 mb-2'>Ingrédients</h4>
          {/* la quantité est ajustée en fonction du nombre de personnes */ }
          <div className="mb-4 flex justify-center items-center">
            <div className="flex items-center gap-2 py-3 px-3 text-white rounded-lg bg-[var(--yellow-color)]">
                <span type="button" onClick={decreaseQuantity} className="text-lg font-bold leading-none px-2">
                −
                </span>
                <span className="whitespace-nowrap">{nbPersonnes} personnes</span>
                <span type="button" onClick={increaseQuantity} className="text-lg font-bold leading-none px-2">
                +
                </span>
            </div>
          </div>

          <ul className='text-justify list-disc list-inside grid grid-cols-3 gap-4'>
            {recipe?.ingredients.map((ingredient, index) => (
                <div className='mx-auto text-center' key={index}>
                    <div className='bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2'>
                        <img src={ingredient.str_thumb} alt={ingredient.str_ingredient} className="inline-block h-12 w-12 object-cover rounded-full" />
                    </div>
                    {ingredient?.quantity !== 0 && (
                        <span className='font-bold'>{ingredient.quantity} {ingredient?.str_measure}</span>
                    )}
                    <p className='text-sm text-gray-600'>{ingredient?.str_ingredient}</p>
                </div>
            ))}
          </ul>

          <h4 className='text-lg font-bold mt-4 mb-2'>Étapes de préparation</h4>
          {/* split sur les sauts de ligne pour l'affichage en liste */ }
          <ul className='text-justify list-decimal list-inside'>
            {recipe?.meal?.str_instructions.split('\n').map((step, index) => (
              <li className="my-4 " key={index}>{step}</li>
            ))}
          </ul>

          <h4 className='text-lg font-bold mt-4 mb-2'>C'est terminé ? Quand as-tu pensé ?</h4>
          <button type="submit">Laisser un avis</button>
        </div>
      </div>
      <Navbar />
    </>
  );
}

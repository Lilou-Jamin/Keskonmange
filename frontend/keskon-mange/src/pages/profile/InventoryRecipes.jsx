import RecipePreview from '../../components/RecipePreview.jsx';
import Header from '../../components/Header.jsx';
import axios from 'axios';
import { backendBaseUrl } from '../../utils.js';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar.jsx';

export default function InventoryRecipes() {
  const [meals, setMeals] = useState([]);
  const id_user = JSON.parse(localStorage.getItem('user'))?.id;
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = async () => {
    const response = await axios.get(`${backendBaseUrl}/meals/search?name=&userInventory=1&id_user=${id_user}`);
    const data = response.data;
    setMeals(data);
  };

  useEffect(() => {
    const callHandleSearch = async () => {
      try {
        await handleSearch();
      } finally {
        setIsLoading(false);
      }
    };
    callHandleSearch();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 mb-20 min-h-screen">
        <p className="text-justify">
          Voici les recettes que tu peux réaliser avec les ingrédients dans ton inventaire. Tu cherches plus de recettes
          ? Va dans l'onglet recherche !
        </p>
        {isLoading && <p className="text-center w-full text-gray-700 pt-8">Chargement des recettes...</p>}
        {!isLoading && (!meals || meals.length === 0) && (
          <p className="text-center w-full text-gray-700 pt-8">
            Aucune recette disponible en fonction de tes ingrédients. Parcours toutes les recettes ou ajoute des
            ingrédients à ton inventaire !
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {meals.map((meal) => (
            <RecipePreview
              key={meal.id_meal}
              id={meal.id_meal}
              title={meal.str_meal}
              thumb={meal.str_meal_thumb}
              time={meal.prep_time}
              avg_note={meal.avg_note}
              nb_comments={meal.nb_comments}
            />
          ))}
        </div>
      </div>
      <Navbar />
    </>
  );
}

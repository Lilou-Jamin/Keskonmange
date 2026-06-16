import Navbar from '../components/Navbar';
import Header from '../components/Header';
import CategoryPreview from '../components/CategoryPreview';
import Christmas from '../assets/images/christmas.jpg';
import Vegetarian from '../assets/images/vegetarian.jpg';
import TeaTime from '../assets/images/teatime.jpg';
import Desserts from '../assets/images/desserts.jpg';
import Starters from '../assets/images/starters.jpg';
import LowCalories from '../assets/images/lowcalories.webp';
import Breakfast from '../assets/images/breakfast.jpg';
import { useEffect, useState } from "react";
import { backendBaseUrl } from '../utils';
import axios from 'axios';
import RecipePreview from '../components/RecipePreview.jsx';

export default function SearchMeal() {
  const [search, setSearch] = useState("");
  const [meals, setMeals] = useState([]);
  const [userInventory, setUserInventory] = useState(false);
  const id_user = JSON.parse(localStorage.getItem('user'))?.id;

  const handleSearch = async () => {
    const value = document.getElementById('search-input').value;
    setSearch(value);

    if (!value.trim()) {
      setMeals([]);
      return;
    }
    const response = await axios.get(`${backendBaseUrl}/meals/search?name=${value}&userInventory=${userInventory ? '1' : '0'}&id_user=${id_user}`);
    const data = response.data;
    setMeals(data);
  };

  useEffect(() => {
    const callHandleSearch = async () => {
      await handleSearch();
    }
    callHandleSearch()
  }, [userInventory])

  return (
    <>
      <Header />
      <div className="p-4 mb-20 min-h-screen">
        <h1>Rechercher</h1>

        <p className="flex justify-center text-justify">
          Tu peux rechercher une recette ou sélectionner une catégorie de recettes pour trouver ton prochain repas.
        </p>

        <div>
          <input
            className="ml-1"
            id="user-inventory"
            type="checkbox"
            checked={userInventory}
            onChange={async (e) => {
              setUserInventory(e.target.checked);
            }}
          />
          <label className="pl-2" htmlFor="user-inventory">
            Filtrer les recettes selon mes ingrédients
          </label>
        </div>

        <div className="flex items-center border-2 border-gray-300 rounded-lg mt-4">
          <input
            type="text"
            id="search-input"
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher une recette..."
            className="w-full px-4 py-2 focus:outline-none rounded-l-lg"
          />
        </div>

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

        <div className="mt-6">
          <h1 className="font-semibold mb-4">Catégories populaires</h1>
          <div className="flex flex-wrap gap-4">
            <CategoryPreview id={4} title="Brunch" category="Breakfast" thumb={Breakfast} />
            <CategoryPreview id={4} title="Faibles en calories" category="LowCarbs" thumb={LowCalories} />
            <CategoryPreview id={4} title="Tea time" category="Cake" thumb={TeaTime} />
            <CategoryPreview id={4} title="Végétarien" category="Vegetarian" thumb={Vegetarian} />
            <CategoryPreview id={1} title="Noël" category="Christmas" thumb={Christmas} />
            <CategoryPreview id={2} title="Desserts" category="Dessert" thumb={Desserts} />
            <CategoryPreview id={3} title="Entrées" category="Starter" thumb={Starters} />
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

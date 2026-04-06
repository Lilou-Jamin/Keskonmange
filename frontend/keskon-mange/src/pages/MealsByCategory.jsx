import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import RecipePreview from '../components/RecipePreview';

export default function MealsByCategory() {
  const { category } = useParams();
  const { state } = useLocation();
  const [mealsByCategory, setMealsByCategory] = useState([]);
  const title = state?.title;

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await axios.get(`${backendBaseUrl}/meals/category/${category}`);
        setMealsByCategory(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    if (category) {
      loadMeals();
    }
  }, [category]);

  return (
    <>
      <Header />
      <div className="p-4 mb-20 min-h-screen">
        <div className='flex flex-rows items-center gap-2 mb-4'>
            <h1 className="text-xl font-bold">{title}</h1>
            <span className="text-sm text-gray-600 flex">({mealsByCategory.length} recettes trouvées)</span>
        </div>
        <div className='flex flex-wrap gap-4'>
            {mealsByCategory.map((meal) => (
            
            <div key={meal.id_meal} className="shrink-0">
                <RecipePreview
                id={meal.id_meal}
                title={meal.str_meal}
                thumb={meal.str_meal_thumb}
                />
            </div>

            ))}
        </div>
      </div>
      <Navbar />
    </>
  );
}
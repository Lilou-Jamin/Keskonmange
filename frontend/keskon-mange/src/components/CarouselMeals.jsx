
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils.js';

const fetch10RandomMeals = async () => {
  const res = await axios.get(`${backendBaseUrl}/meals/randommeals`);
  console.log(res.data);
  return res.data;
};

export default function CarouselMeals() {
  const [randomMeals, setRandomMeals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetch10RandomMeals();
        setRandomMeals(data);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);
  return (
    <>
        <div>
            <h1> {title} </h1>
            <ul className="mt-4 space-y-2">
            {randomMeals.map((meal) => (
                <li key={meal.id_meal}>
                <RecipePreview
                    id={meal.id_meal}
                    title={meal.str_meal}
                    thumb={meal.str_meal_thumb}
                />
                </li>
            ))}
            </ul>
        </div>
    </>
  );
}

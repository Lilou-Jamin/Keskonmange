
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils.js';
import RecipePreview from '../components/RecipePreview.jsx';
import ChevronLeft from '../assets/chevron_left.svg';
import ChevronRight from '../assets/chevron_right.svg';

export const fetch10RandomMeals = async () => {
  const res = await axios.get(`${backendBaseUrl}/meals/randommeals`);
  return res.data;
};

export const fetch10RandomDesserts = async () => {
  const res = await axios.get(`${backendBaseUrl}/meals/randomdesserts`);
  return res.data;
};

export const fetch10RandomVegetarian = async () => {
  const res = await axios.get(`${backendBaseUrl}/meals/randomvegetarians`);
  return res.data;
};

// La fonction passée en props détermine les plats qu'on affiche dans le carousel
export default function CarouselMeals({ fetchFunction, title, storageKey }) {
  const [randomMeals, setRandomMeals] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10); // ex: "2026-03-29"
        const cachedValue = localStorage.getItem(storageKey);

        if (cachedValue) {
          const parsed = JSON.parse(cachedValue);

          if (parsed.date === today && Array.isArray(parsed.data)) {
            setRandomMeals(parsed.data);
            return;
          }
        }

        const data = await fetchFunction();
        setRandomMeals(data);

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            date: today,
            data,
          })
        );
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, [fetchFunction, storageKey]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };
return (
    <section className="mt-4 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold">{title}</h1>

        <div className="flex gap-2 ">
            <img src={ChevronLeft} className="h-6" alt="Flèche orange" onClick={scrollLeft}/>
            <img src={ChevronRight} className="h-6" alt="Flèche orange" onClick={scrollRight}/>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex w-full max-w-full gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2"
      >
        {randomMeals.map((meal) => (
          <div key={meal.id_meal} className="shrink-0">
            <RecipePreview
              id={meal.id_meal}
              title={meal.str_meal}
              thumb={meal.str_meal_thumb}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
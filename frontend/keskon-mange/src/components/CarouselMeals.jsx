
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

export default function CarouselMeals({ fetchFunction, title, storageKey }) {
  const [randomMeals, setRandomMeals] = useState([]);
  const carouselRef = useRef(null);

  const loadFromCache = () => {
    const cachedValue = localStorage.getItem(storageKey);

    if (!cachedValue) return false;

    const parsed = JSON.parse(cachedValue);

    if (Array.isArray(parsed.data)) {
      setRandomMeals(parsed.data);
      return true;
    }

    return false;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
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

  useEffect(() => {
    const handleRatingsUpdated = () => {
      loadFromCache();
    };

    window.addEventListener('ratings-updated', handleRatingsUpdated);

    return () => {
      window.removeEventListener('ratings-updated', handleRatingsUpdated);
    };
  }, [storageKey]);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <section className="mt-4 w-full max-w-full overflow-hidden">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>

        <div className="flex gap-2">
          <img
            src={ChevronLeft}
            className="h-6 cursor-pointer"
            alt="Flèche gauche"
            onClick={scrollLeft}
          />
          <img
            src={ChevronRight}
            className="h-6 cursor-pointer"
            alt="Flèche droite"
            onClick={scrollRight}
          />
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
              time={meal.prep_time}
              avg_note={meal.avg_note}
              nb_comments={meal.nb_comments}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
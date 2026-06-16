import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import ArrowOrange from '../assets/arrow_orange.svg';
import Navbar from '../components/Navbar';
import CarouselMeals, { fetch10RandomMeals, fetch10RandomDesserts, fetch10RandomVegetarian } from '../components/CarouselMeals.jsx';

export default function Home() {
  const loading = false;

  return (
    <>
      <div className="min-h-screen mb-20 w-full overflow-x-hidden">
        <div className="p-4">
          <img src={Logo} alt="Keskon Mange Logo" className="" />
          <div>
            <h2 className="mt-4">Besoin d'idées de repas ?</h2>
            <p className='text-justify'>Importe tes ingrédients et découvre des recettes personnalisées en quelques secondes !</p>
            <div className="flex flex-row items-center gap-2">
              <img src={ArrowOrange} alt="Flèche orange" />
              <Link to="/search-meal" className="link-orange">
                Essayer
              </Link>
            </div>
          </div>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div>
              {/* la clé local sert à différencier les données dans le localStorage pour le refresh toutes les 24h */ } 
              <CarouselMeals fetchFunction={fetch10RandomMeals} title="Les 10 recettes du jour" storageKey="carousel-random-meals"/>
              <CarouselMeals fetchFunction={fetch10RandomDesserts} title="Envie de sucré ?" storageKey="carousel-random-desserts"/>
              <CarouselMeals fetchFunction={fetch10RandomVegetarian} title="Repas sans viande" storageKey="carousel-random-vegetarians"/>
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </>
  );
}

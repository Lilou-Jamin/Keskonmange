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

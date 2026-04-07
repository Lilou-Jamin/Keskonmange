import Navbar from '../../components/Navbar.jsx';
import axios from 'axios';
import { backendBaseUrl } from '../../utils.js';
import { useEffect, useState } from 'react';
import Header from '../../components/Header.jsx';

function PopupEdit({ ingredient, setShowPopup }) {
  const [newQuantity, setNewQuantity] = useState(ingredient.qty);

  const decreaseQuantity = () => {
    setNewQuantity(Math.max(0, newQuantity - 1));
  };

  const increaseQuantity = () => {
    setNewQuantity(newQuantity + 1);
  };

  const submitNewQuantity = async () => {
    const addedOrRemovedQuantity = ingredient.is_countable ? -(ingredient.qty - newQuantity) : -ingredient.qty;

    await axios.post(`${backendBaseUrl}/inventory`, {
      idIngredient: ingredient.id_ingredient,
      quantity: addedOrRemovedQuantity,
    });
    setShowPopup(false);
  };

  return (
    <div className="w-full h-full bg-black/50 absolute z-10 flex">
      <div className="self-center text-center w-full">
        <div className="mx-8 py-4 bg-(--light-grey-color) rounded-[3rem]">
          <div className="mx-auto">
            <div className="bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2">
              <img
                src={ingredient.str_thumb}
                alt={ingredient.str_ingredient}
                className="inline-block h-12 w-12 object-cover rounded-full"
              />
            </div>
            <p className="text-sm text-gray-600">{ingredient?.str_ingredient}</p>
          </div>
          {ingredient.is_countable && (
            <div className="flex justify-center items-center">
              <div className="flex items-center gap-2 m-2 py-2 px-3 text-white rounded-lg bg-(--yellow-color)">
                {/* TODO: Add long press event to directly go to 0 */}
                <span type="button" onClick={decreaseQuantity} className="text-lg font-bold leading-none px-2">
                  −
                </span>
                <span className="whitespace-nowrap">{newQuantity}</span>
                <span type="button" onClick={increaseQuantity} className="text-lg font-bold leading-none px-2">
                  +
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center gap-4">
            <button type="button" onClick={() => setShowPopup(false)}>
              Annuler
            </button>
            <button type="button" onClick={() => submitNewQuantity()}>
              {!ingredient.is_countable || newQuantity === 0 ? 'Supprimer' : 'Confirmer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const [inventory, setInventory] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const editIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowPopup(true);
  };

  const fetchInventory = async () => {
    const inventory = await axios.get(`${backendBaseUrl}/inventory?joined=1`);
    return inventory.data;
  };

  useEffect(() => {
    const getInventory = async () => {
      try {
        const inventory = await fetchInventory();
        setInventory(inventory);
      } catch (e) {
        console.error("Erreur lors de la récupération de l'inventaire utilisateur:", e);
      }
    };
    getInventory();
  }, [showPopup]);

  return (
    <>
      <div>
        {showPopup && <PopupEdit ingredient={selectedIngredient} setShowPopup={setShowPopup} />}
        <Header />
        <div className="p-4 min-h-screen flex justify-center">
          <div className="text-center w-full">
            <div className="flex items-center justify-between w-full">
              <h2>Mes ingrédients</h2>
              {/* TODO: Implement adding ingredients */}
              <div className="flex gap-3 mr-1">
                <button type="button" className="w-[40px] h-[40px] !p-0">
                  +
                </button>
              </div>
            </div>
            <div className="border-2 border-(--light-grey-color) rounded-lg py-2">
              <div className="grid grid-cols-3 pt-3">
                {inventory?.map((ingredient, index) => (
                  <div className="mx-auto text-center" key={index} onClick={() => editIngredient(ingredient)}>
                    <div className="bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2">
                      {ingredient.is_countable && (
                        <div className="absolute ml-9 -mt-2 min-w-6 h-6 flex items-center justify-center rounded-full bg-(--orange-color)">
                          <span className="text-white !my-0 p-1.5 leading-none whitespace-nowrap">
                            {ingredient.qty}
                          </span>
                        </div>
                      )}
                      <img
                        src={ingredient.str_thumb}
                        alt={ingredient.str_ingredient}
                        className="inline-block h-12 w-12 object-cover rounded-full"
                      />
                    </div>
                    <p className="text-sm text-gray-600">{ingredient?.str_ingredient}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

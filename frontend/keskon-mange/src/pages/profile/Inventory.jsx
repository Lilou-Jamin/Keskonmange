import Navbar from '../../components/Navbar.jsx';
import axios from 'axios';
import { backendBaseUrl } from '../../utils.js';
import { useEffect, useState } from 'react';
import Header from '../../components/Header.jsx';
import SearchIcon from '../../assets/search_black.svg';
import TrashcanIcon from '../../assets/trashcan.svg';
import { useNavigate } from 'react-router-dom';

function PopupEdit({ ingredient, setShowPopup }) {
  const [newQuantity, setNewQuantity] = useState(ingredient.qty);

  const decreaseQuantity = () => {
    setNewQuantity(Math.max(1, newQuantity - 1));
  };

  const increaseQuantity = () => {
    setNewQuantity(newQuantity + 1);
  };

  const submitNewQuantity = async () => {
    const addedOrRemovedQuantity = -(ingredient.qty - newQuantity);

    await axios.post(`${backendBaseUrl}/inventory`, {
      idIngredient: ingredient.id_ingredient,
      quantity: addedOrRemovedQuantity,
    });
    setShowPopup(false);
  };

  const removeFromInventory = async () => {
    await axios.post(`${backendBaseUrl}/inventory`, {
      idIngredient: ingredient.id_ingredient,
      // This will remove the ingredient form the inventory since the quantity will then be 0
      quantity: -ingredient.qty,
    });
    setShowPopup(false);
  };

  return (
    <div className="w-full h-full bg-black/50 fixed z-10 flex">
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
            {ingredient.is_countable && (
              <button type="button" onClick={() => submitNewQuantity()}>
                Confirmer
              </button>
            )}
            <button type="button" onClick={() => removeFromInventory()} className="!p-[0.5rem]">
              {/* HACK: Brightness 1000% is to turn the svg icon white */}
              <img src={TrashcanIcon} className="brightness-1000" alt="Supprimer" width={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PopupAdd({ setShowAddPopup, setShowEditPopup, setSelectedIngredient, inventory }) {
  const [ingredients, setIngredients] = useState(null);

  const handleTextChange = async (text) => {
    if (text.length < 2) {
      setIngredients(null);
      return;
    }

    const res = await axios.get(`${backendBaseUrl}/ingredients?search=${text}`);
    setIngredients(res.data ?? null);
  };

  const addIngredient = async (idIngredient) => {
    // We don't want to add quantity to an existing ingredient and make unecessary API calls if it already exists.
    let ingredient = inventory.find((ingredient) => ingredient.id_ingredient === idIngredient);
    if (!ingredient) {
      await axios.post(`${backendBaseUrl}/inventory`, {
        idIngredient,
        quantity: 1,
      });
      const response = await axios.get(`${backendBaseUrl}/inventory/${idIngredient}?joined=1`, {
        idIngredient,
        quantity: 1,
      });
      ingredient = response.data;
    }

    setShowAddPopup(false);
    if (ingredient.is_countable) {
      setSelectedIngredient(ingredient);
      setShowEditPopup(true);
    }
  };

  return (
    <div className="w-full h-full bg-black/50 fixed z-10 flex">
      <div className="self-center text-center w-full">
        <div className="mx-8 py-4 bg-(--light-grey-color) rounded-[3rem]">
          <div className="py-2 px-2 mt-2 mx-4 rounded-[1rem] bg-(--beige-color)">
            <div
              onClick={() => document.getElementById('search-input').focus()}
              className="flex border-b-2 border-b-(--grey-color)"
            >
              <img src={SearchIcon} alt="Rechercher" width={32} />
              <input
                id="search-input"
                onInput={(event) => handleTextChange(event.target.value)}
                type="text"
                className="ml-2 z-20"
              />
            </div>
            <div className="mt-2">
              {/*
              - Si pas d'ingrédients, on affiche rien (input < 2 lettres, erreur serveur, état initial)
              - Si liste ingrédients vide, on affiche 'Aucun résultat'
              */}
              {ingredients == null ? (
                ''
              ) : !Array.isArray(ingredients) || ingredients.length === 0 ? (
                'Aucun résultat'
              ) : (
                <div className="grid grid-cols-2 pt-3 max-h-[50vh] overflow-scroll">
                  {ingredients.map((ingredient) => {
                    return (
                      <div
                        className="mx-auto text-center"
                        key={ingredient.id_ingredient}
                        onClick={() => addIngredient(ingredient.id_ingredient)}
                      >
                        <div className="bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2">
                          <img
                            src={ingredient.str_thumb}
                            alt={ingredient.str_ingredient}
                            className="inline-block h-10 w-10 object-cover rounded-full"
                          />
                        </div>
                        <p className="text-xs text-gray-600">{ingredient?.str_ingredient}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button type="button" onClick={() => setShowAddPopup(false)}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleAddIngredient = () => {
    setShowAddPopup(true);
  };

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
  }, [showPopup, showAddPopup]);

  return (
    <>
      <div>
        {showPopup && <PopupEdit ingredient={selectedIngredient} setShowPopup={setShowPopup} />}
        {showAddPopup && (
          <PopupAdd
            setShowAddPopup={setShowAddPopup}
            setShowEditPopup={setShowPopup}
            setSelectedIngredient={setSelectedIngredient}
            inventory={inventory}
          />
        )}
        <Header />
        <div className="p-4 min-h-screen flex justify-center">
          <div className="text-center w-full">
            <div className="flex items-center justify-between w-full">
              <h2>Mes ingrédients</h2>
              <div className="flex gap-3 mr-1">
                <button type="button" className="w-[40px] h-[40px] !p-0" onClick={() => handleAddIngredient()}>
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
            {inventory && inventory.length !== 0 && (
              <button className="mb-[6rem]!" onClick={() => navigate('/profile/inventory/recipes')}>
                Voir mes recettes
              </button>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

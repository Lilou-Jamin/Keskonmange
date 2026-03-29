import Navbar from '../../components/Navbar.jsx';
import Logo from '../../assets/logo.svg';
import axios from 'axios';
import { backendBaseUrl } from '../../utils.js';
import { useEffect, useState } from 'react';

export default function Inventory() {
  const [inventory, setInventory] = useState(null);

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
  }, []);

  console.log(inventory);

  return (
    <>
      <div className="p-4 min-h-screen flex justify-center">
        <div className="text-center w-full">
          <img src={Logo} alt="Keskon Mange Logo" className="mx-auto mb-8" />
          <div className="flex items-center justify-between w-full">
            <h2>Mes ingrédients</h2>
            <div className="flex gap-3">
              <button type="button" className="w-[40px] h-[40px] !p-0">
                +
              </button>
              <button type="button" className="w-[40px] h-[40px] !p-0">
                -
              </button>
            </div>
          </div>
          <div className="border-2 border-(--light-grey-color) rounded-lg py-2">
            <div className="grid grid-cols-3 pt-3">
              {inventory?.map((ingredient, index) => (
                <div className="mx-auto text-center" key={index}>
                  <div className="bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2">
                    {ingredient?.qty > 1 && (
                      <div className="absolute ml-9 -mt-2 min-w-6 h-6 flex items-center justify-center rounded-full bg-(--orange-color)">
                        <span className="text-white !my-0 p-1.5 leading-none whitespace-nowrap">
                          {ingredient.qty == 3 ? '3' : '200'}
                        </span>
                      </div>
                    )}
                    <img
                      src={ingredient.str_thumb}
                      alt={ingredient.str_ingredient}
                      className="inline-block h-12 w-12 object-cover rounded-full"
                    />
                  </div>
                  {/*{ingredient?.qty !== 0 && (*/}
                  {/*  <span className="font-bold">*/}
                  {/*    {ingredient.qty} {ingredient?.str_measure}*/}
                  {/*  </span>*/}
                  {/*)}*/}
                  <p className="text-sm text-gray-600">{ingredient?.str_ingredient}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

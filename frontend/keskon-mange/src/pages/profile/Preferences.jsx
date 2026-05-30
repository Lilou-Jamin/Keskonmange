import RecipePreview from "../../components/RecipePreview";
import axios from "axios";
import { backendBaseUrl } from "../../utils";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

export default function Favorites() {
    const [preferences, setPreferences] = useState([]);
    const id_user = JSON.parse(localStorage.getItem('user'))?.id;

    const [diets, setDiets] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [ingredientSearch, setIngredientSearch] = useState('');
    const [ingredients, setIngredients] = useState([]);

    const fetchPreferences = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/users/getPreferences/${id_user}`);
            const prefs = response.data.preferences?.[0];

            return prefs || { diets: [], allergies: []};
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
    const loadPreferences = async () => {
        if (!id_user) return;

        const prefs = await fetchPreferences();

        setDiets(prefs.diets || []);
        setAllergies(prefs.allergies || []);
    };

    loadPreferences();
    }, [id_user]);

    useEffect(() => {
    if (!ingredientSearch.trim()) {
        setIngredients([]);
        return;
    }

    const timeout = setTimeout(async () => {
        try {
        const response = await axios.get(
            `${backendBaseUrl}/ingredients?search=${ingredientSearch}`,
            {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            }
        );

        setIngredients(response.data || []);
        } catch (e) {
        console.error(e);
        setIngredients([]);
        }
    }, 300);

    return () => clearTimeout(timeout);
    }, [ingredientSearch]);

    return (
        <>
            <Header />
            <div className="p-4 mb-20 min-h-screen">
                <div className='gap-2 mb-8'>
                    <h1 className="text-xl font-bold">Mes préférences alimentaires</h1>
                    <p className="text-justify">Enregistre tes préférences alimentaires pour que nous te proposions des recettes adaptées à tes goûts et besoins.</p>
                </div>
                
                <div className="mb-4">
                    <h2>Je choisis mon régime alimentaire</h2>
                    <div className="flex justify-center">
                    <select className="input w-full max-w-xs mb-2" value={diets[0] || ''} onChange={(e) => {
                        const value = e.target.value;
                        if (value) {
                            setDiets([value]);
                        } else {
                            setDiets([]);
                        }
                    }}>
                        <option value="omnivore">❌ Aucun régime particulier</option>
                        <option value="vegetarian">🥦 Végétarien (sans viande ni poisson)</option>
                        <option className="text-wrap" value="vegan">🥚 Végétalien (sans produits d'origine animale)</option>
                    </select>
                    </div>
                </div>
                
                <div className="mb-4">
                    <h2>Je renseigne mes allergies</h2>

                    <input
                    type="text"
                    list="ingredients"
                    value={ingredientSearch}
                    placeholder="Lait, oeuf, soja..."
                    className="input w-full max-w-xs mb-2"
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && ingredientSearch.trim()) {
                        e.preventDefault();

                        const ingredient = ingredientSearch.trim();

                        if (!allergies.includes(ingredient)) {
                            setAllergies([...allergies, ingredient]);
                        }

                        setIngredientSearch('');
                        setIngredients([]);
                        }
                    }}
                    />

                    <datalist id="ingredients">
                    {ingredients.map((ing) => (
                        <option
                        key={ing.id_ingredient}
                        value={ing.str_ingredient}
                        />
                    ))}
                    </datalist>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                        {allergies.length === 0 ? (
                        <p>Aucune allergie renseignée</p>
                        ) : (
                            allergies.map((allergy) => (
                                <div key={allergy} className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded">
                                {allergy}
                                <button onClick={() => setAllergies(allergies.filter((a) => a !== allergy))} className="text-red-500 hover:text-red-700">
                                    &times;
                                </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button className="btn mt-4" onClick={() => {
                        axios.post(`${backendBaseUrl}/users/updatepreferences/${id_user}`, {
                        diets,
                        allergies,
                        }).catch(() => {                        
                            alert('Erreur lors de la mise à jour des préférences');
                        });
                    }}>Enregistrer</button>
                </div>
            </div>

            <Navbar />
        </>
    );
}
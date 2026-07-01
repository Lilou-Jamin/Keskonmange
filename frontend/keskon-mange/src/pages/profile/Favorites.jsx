import RecipePreview from "../../components/RecipePreview";
import axios from "axios";
import { backendBaseUrl } from "../../utils";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const id_user = JSON.parse(localStorage.getItem('user'))?.id;

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${backendBaseUrl}/users/getfavorites/${id_user}`, {
                    params: {
                        id_user: JSON.parse(localStorage.getItem('user')).id,
                    },
                }
            );
            return response.data.favorites || [];
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    useEffect(() => {
        const loadFavorites = async () => {
            const favs = await fetchFavorites();
            setFavorites(favs);
        };

        loadFavorites();
    }, [id_user]);

    return (
        <>
            <Header />

            <div className="p-4 mb-20 min-h-screen">
                <div className='flex flex-rows items-center gap-2 mb-4'>
                    <h1 className="text-xl font-bold">Mes recettes favorites</h1>
                    <span className="text-sm text-gray-600 flex mt-1">({favorites.length})</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.length > 0 ? (
                        favorites.map((meal) => (
                            <RecipePreview
                                key={meal.id_meal}
                                id={meal.id_meal}
                                title={meal.str_meal}
                                thumb={meal.str_meal_thumb}
                                time={meal.prep_time}
                                avg_note={meal.avg_note}
                                nb_comments={meal.nb_comments}
                            />
                        ))
                    ) : (
                        <p>Vous n'avez pas encore de recettes favorites.</p>
                    )}
                </div>
            </div>

            <Navbar />
        </>
    );
}
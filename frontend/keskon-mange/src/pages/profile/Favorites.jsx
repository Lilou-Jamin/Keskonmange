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

            <div className="p-4 min-h-screen">
                <h1 className="mb-4">Mes recettes favorites</h1>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.length > 0 ? (
                        favorites.map((meal) => (
                            <RecipePreview
                                key={meal.id_meal}
                                id={meal.id_meal}
                                title={meal.str_meal}
                                thumb={meal.str_meal_thumb}
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
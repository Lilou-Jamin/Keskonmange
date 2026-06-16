import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendBaseUrl } from '../utils';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import HeartFilled from '../assets/heart_filled.svg';
import HeartOutlined from '../assets/heart_outlined.svg';
import StarFilled from '../assets/star_fullfilled.svg';
import StarHalf from '../assets/star_half.svg';
import StarOutlined from '../assets/star_lined.svg';
import Trashcan from '../assets/trashcan.svg';
import RatingStars from '../components/RatingStars';

function PopupDone({ setShowDoneRecipeModal, nbPersonnes, mealId }) {
  const handleDoneRecipe = async () => {
    setShowDoneRecipeModal(false);
    await axios.put(`${backendBaseUrl}/inventory/meal/${mealId}?for=${nbPersonnes}`);
  };

  return (
    <div className="w-full h-full bg-black/50 fixed z-10 flex">
      <div className="self-center text-center w-full">
        <div className="mx-8 py-4 bg-(--light-grey-color) rounded-[3rem]">
          <div className="py-2 px-2 mt-2 mx-4 rounded-[1rem] bg-(--beige-color)">
            <h4 className="text-lg font-bold mb-2">Confirmation</h4>
            <div className="mb-2">Mettre à jour l'inventaire avec les ingrédients pour {nbPersonnes} personnes ?</div>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleDoneRecipe()}>Confirmer</button>
              <button onClick={() => setShowDoneRecipeModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipePage() {
  const { id } = useParams();
  const id_user = JSON.parse(localStorage.getItem('user'))?.id;
  const [nbPersonnes, setNbPersonnes] = useState(4);
  const [recipe, setRecipe] = useState(null);
  const [baseIngredients, setBaseIngredients] = useState([]);
  const [favorites, setFavorites] = useState({ isFavorite: false });
  const [commentaire, setComment] = useState('');
  const [note, setNote] = useState(0);
  const [avgNote, setAvgNote] = useState(0);
  const [nbComments, setNbComments] = useState(0);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showDoneRecipeModal, setShowDoneRecipeModal] = useState(false);
  const [commentaires, setCommentaires] = useState([]);
  
  const fetchRecipeById = async () => {
    const recipe = await axios.get(`${backendBaseUrl}/meals/${id}`);
    return recipe.data;
  };

  const fetchRecipeIngredients = async () => {
    const response = await axios.get(`${backendBaseUrl}/meals/${id}/ingredients`);
    return response.data;
  };

  const addToFavorites = async () => {
    try {
      await axios.post(`${backendBaseUrl}/users/addfavorite`, {
        id_user: JSON.parse(localStorage.getItem('user')).id,
        id_meal: id,
      });

      setFavorites({ isFavorite: true });
    } catch (e) {
      console.error(e);
    }
  };

  const removeFromFavorites = async () => {
    try {
      await axios.post(`${backendBaseUrl}/users/deletefavorite`, {
        id_user: JSON.parse(localStorage.getItem('user')).id,
        id_meal: id,
      });

      setFavorites({ isFavorite: false });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/users/getfavorite/${id_user}`, {
        params: {
          id_user: JSON.parse(localStorage.getItem('user')).id,
          id_meal: id,
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const toggleFavorite = async () => {
    if (favorites.isFavorite) {
      await removeFromFavorites();
    } else {
      await addToFavorites();
    }
  };

  const updateQuantities = (newNbPersonnes) => {
    {
      /* on suppose que les quantités de base sont pour 4 personnes */
    }
    {
      /* produit en croix pour ajuster les quantités en fonction du nombre de personnes */
    }
    const ratio = newNbPersonnes / 4;
    const newIngredients = baseIngredients.map((ingredient) => ({
      ...ingredient,
      quantity: Math.round(ingredient.quantity * ratio),
    }));

    setRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const increaseQuantity = () => {
    const newNb = nbPersonnes + 1;
    setNbPersonnes(newNb);
    updateQuantities(newNb);
  };

  const decreaseQuantity = () => {
    const newNb = Math.max(1, nbPersonnes - 1);
    setNbPersonnes(newNb);
    updateQuantities(newNb);
  };

  const addComment = async () => {
    if (hasAlreadyCommented) {
      alert('Vous avez déjà écrit un commentaire pour cette recette.');
      return;
    }
    try {
      await axios.post(`${backendBaseUrl}/meals/${id}/addcomment`, {
        id_meal: id,
        id_user: JSON.parse(localStorage.getItem('user')).id,
        commentaire: commentaire,
        note: note,
        date: new Date(),
      });

      setComment('');
      setNote(0);

      await loadCommentaires();
      setShowCommentForm(false);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'ajout du commentaire");
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${backendBaseUrl}/meals/${id}/deletecomment`, {
        data: {
          id_user: JSON.parse(localStorage.getItem('user')).id,
          id_meal: id,
          id_comment: commentId,
        },
      });
      await loadCommentaires();
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la suppression du commentaire');
    }
  };

  const fetchCommentaires = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/meals/${id}/getcomments`);
      return response.data;
    } catch (e) {
      console.error(e);
      alert('Erreur lors du chargement des commentaires');
      return [];
    }
  };

  const hasAlreadyCommented = commentaires.some((commentaire) => commentaire.id_user === id_user);
  
  // on recharge le cache des carousels 24h pour faire apparaître la note moyenne
  const updateMealRatingInCache = (idMeal, avg_note, nb_comments) => {
    const keys = [
      'carousel-random-meals',
      'carousel-random-desserts',
      'carousel-random-vegetarians',
    ];

    keys.forEach((key) => {
      const cachedValue = localStorage.getItem(key);
      if (!cachedValue) return;

      const parsed = JSON.parse(cachedValue);

      if (!Array.isArray(parsed.data)) return;

      const updatedData = parsed.data.map((meal) =>
        Number(meal.id_meal) === Number(idMeal)
          ? { ...meal, avg_note, nb_comments }
          : meal
      );

      localStorage.setItem(
        key,
        JSON.stringify({...parsed, data: updatedData,})
      );
    });
  };

  const loadCommentaires = async () => {
    const commentairesData = await fetchCommentaires();
    const avis = commentairesData || [];

    setCommentaires(avis);

    const nb = avis.length;

    const avg =
      nb > 0
        ? avis.reduce((sum, commentaire) => sum + Number(commentaire.note), 0) / nb
        : 0;

    setAvgNote(avg);
    setNbComments(nb);

    updateMealRatingInCache(id, avg, nb);
    window.dispatchEvent(new Event('ratings-updated'));
  };

    const getStars = (note) => {
        const safeNote = Math.min(Math.max(note || 0, 0), 5);

        return [...Array(5)].map((_, i) => {
        if (safeNote >= i + 1) return "full";
        if (safeNote >= i + 0.5) return "half";
        return "empty";
        });
    };

  const toggleCommentForm = () => {
    setShowCommentForm((prev) => !prev);
  };

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipe = await fetchRecipeById();
        const ingredients = await fetchRecipeIngredients();

        const data = {
          meal: recipe,
          ingredients,
        };

        setRecipe(data);
        setBaseIngredients(data.ingredients);

        const favs = await fetchFavorites();
        const isFavorite = !!favs?.isFavorite;
        setFavorites({ isFavorite });

        await loadCommentaires();
      } catch (e) {
        console.error(e);
      }
    };

    loadRecipe();
  }, [id]);
  return (
    <>
      {showDoneRecipeModal && (
        <PopupDone setShowDoneRecipeModal={setShowDoneRecipeModal} nbPersonnes={nbPersonnes} mealId={id} />
      )}
      <Header />
      <div className="p-4 mb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-bold">{recipe?.meal.str_meal}</h3>
          <div className="flex justify-center mb-4 ">
            {/* on affiche la note moyenne sous forme d'étoiles et le nombre total d'avis */ }
            <RatingStars
              avgNote={avgNote}
              nbComments={nbComments}
              showValue={true}
              size="h-5 w-5"
            />
          </div>
          <img
            src={recipe?.meal.str_meal_thumb}
            alt={recipe?.meal.str_meal}
            className="mx-auto mb-4 w-78 h-48 object-cover rounded-lg"
          />

          {/* on affiche le bouton en fonction de si la recette est déjà dans les favoris ou pas */}
          <button type="button" className="mb-4" onClick={toggleFavorite}>
            <img
              src={favorites.isFavorite ? HeartFilled : HeartOutlined}
              alt="Icône favoris"
              className="inline-block h-6 w-6 mr-2"
            />
            {favorites.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </button>

          <h4 className="text-left text-lg font-bold mt-4 mb-2">Ingrédients</h4>
          {/* la quantité est ajustée en fonction du nombre de personnes */}
          <div className="mb-4 flex justify-center items-center">
            <div className="flex items-center gap-2 m-2 py-2 px-3 text-white rounded-lg bg-(--yellow-color)">
              <span type="button" onClick={decreaseQuantity} className="text-lg font-bold leading-none px-2">
                −
              </span>
              <span className="whitespace-nowrap">{nbPersonnes} personnes</span>
              <span type="button" onClick={increaseQuantity} className="text-lg font-bold leading-none px-2">
                +
              </span>
            </div>
          </div>

          <ul className="text-justify list-disc list-inside grid grid-cols-3 gap-4">
            {recipe?.ingredients.map((ingredient, index) => (
              <div className="mx-auto text-center" key={index}>
                <div className="bg-gray-200 rounded-full p-1 w-fit mx-auto mb-2">
                  <img
                    src={ingredient.str_thumb}
                    alt={ingredient.str_ingredient}
                    className="inline-block h-12 w-12 object-cover rounded-full"
                  />
                </div>
                {ingredient?.quantity !== 0 && (
                  <span className="font-bold">
                    {ingredient.quantity} {ingredient?.str_measure}
                  </span>
                )}
                <p className="text-sm text-gray-600">{ingredient?.str_ingredient}</p>
              </div>
            ))}
          </ul>

          <h4 className="text-left text-lg font-bold mt-12 mb-2">Étapes de préparation</h4>
          {/* split sur les sauts de ligne pour l'affichage en liste */}
          <ul className="text-justify list-decimal list-inside">
            {recipe?.meal?.str_instructions.split('\n').map((step, index) => (
              <li className="my-4 " key={index}>
                {step}
              </li>
            ))}
          </ul>

          <h4 className="text-lg font-bold mt-12">C'est terminé ? Met à jour ton inventaire et donne ton avis !</h4>
          <button type="button" onClick={() => setShowDoneRecipeModal(true)} className="block ml-auto! mr-auto!">
            Mettre à jour l'inventaire
          </button>
          {hasAlreadyCommented ? (
            <p className="text-sm text-gray-600">Vous avez déjà laissé un commentaire pour cette recette</p>
          ) : (
            <button
              type="button"
              onClick={toggleCommentForm}
              className="px-4 py-2 bg-(--yellow-color) text-white rounded-lg mb-4"
            >
              {showCommentForm ? 'Annuler' : 'Ajouter un commentaire'}
            </button>
          )}

          <div className="p-4" style={{ display: showCommentForm ? 'block' : 'none' }}>
            <span className="underline text-left flex font-bold mb-2">{recipe?.meal.str_meal}</span>
            <input type="hidden" name="note" value={note} />
            <div className="flex items-center mb-2">
              <span className="mr-2">Ta note :</span>
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < note ? StarFilled : StarOutlined}
                  alt={i < note ? 'Étoile pleine' : 'Étoile vide'}
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setNote(i + 1)}
                />
              ))}
            </div>
            <textarea
              name="commentaire"
              className="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none"
              placeholder="Écris ton commentaire ici..."
              value={commentaire}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" onClick={addComment} className="px-4 bg-(--yellow-color) text-white rounded-lg">
              Envoyer
            </button>
          </div>

          <div>
            <h4 className="text-left text-lg font-bold mt-4 mb-2">Commentaires</h4>
            {commentaires.length === 0 ? (
              <p className="text-gray-600 text-sm">Aucun commentaire pour le moment</p>
            ) : (
              <ul className="space-y-4">
                {commentaires.map((commentaire, index) => (
                  <li key={index} className="border border-gray-300 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full border-(--yellow-color) border-2 text-(--yellow-color) flex items-center justify-center mr-2">
                        {commentaire.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-rows">
                        <span className="flex font-bold">{commentaire.username}</span>
                        {/* on affiche la note sous forme d'étoile */}
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <img
                              key={i}
                              src={i < commentaire.note ? StarFilled : StarOutlined}
                              alt={i < commentaire.note ? 'Étoile pleine' : 'Étoile vide'}
                              className="h-4 w-4"
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{commentaire.note}/5</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-left">{commentaire.commentaire}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {new Date(commentaire.created_at).toLocaleDateString()}
                      </span>
                      {/* on affiche le bouton de suppression seulement si le commentaire appartient à l'utilisateur connecté */}
                      {commentaire.id_user === JSON.parse(localStorage.getItem('user')).id && (
                        <span onClick={() => deleteComment(commentaire.id_comment)} className="">
                          <img src={Trashcan} alt="Icône supprimer" className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </>
  );
}

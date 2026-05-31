const Meals = require('../models/mealModel');
const Inventory = require('../models/inventoryModel');
const { verifyToken } = require('../utils/token');
const User = require('../models/userModel');

const getListMeals = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find();
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getListOf10RandomMeals = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find10RandomMeals();
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getListOf10RandomDesserts = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find10RandomDesserts();
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getListOf10RandomVegetarians = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find10RandomVegetarians();
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getMealById = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meal = await Meals.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Recette non trouvée.' });
    }

    return res.json(meal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getMealIngredients = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meal = await Meals.findMealIngredients(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Recette non trouvée.' });
    }
    return res.json(meal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const addMeal = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const { title, ingredients, instructions, time, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const newMeal = await Meals.create({
      title,
      ingredients, // doit être un tableau JS pour être converti en TEXT[]
      instructions,
      time,
      image,
    });

    return res.status(201).json(newMeal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const addComment = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }
  try {    
    const { id_user, id_meal, note, commentaire, date } = req.body;
    if (!id_user || !id_meal || !commentaire || !date) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    } 
    const newComment = await Meals.addComment({ id_user, id_meal, note, commentaire, date });
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const deleteComment = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }
  try {    
    const { id_user, id_meal } = req.body;
    if (!id_user || !id_meal) {
      return res.status(400).json({ message: 'ID utilisateur et ID repas requis.' });
    }
    await Meals.deleteComment({ id_user, id_meal });
    return res.status(200).json({ message: 'Commentaire supprimé.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getComments = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }
  try {    
    const id_meal = req.params.id;
    const comments = await Meals.getComments(id_meal);
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getListMealsByCategory = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }
  try {    
    const category = req.params.category;
    const meals = await Meals.getListMealsByCategory(category);
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const searchMealsByName = async (req, res) => {
  const token = verifyToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const { name, userInventory, id_user } = req.query;
    const preferences = await User.getPreferences(id_user);
    const diet = preferences[0]?.diet || "omnivore";
    const allergies = preferences[0]?.allergies || [];
    if (!name) {
      return res.status(400).json({ message: "Nom de recette requis" });
    }
    
    let meals;
    if (userInventory !== '1') {
      meals = await Meals.findByName(name, diet, allergies);
    } else {
      meals = await Meals.findByName(name, diet, allergies);

      const ingredients = await Meals.findMealsIngredientsOptimized(meals.map((meal) => meal.id_meal));

      // Transform individual "lien_meals_ingredients" rows into a map like this: { <id meal>: [{ <id ingredient>: <qty> }] }
      const ingredientsMap = ingredients.reduce((map, curr) => {
        if (map.get(curr.id_meal) === undefined) {
          map.set(curr.id_meal, []);
        }

        map.get(curr.id_meal).push({ id_ingredient: curr.id_ingredient, qty: curr.quantity });
        return map;
      }, new Map());
      const userInventory = await Inventory.findByUserId(token.id);
      
      // Transform individual "lien_users_ingredients" rows into a map like this: { <id ingredient>: <qty> }
      const userInventoryMap = userInventory.reduce((map, curr) => {
        map.set(curr.id_ingredient, curr.qty);
        return map;
      }, new Map());

      const filteredMeals = [];
      for (const meal of meals) {
        let pushMeal = true;
        const mealIngredients = ingredientsMap.get(meal.id_meal);
        if (mealIngredients === undefined) {
          console.log(`Attention le plat '${meal.id_meal}' ne contient aucun ingrédient. Ignorer la vérification des ingrédients par l'utilisateur`);
          break;
        }

        for (const mealIngredient of mealIngredients) {
          const userIngredient = userInventoryMap.get(mealIngredient.id_ingredient);
          if (userIngredient === undefined || userIngredient < mealIngredient.qty) {
            pushMeal = false;
            break;
          }
        }

        if (pushMeal) {
          filteredMeals.push(meal);
        }
      }

      meals = filteredMeals;
    }
    return res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getListMeals,
  getListOf10RandomMeals,
  getListOf10RandomDesserts,
  getListOf10RandomVegetarians,
  getMealById,
  getMealIngredients,
  addMeal,
  addComment,
  deleteComment,
  getComments,
  getListMealsByCategory,
  searchMealsByName,
};

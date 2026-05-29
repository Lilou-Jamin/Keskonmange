const Meals = require('../models/mealModel');
const { verifyToken } = require('../utils/token');

const getListMeals = async (req, res) => {
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }

  try {
    const meals = await Meals.find();
    console.log('allo:', meals);
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
  if (!verifyToken(req)) {
    return res.status(401).json({ message: 'Invalid Authentication Token' });
  }
  console.log('searchMealsByName controller')
  try {    
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Nom de recette requis" });
    }
    const meals = await Meals.findByName(name);
    console.log('meals found:', meals);
    return res.status(200).json(meals);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
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

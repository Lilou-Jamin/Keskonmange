const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const { createToken } = require('../utils/token');

const addFavorite = async (req, res) => {
  try {
    const { id_user, id_meal } = req.body;
    if (!id_user || !id_meal) {
      return res.status(400).json({ message: 'ID utilisateur et ID repas requis' });
    }
    const result = await User.addToFavorites(id_user, id_meal);
    res.status(201).json({ message: 'Repas ajouté aux favoris', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { id_user, id_meal } = req.body;
    if (!id_user || !id_meal) {
      return res.status(400).json({ message: 'ID utilisateur et ID repas requis' });
    }
    await User.deleteFavorite(id_user, id_meal);
    res.status(200).json({ message: 'Repas retiré des favoris' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* pour savoir si un repas est déjà dans les favoris */
const getFavorite = async (req, res) => {
  try {
    const { id_user, id_meal } = req.query;
    if (!id_user || !id_meal) {
      return res.status(400).json({ message: 'ID utilisateur et ID repas requis' });
    }
    const isFavorite = await User.isFavorite(id_user, id_meal);
    res.status(200).json({ isFavorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* renvoie toutes les recettes favorites d'un user */
const getFavorites = async (req, res) => {
  try {
    const { id_user } = req.query;
    if (!id_user) {
      return res.status(400).json({ message: 'ID utilisateur requis' });
    }
    const result = await User.getFavorites(id_user);
    res.status(200).json({ favorites: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* renvoie les préférences d'un user */
const getPreferences = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID utilisateur requis' });
    }
    const result = await User.getPreferences(id);
    res.status(200).json({ preferences: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* met à jour les préférences d'un user */
const updatePreferences = async (req, res) => {
  try {
    const { id } = req.params;
    const { diet, allergies } = req.body;

    if (!id || typeof diet !== "string" || !Array.isArray(allergies)) {
      return res.status(400).json({
        message: "ID utilisateur, régime et allergies requis",
      });
    }

    await User.updatePreferences(id, diet, allergies);

    res.status(200).json({ message: "Préférences mises à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // on vérifie qu'il n'existe pas déjà
    const existing = await User.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // on check les conditions du password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          message:
            'Le mot de passe doit contenir au moins 8 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial',
        });
    }

    // hashage du mdp avec 10 de salage
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.createUser({ email, username, passwordHash });
    res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = createToken(user);

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  register,
  login,
  addFavorite,
  deleteFavorite,
  getFavorite,
  getFavorites,
  getPreferences,
  updatePreferences,
};

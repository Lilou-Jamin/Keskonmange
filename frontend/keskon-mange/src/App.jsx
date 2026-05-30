import React from 'react';
import './App.css';
import Base from './pages/Base.jsx';
import MainNavigation from './components/MainNavigation.jsx';
import axios from 'axios';

import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/login/Welcome.jsx';
import Login from './pages/login/Login.jsx';
import Register from './pages/login/Register.jsx';
import Profile from './pages/profile/Profile.jsx';

import Home from './pages/Home.jsx';
import SearchMeal from './pages/SearchMeal.jsx';
import Inventory from './pages/profile/Inventory.jsx';
import Favorites from './pages/profile/Favorites.jsx';
import Preferences from './pages/profile/Preferences.jsx';
import RecipePage from './pages/RecipePage.jsx';
import MealsByCategory from './pages/MealsByCategory.jsx';

export default function App() {
  // Pour chaque requête vers le backend, on met le token dans le header
  axios.defaults.headers['authentication'] = localStorage.getItem('token');
  // Si une requête retourne un status 401, on déconnecte l'utilisateur
  axios.defaults.validateStatus = (status) => {
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.replace('/');
      return false;
    }

    return true;
  };

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search-meal" element={<SearchMeal />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/inventory" element={<Inventory />}></Route>
      <Route path="/profile/favorites" element={<Favorites />}></Route>
      <Route path="/profile/preferences" element={<Preferences />}></Route>
      <Route path="/meals/:id" element={<RecipePage />} />
      <Route path="/meals/category/:category" element={<MealsByCategory />} />    
    </Routes>
  );
}

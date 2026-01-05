import Logo from '../../assets/logo.svg'
import RecipesExamples from '../../assets/recipes_examples.png'
import {Link} from "react-router-dom";

export default function Welcome() {
  return (
    <>
      <div className="p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src={Logo} alt="Keskon Mange Logo" className="mx-auto mb-8" />
          <h1>Bienvenue sur Keskon Mange</h1>
          <p className="p-2">Importez vos ingrédients et planifiez vos repas en quelques secondes !</p>

          <img src={RecipesExamples} alt="Exemples de recettes" className="mx-auto" />

          <button>
            <Link to="/login" className="link-button">Se connecter</Link>
          </button>

          <p>Vous n'avez pas de compte ? <Link to="/register" className="link">Inscrivez-vous</Link></p>
        </div>
      </div>
    </>
  )
}

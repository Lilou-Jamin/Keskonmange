import { Link } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import ArrowOrange from '../assets/arrow_orange.svg'

export default function Home() {
  return (
    <>
        <div>
            <img src={Logo} alt="Keskon Mange Logo" className='m-auto'/>
            <div>
                <h1>Besoin d'idées de repas ?</h1>
                <p>Importez vos ingrédients et découvrez des recettes personnalisées en quelques secondes !</p>
                <div className='flex flex-row items-center gap-2'>
                    <img src={ArrowOrange} alt="Flèche orange" />
                    <Link to="/search-meal" className="link-orange">Essayez</Link>
                </div>
            </div>
        </div>
    </>
  )
}

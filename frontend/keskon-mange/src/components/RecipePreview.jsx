import React from 'react'
import TimeIcon from '../assets/time.svg'
import { Link } from "react-router-dom";

export default function RecipePreview({id, title, thumb}) {

  return (
    <>
        <div className='rounded-md shadow-md max-h-52 max-w-48'>
            <Link to={`/meals/${id}`} className="items-center gap-3">
                <div className="flex flex-row items-center">
                    <img src={thumb} alt={title} className="w-full h-32 object-cover rounded" />
                </div>

                <div className='p-2'>
                    <p className="font-semibold truncate text-black">{title}</p>
                    <img src={TimeIcon} alt="Icône temps de préparation" className="inline w-4 h-4 mr-1"/>
                </div>
            </Link>
        </div>
    </>
  )
}

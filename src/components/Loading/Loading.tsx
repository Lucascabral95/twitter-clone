import React from 'react'
import "./Loading.scss"

const Loading: React.FC = () => {
  return (
    <div className='loading'>
      <div className='contenedor-loading'>

        <div className="cargando">
          <p> Cargando... </p>
        </div>

      </div>
    </div>
  )
}

export default Loading
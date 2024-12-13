"use client"
import React from 'react'
import "./EstructuraMain.scss"

const EstructuraMain = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='estructura-main-titular'>
            <div className='contenedor-estructura-main-titular'>
                {children}
            </div>
        </div>
    )
}

export default EstructuraMain;
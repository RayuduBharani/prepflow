import React from 'react'

export default function Loading() {
    return (
        <div className='w-full h-full pt-[4rem] flex justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" className="loader">
                <circle
                    r="176"
                    cy="192"
                    cx="192"
                    strokeWidth="32"
                    fill="transparent"
                    pathLength="360"
                    className="active"
                ></circle>
                <circle
                    r="176"
                    cy="192"
                    cx="192"
                    strokeWidth="32"
                    fill="transparent"
                    pathLength="360"
                    className="track"
                ></circle>
            </svg>
        </div>
    )
}

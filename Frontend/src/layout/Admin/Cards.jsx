import React from 'react'

const Cards = ({ title, amount }) => {
  return (

    <div className='bg-white shadow-cardShadow w-[18rem] min-w-[18rem] cursor-pointer h-[7rem] rounded-md font-mont p-3 relative'>
      <h1 className='text-lg'>{title}</h1>
      <h1 className=' absolute bottom-4 text-xl font-lato font-semibold'>{amount}</h1>
    </div>
  )
}

export default Cards

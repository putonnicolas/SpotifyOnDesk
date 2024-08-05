import React, { useState } from 'react'

const ToggleButton = ({onToggle, isToggled}) => {
  const [toggle, setToggle] = useState(false)
  const handleToggle = () => {
    setToggle(t => !t)
    if (onToggle) onToggle()
  }


  return (
    <label 
      htmlFor='checkbox' 
      className='border-2 w-20 h-10 cursor-pointer relative rounded-full select-none'
    >
      <input  
        type='checkbox'
        id='checkbox'
        className='sr-only peer'
        onChange={handleToggle}
      />
      <span 
        className='w-2/5 h-4/5 bg-gray-500 absolute rounded-full left-1 top-1 peer-checked:bg-gray-700 peer-checked:left-11 transition-all duration-500 flex items-center justify-center'
        >
        {toggle ? '3D' : '2D'}
      </span>
    </label>
  )
}

export default ToggleButton
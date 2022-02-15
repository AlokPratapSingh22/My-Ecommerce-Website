import React from 'react';
import Star from './Star';


function Rating({ value, text, color }) {
  return <div className='rating d-inline'>
    <div className="stars d-inline">
      <Star value={value} color={color} />
      <Star value={value - 1} color={color} />
      <Star value={value - 2} color={color} />
      <Star value={value - 3} color={color} />
      <Star value={value - 4} color={color} />
    </div>
    <span className='ms-3 text'>{text && text}</span>
  </div>;
}

export default Rating;

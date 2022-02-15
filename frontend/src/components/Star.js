import React from 'react';

export default function Star({value, color}) {
  return <span>
    <i style={{color}} className={
        value >= 1
        ? 'fas fa-star'
        : value >= 0.5
            ? 'fas fa-star-half-alt'
            : 'far fa-star'
    }></i>
    </span>;
}

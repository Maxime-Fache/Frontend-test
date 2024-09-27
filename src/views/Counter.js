import React from 'react';

function Counter({
  onIncrement,
  onDecrement,
  counter,
}) {
  return (
    <div>
      <p>Vous avez cliqué {counter} fois</p>
      <button onClick={onIncrement}>
        Incrémenter
      </button>
      <button onClick={onDecrement} disabled={counter <= 0}>
        Décrémenter
      </button>
    </div>
  );
};

export default Counter;
const fs = require('fs');
const path = require('path');

// Nom du composant que tu veux créer
const componentName = process.argv[2];

if (!componentName) {
  console.log('Veuillez spécifier un nom de composant.');
  process.exit(1);
}

// Chemin du dossier "containers" dans ../src (retour à la racine)
const containersDir = path.join(__dirname, '../src/containers');

// Vérifie si le dossier "containers" existe
if (!fs.existsSync(containersDir)) {
  console.log('Le dossier "containers" n\'existe pas. Création du dossier...');
  fs.mkdirSync(containersDir, { recursive: true });
}

// Définir le chemin du nouveau composant à générer dans ../src/containers
const baseDir = path.join(containersDir, componentName);

if (fs.existsSync(baseDir)) {
  console.log('Le composant existe déjà.');
  process.exit(1);
}

// Création du dossier pour le nouveau composant
fs.mkdirSync(baseDir, { recursive: true });

// Contenu des fichiers générés
const actionContent = `
import { INCREMENT, DECREMENT } from './constant';

export function incrementAction() {
  return {
    type: INCREMENT,
  };
}

export function decrementAction() {
  return {
    type: DECREMENT,
  };
}
`;

const constantContent = `
const scope = '${componentName}';

export const INCREMENT = \`\${scope}/increment\`;
export const DECREMENT = \`\${scope}/decrement\`;
`;

const reducerContent = `
import { INCREMENT, DECREMENT } from './constant';

const initialState = {
  counter: 0,
};

export default function ${componentName}Reducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, counter: state.counter + 1 };
    case DECREMENT:
      return { ...state, counter: state.counter > 0 ? state.counter - 1 : 0 };
    default:
      return state;
  }
}
`;

const selectorContent = `
import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectCounterContainerDomain = state => state.CounterContainer || initialState;
const makeSelectCounterContainerCounter = () => createSelector(selectCounterContainerDomain, substate => substate.counter);

export {
  makeSelectCounterContainerCounter,
};
`;

const indexContent = `
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import Home from '../../views/Home';
import { makeSelect${componentName}Counter } from './selector';
import { incrementAction, decrementAction } from './action';
import { useInjectReducer } from '../../utils/injectReducer';

import reducer from './reducer';

const key = '${componentName}';

function ${componentName}Container(props) {
  useInjectReducer({ key, reducer });

  return (<Home {...props} />);
}

const mapStateToProps = createStructuredSelector({
  counter: makeSelect${componentName}Counter(),
});

const mapDispatchToProps = (dispatch) => ({
  onIncrement: () => dispatch(incrementAction()),
  onDecrement: () => dispatch(decrementAction()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
)(${componentName}Container);
`;

// Créer les fichiers avec le contenu
fs.writeFileSync(path.join(baseDir, 'action.js'), actionContent);
fs.writeFileSync(path.join(baseDir, 'constant.js'), constantContent);
fs.writeFileSync(path.join(baseDir, 'reducer.js'), reducerContent);
fs.writeFileSync(path.join(baseDir, 'selector.js'), selectorContent);
fs.writeFileSync(path.join(baseDir, 'index.js'), indexContent);

console.log(`${componentName} créé avec succès !`);

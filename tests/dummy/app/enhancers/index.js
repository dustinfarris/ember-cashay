// This enables redux devtools. You better be using it.
// https://github.com/zalmoxisus/redux-devtools-extension

import redux from 'npm:redux';

var devtools = window.devToolsExtension ? window.devToolsExtension() : f => f;

export default redux.compose(devtools);

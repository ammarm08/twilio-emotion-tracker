var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = new Dispatcher();

//initializes how an action should be dispatched
AppDispatcher.handleAction = function(action){
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = AppDispatcher;
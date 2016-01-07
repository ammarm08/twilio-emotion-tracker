var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

//global constant
var CHANGE_EVENT = 'change';

// temp "database" and methods to interact w/ it
var _store = {
  list: []
};

var addItem = function(item){
  _store.list.push(item);
};

var removeItem = function(index){
  _store.list.splice(index, 1);
}

// CLONES & EXTENDS the EventEmitter prototype into something we can use
var todoStore = objectAssign({}, EventEmitter.prototype, {

  //on "change", do something
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb);
  },

  //on "change", remove any listeners added
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb);
  },

  getList: function(){
    return _store.list;
  },
});

// actually register the dispatcher to do stuff in relation to the store.
AppDispatcher.register(function(payload){
  var action = payload.action;

  // on a given action, do the action and emit an event.
  // event emission triggers event listeners, which then
  // triggers the component to re-render if there's new data
  switch(action.actionType){
    case appConstants.ADD_ITEM:
      addItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    case appConstants.REMOVE_ITEM:
      removeItem(action.data);
      todoStore.emit(CHANGE_EVENT);
      break;
    default:
      return true;
  }
});

module.exports = todoStore;
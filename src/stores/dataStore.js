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

var fetchData = function(callback){
  $.ajax({
    url: 'api/users',
    success: function(data) {
      //do stuff happy stuff!
      _store.list = data;
      callback();
    },
    error: function(err) {
      //do stuff sad stuff :(
      callback(err);
    }
  });
}

// CLONES & EXTENDS the EventEmitter prototype into something we can use
var dataStore = objectAssign({}, EventEmitter.prototype, {

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
    case appConstants.FETCH_DATA:
      fetchData(function(err) {
        if (!err) dataStore.emit(CHANGE_EVENT);
      });
      break;
    default:
      return true;
  }
});

module.exports = dataStore;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

//global constant
var CHANGE_EVENT = 'change';

var _store = {
  list: []
};

var fetchData = function(callback){
  $.ajax({
    url: 'api/users',
    success: function(data) {
      _store.list = data;
      callback(null);
    },
    error: function(err) {
      callback(err);
    }
  });
}

// for when logged-out users want to demo the app
var fetchDemo = function(callback){
  $.ajax({
    url: 'api/demo',
    success: function(data) {
      _store.list = data;
      callback(null);
    },
    error: function(err) {
      callback(err);
    }
  });
}

// Data store can now emit events
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

AppDispatcher.register(function(payload){
  var action = payload.action;

  // where the magic happens. when the dispatcher receives an action,
  // it interacts with the dataStore. the dataStore performs an action
  // and then emits a change event that triggers activity in our React components
  switch(action.actionType){
    case appConstants.FETCH_DATA:
      fetchData(function(err) {
        if (!err) dataStore.emit(CHANGE_EVENT);
      });
      break;
    case appConstants.FETCH_DEMO:
      fetchDemo(function(err) {
        if (!err) dataStore.emit(CHANGE_EVENT);
      });
      break;
    default:
      return true;
  }
});

module.exports = dataStore;
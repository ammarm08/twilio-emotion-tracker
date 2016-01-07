var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var todoActions = {
  //redirects action to dispatcher
  addItem: function(item) {
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ITEM,
      data: item
    });
  },
  //redirects to dispatcher
  removeItem: function(index) {
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_ITEM,
      data: index
    });
  },
  //redirects to dispatcher
  fetchDataFromServer: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.FETCH_DATA,
      data: null
    });
  }
}

module.exports = todoActions;
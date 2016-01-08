var AppDispatcher = require('../dispatcher/AppDispatcher');
var appConstants = require('../constants/appConstants');

var dataActions = {
  //redirects to dispatcher
  fetchDataFromServer: function() {
    AppDispatcher.handleAction({
      actionType: appConstants.FETCH_DATA,
      data: null
    });
  }
}

module.exports = dataActions;
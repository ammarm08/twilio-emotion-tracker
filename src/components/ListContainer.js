var React = require('react');
var AddItem = require('./AddItem');
var List = require('./List');
var todoStore = require('../stores/todoStore');
var todoActions = require('../actions/todoActions');

var ListContainer = React.createClass({
  getInitialState: function(){
    return {
      list: todoStore.getList()
    }
  },

  //once component ready
  componentDidMount: function(){
    todoStore.addChangeListener(this._onChange);
  },

  //once component out
  componentWillUnmount: function(){
    todoStore.removeChangeListener(this._onChange);
  },

  //delegate action to dispatcher
  handleAddItem: function(newItem){
    todoActions.addItem(newItem);
  },

  //delegate action to dispatcher
  handleRemoveItem: function(index){
    todoActions.removeItem(index);
  },

  //what component does after dispatcher does its business
  _onChange: function(){
    this.setState({
      list: todoStore.getList()
    })
  },

  //render the list container (which has AddItem and the List)
  render: function(){
    return (
      <div className="col-sm-6 col-md-offset-3">
        <div className="col-sm-12">
          <h3 className="text-center"> Todo List </h3>
            <AddItem add={this.handleAddItem}/>
            <List items={this.state.list} remove={this.handleRemoveItem}/>
        </div>
      </div>
    )
  }

});

module.exports = ListContainer;
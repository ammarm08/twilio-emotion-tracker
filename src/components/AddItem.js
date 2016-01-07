var React = require('react');

var AddItem = React.createClass({

  //component receives handleAddItem from ListContainer and 
  //gets set as this.props.add(someItem), which delegates activity to the dispatcher.
  //handleSubmit triggers this delegation
  handleSubmit: function(e) {
    if (e.keyCode === 13) {
      var newItem = this.refs.newItem.value;
      this.refs.newItem.value = '';
      this.props.add(newItem);
    } 
  },

  render: function(){
    return (
      <div>
        <input type="text" ref="newItem" className="form-control" placeholder="New Item" onKeyDown={this.handleSubmit} />
      </div>
    )
  }
});

module.exports = AddItem;
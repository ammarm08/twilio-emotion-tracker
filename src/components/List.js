var React = require('react');

var List = React.createClass({
  render: function() {

    // styles object
    var styles = {
      uList: {
        paddingLeft: 0,
        listStyleType: "none"
      },
      listGroup: {
        margin: '5px 0',
        borderRadius: 5
      },
      removeItem: {
        fontSize: 20,
        float: "left",
        position: "absolute",
        top: 12,
        left: 6,
        cursor: "pointer",
        color: "rgb(222, 79, 79)"
      },
      todoItem: {
        paddingLeft: 20,
        fontSize: 17
      }
    };

    // List component receives as a prop an array of todo items that are
    // part of the list container's state.
    // listItems is an array.
    var listItems = this.props.items.map(function(item, index){
      return (
        <li key={index} className="list-group-item" style={styles.listGroup}>
          <span
            className="glyphicon glyphicon-remove"
            style={styles.removeItem}
            onClick={this.props.remove.bind(null, index)}>
          </span>
          <span style={styles.todoItem}>
            {item}
          </span>
        </li>
      )
    }.bind(this)); //necessary to maintain proper reference to "this"

    //now return the array of li items semantically in React
    return (
      <ul style={styles.uList}>
        {listItems}
      </ul>
    )

  }

});

module.exports = List;
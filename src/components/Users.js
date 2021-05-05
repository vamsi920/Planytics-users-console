import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      todosList: [],
    };
  }

  render() {
    return (
      <div>
       
        <h3>Users Page</h3>
      </div>
    );
  }
}

import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

export default class UserDetail extends Component {
 state = {
      url:''
    }
componentDidMount(){
    let url  = window.location.href.split('UserDetail/')[1];
    this.setState({url})

}
  render() {
    return (
      <div>
        
        <h3>UserDetails</h3>
        <p>id: {this.state.url}</p>
      </div>
    );
  }
}

import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { LinkContainer } from 'react-router-bootstrap'
import Card from 'react-bootstrap/Card'
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import Firebase from 'firebase';
import firebaseConfig from '../config';
export default class Users extends Component {
  constructor(props){
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig.firebase);
   }else {
    Firebase.app(); // if already initialized, use that one
   }
    

    this.state = {
      data: [],
    }
  }

  uppercase = word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  componentDidMount(){
    let org = [{
      "id":"1",
      "name":"apolo store 1",
      "address":'chennai',
      "users":[
        {"id":"1.1","units":["unit1", "unit2", "unit3"]},
        {"id":"1.2", "units":["unit1", "unit6", "unit5"]}
      ]
    }]
    this.setState({data:org},()=>{
      // Firebase.database().ref('/').set(this.state);
      console.log('DATA SAVED');
    })
  }

  render() {
    return (
      <div style={{display:'flex', flexDirection:'row', marginTop:20, marginLeft:20}}>
          {this.state.data.map(data => (
            <LinkContainer to={{
              pathname: `/UserDetail/${data.id}`,
              data: data,
           }} >
            <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>{data.name}</Card.Title>
              <Card.Text>
                {data.address}
              </Card.Text>
            </Card.Body>
          </Card>
          </LinkContainer>
          ))}
      </div>
    );
  }
}

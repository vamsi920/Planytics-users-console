import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Firebase from 'firebase';
import firebaseConfig from '../config';
import Card from 'react-bootstrap/Card'
export default class UserDetail extends Component {
  constructor(props){
    super(props);
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig.firebase);
   }else {
    Firebase.app(); // if already initialized, use that one
   }
    

    this.state = {
      data: [],
      url:''
    }
  }
componentDidMount(){
    let url  = window.location.href.split('UserDetail/')[1];
    this.setState({url},()=>{
      let ref = Firebase.database().ref('/');
      
      ref.on('value', snapshot => {
        const state = snapshot.val();
        let reqData =[];
        for(let i=0; i<state.data.length; i++){
          if(state.data[i].id==url){
            reqData.push(state.data[i])
          }
        }
        this.setState({data:reqData}, ()=>console.log(this.state.data));

      });
    })

}
  render() {
    return (
      <div>
        
        <h3>UserDetails</h3>
        <p>org name: {this.state.data.name}</p>
        <div style={{display: 'flex', flexDirection:'row'}}>
        {(this.state.data.length!=[])?(this.state.data[0].users.map(data=>(
          <div>
             <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>unit id: {data.id}</Card.Title>
            </Card.Body>
          </Card>
          </div>
        ))):('')}
        </div>
      </div>
    );
  }
}

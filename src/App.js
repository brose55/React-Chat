import React, { Component } from 'react';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';
import Landing from './components/Landing';
import './App.css';
import mouth from './mouth.png';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCoER4b0pGoLC8dgZZSAmvaIJ4uVjJdUYY",
  authDomain: "chatterbox-react.firebaseapp.com",
  databaseURL: "https://chatterbox-react.firebaseio.com",
  projectId: "chatterbox-react",
  storageBucket: "chatterbox-react.appspot.com",
  messagingSenderId: "722779105914"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: '',
      user: null
    };
  }

  updateActiveRoom(room) {
    this.setState({ activeRoom: room });
  }

// triggers render after room deletion
  updateRender(room) {
    this.setState({ activeRoom: '' });
  }

  setUser(user) {
    this.setState({ user: user });
  }

  render() {
    return (
      <div className="App flex">
        <div className="sidebar">
					<div className="header flex">
						<img src={mouth} alt='mouth-logo' className="logo" />
						<h3>Chatterbox</h3>
					</div>
					<RoomList
						firebase={ firebase }
						handleRoomUpdate = { (room) => this.updateActiveRoom(room) }
						activeRoom = { this.state.activeRoom }
						handleDelete = { (room) => this.updateRender(room) }
					/>
        </div>
        <div className="chat-container">
					<div>
						<User
							firebase = { firebase }
							setUser = { (user) => this.setUser(user) }
							user = { this.state.user }
						/>
					</div>
          {
            this.state.activeRoom === '' ?
            <Landing /> :
            <MessageList
              firebase={ firebase }
              activeRoom = { this.state.activeRoom }
              user = { this.state.user } />
          }
        </div>
      </div>
    )
  }
}

export default App;

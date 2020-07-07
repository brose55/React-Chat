import React, { Component } from 'react';
import '../style/User.css';

class User extends Component {
  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
    });
  }

  handleSignIn() {
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    this.props.firebase.auth().signInWithPopup( provider );
  }

  handleSignOut() {
    this.props.firebase.auth().signOut();
  }

  render() {
    return (
			<div>
        {
          this.props.user === null ?
						<div className="greeting flex">
							<p>Hello, Guest</p>
              <button className="right transparent" onClick={ () => this.handleSignIn() }>Sign In</button>
            </div>
          :
            <div className="greeting flex">
              <p>Hello, {this.props.user.displayName}</p>
              <button className="right transparent" onClick={ () => this.handleSignOut() }>Sign Out</button>
            </div>
        }
      </div>
    )
  }
}

export default User;

import React, { Component } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import '../style/MessageList.css';

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      content: '',
      roomId: '',
      username: '',
      sentAt: '',
      renderedAt: Date.now()
    }
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  messagesEndRef = React.createRef()

  componentDidMount() {
    this.messagesRef.orderByChild('sentAt').equalTo('this.state.sentAt')
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({
        messages: this.state.messages.concat(message)
      });
    });
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleChange(e) {
    this.setState({
      content: e.target.value,
      roomId: this.props.activeRoom,
      username: this.props.user,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
  }

  handleSumbmit(e) {
    e.preventDefault();
    if (!this.state.content) {
      return
    }
    this.setState({
      content: '',
      roomId: '',
      username: '',
      sentAt: ''
    })
    this.createMessage();
  }

  createMessage() {
    const currentUser = this.props.user === null ? "Guest" : this.props.user.displayName;
    this.messagesRef.push({
      content: this.state.content,
      roomId: this.props.activeRoom.key,
      username: currentUser,
      sentAt: this.state.sentAt
    });
  }

  deleteMessage(messageKey) {
    const message = this.props.firebase.database().ref('/messages/' + messageKey);
    message.remove();
    const remainingMessages = this.state.messages.filter(message => message.key !== messageKey);
    this.setState({
      messages: remainingMessages
    });
  }

  scrollToBottom() {
    this.messagesEndRef.current.scrollIntoView({
      behavior: 'smooth'
    })
  }

  render() {
    const roomMessages = this.state.messages.filter(message => message.roomId === this.props.activeRoom.key)
      .map(message => {
        // 86400 -- one day in ms
        // // formats timestamp
        // let notToday = moment(message.sentAt).isBefore(timeNow);
        // const sentToday = < Moment fromNow > {
        //   message.sentAt
        // } < /Moment>;
        // const sentBefore = < Moment format = "HH:mm" > {
        //   message.sentAt
        // } < /Moment>;
        //
        // let timeSent;
        // notToday ? timeSent = sentToday : timeSent = sentBefore;

        return (
          <div key = {message.key} className = "message" >
            <h4 className = "username">
              {message.username}:
            </h4>
            <button
              classname = "delete-message transparent"
              onClick = {() => this.deleteMessage(message.key)}>
                X
            </button>
            <p>{message.content}</p>
            <footer>
              <p>sent: {
                  // checks if more than 24 hours have passed and sets timestamp format
                  // 8640000 is 24 hours in milliseconds
                  ((this.state.renderedAt - message.sentAt) > 8640000)
                  ?
                    <Moment format="MM/DD/YYYY">{message.sentAt}</Moment>
                  :
                    <Moment fromNow>{message.sentAt}</Moment>
                }
              </p>
            </footer>
          </div>
        );
      });

    return (
      <div className = "message-list">
        <h1 className = "room-name">
          #{this.props.activeRoom.name.toLowerCase()}
        </h1>
        <div className = "messages">
          {roomMessages}
        <div ref={this.messagesEndRef}/></div>
        <form
          className = "create-new-message"
          onSubmit={(e) => this.handleSumbmit(e)}>
          <input
            type = "text"
            placeholder = "say something interesting..."
            value = {this.state.content}
            onChange = {(e) => this.handleChange(e)}
            className = "new-message room-input"
          />
          <button
            className = "transparent"
            type = "sumbit">
              Send
          </button>
        </form>
      </div>
    )
  }
}

export default MessageList;

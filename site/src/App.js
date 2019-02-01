import React, { Component } from "react";
import logo from "./logo.svg";
import {
  Widget,
  addResponseMessage,
  addLinkSnippet,
  addUserMessage
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

import socketIOClient from "socket.io-client";
class App extends Component {
  state = {
    adminConnected: false
  };

  constructor(props) {
    super(props);
    this.socket = socketIOClient("http://localhost:5000/");
    this.firstMessage = true;
  }

  componentDidMount() {
    addResponseMessage("Hola, ¿Cuál es tu nombre?");
  }

  handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);

    if (this.firstMessage) {
      this.socket.emit("join", newMessage);
      this.firstMessage = false;
      addResponseMessage("Un placer, en un momento alguien te atenderá");
    } else {
      this.socket.emit("chat", newMessage);
    }
  };

  render() {
    this.socket.on("chat", newMessage => {
      addResponseMessage(newMessage);
    });

    this.socket.on("adminConnected", connected => {
      console.log(connected);
      this.setState({ adminConnected: connected });
    });

    return (
      <div className="App">
        {this.state.adminConnected && (
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            profileAvatar={logo}
            title="My new awesome title"
            subtitle="And my cool subtitle"
          />
        )}
      </div>
    );
  }
}

export default App;

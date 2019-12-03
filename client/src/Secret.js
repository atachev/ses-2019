import React, { Component } from "react";

export default class Home extends Component {
    constructor(props) {
      super(props);
      //Set default message
      this.state = {
        message: 'Loading...'
      }
      this.logOut = this.logOut.bind(this);
    }
    componentDidMount() {
      //GET message from server using fetch api
      fetch('/api/secret')
        .then(res => res.text())
        .then(res => this.setState({message: res}));
    }

    logOut() {
      localStorage.removeItem('token');
      this.props.history.push('/');
    }

    render() {
      return (
        <div>
          <h1>Secret</h1>
          <p>{this.state.message}</p>
          <button onClick={this.logOut}>Logout</button>
        </div>
      );
    }
  }
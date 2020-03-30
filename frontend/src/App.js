import React from 'react';


class App extends React.Component {

  componenDidMount() {
    this.websocket = new WebSocket("ws://localhost:8000/chat");

    this.websocket.onmessage = (message) => {
      console.log(message);
    };
  }


  render() {
    return (
      <div>

      </div>
    );
  }
}

export default App;

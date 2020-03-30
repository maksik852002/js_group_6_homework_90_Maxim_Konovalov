import React, { createRef } from 'react';
import {colors, dim} from './constants';
import './bootstrap.min.css';

class App extends React.Component {

  state = {
    actions: 'up',
    color: 'black',
    width: '5',
    points: [],
  }

  componentDidMount() {
    this.websocket = new WebSocket("ws://localhost:8000/draw");

    this.websocket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        switch (data.type) {
          case 'NEW_POINT': 
            this.setState({points: [...this.state.points, data.point]});
            this.draw();
            break;
          case 'LAST_POINTS': 
            this.setState({points: data.points});
            this.draw();
            break;
          default: 
            console.log('NO DATA: ' + data.type)
        }
      } catch (error) {
        console.log('Something went wrong', error);
      }
    };
  }

  canvas = createRef();

  changeColorHandler = (e) => {
    this.setState({color: e.target.value})
  }

  changeWidthHandler = (e) => {
    this.setState({width: e.target.value})
  }

  draw = () => {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext('2d');
    for (let point of this.state.points) {
      const x = point.x
      const y = point.y
      ctx.fillStyle = point.color;
      ctx.fillRect(x -point.width/2, y -point.width/2, point.width, point.width);
    }
  }

  mDown = () => (this.setState({actions: 'down'}));
    
  mUp = () => (this.setState({actions: 'up'}));

  mMove = e => {
    if (this.state.actions === "down") {
      const canvas = this.canvas.current;
      const rect = canvas.getBoundingClientRect()
      const point = {
        type: 'CREATE_POINT', 
        point: {
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top, 
          color: this.state.color, 
          width: this.state.width}
      };
      this.websocket.send(JSON.stringify(point));
    };
  };

  mClick = e => {
    const canvas = this.canvas.current;
    const rect = canvas.getBoundingClientRect()
    const point = {
          type: 'CREATE_POINT', 
          point: {
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top, 
            color: this.state.color, 
            width: this.state.width}
        };
    this.websocket.send(JSON.stringify(point));
  };


  render() {
    return (
      <div className='d-flex'>
        <div className='col-11'>
          <canvas style={{border: '1px solid', cursor: 'crosshair'}}  width="1200px" height="800px"  ref={this.canvas} onClick={this.mClick} onMouseDown={this.mDown} onMouseUp={this.mUp} onMouseMove={this.mMove}/>
        </div>
        <div className='col-1 d-flex flex-column'>
          <h5 className='text-center'>Цвета</h5>
          <div className='d-flex flex-wrap justify-content-center'>
            {colors.map(el => (
              <button key={el} value={el} onClick={this.changeColorHandler} style={{background: `${el}`, width: '30px', height: '30px', margin: '5px'}}></button>
            ))}
          </div>
          <h5 className='text-center'>Ширина кисти</h5>
          <div className='d-flex flex-wrap justify-content-center'>
          <select onChange={this.changeWidthHandler} defaultValue='2' className="form-control">
            {dim.map(el => (
              <option  key={el} value={el}>{el}px</option>
            ))}
          </select>
          </div>
        </div>
      </div>
    );
  }
};

export default App;

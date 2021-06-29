import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const renderingValue = () => {
    const value = []
    if (props.location !== props.currentLocation.x * 3 + props.currentLocation.y) {
      value.push(<span key={props.location}>{props.value}</span>)
    }
    else {
      value.push(<span style={{color:"red"}} key={props.location}>{props.value}</span>)
    }
    return value
  }
  const renderingButton = () => {
    const button = []
    if (props.winLines && props.winLines.includes(props.location)) {
      button.push(
        <button
          className="square" onClick={props.onClick}
          style={{"backgroundColor":"yellow"}}
          key={props.location}
        >
          <span>{renderingValue()}</span>
        </button>
      )
    }
    else {
      button.push(
        <button
          className="square" onClick={props.onClick}
          key={props.location}
        >
          <span>{renderingValue()}</span>
        </button>
      )
    }
    return button
  }
  return renderingButton()
  
  // if (props.winLines && props.winLines.includes(props.location)) {
  //   ret.push()
  //   return (
  //     <button
  //     className="square" 
  //     onClick={props.onClick}
  //     style={{"background-color":"yellow"}}
  //     >
  //       <span>{props.value}</span>
  //     </button>
  //   )
  // }
  // if (props.location !== props.currentLocation.x * 3 + props.currentLocation.y)  {
  //   return (
  //     <button
  //       className="square" 
  //       onClick={props.onClick}
  //       >
  //       {props.value}
  //     </button>
  //   );
  // } else {
  //   return (
  //     <button
  //     className="square" 
  //     onClick={props.onClick}
  //     >
  //       <span style={{color:"red"}}>{props.value}</span>
  //     </button>
  //   );
  // }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        currentLocation={this.props.currentLocation}
        location={i}
        winLines={this.props.winLines}
        key={i}
      />
    );
  }

  render() {

    const renderingColumn = (row) => {
      const colRet = []
      for (let i = 0; i < 3; i++){
        const num = 3 * row + i
        colRet.push(this.renderSquare(num));
      }
      return colRet;
    };

    const renderingRow = () => {
      const rowRet = []
      for (let i = 0; i < 3; i++){
        rowRet.push(<div className="board-row" key={i}>{renderingColumn(i)}</div>);
      }
      return rowRet;
    };
    return (<div key={[0,1,2]}>{renderingRow()}</div>);
    
    // return (
    //   <div>
    //     <div className="board-row">
    //       {this.renderSquare(0)}
    //       {this.renderSquare(1)}
    //       {this.renderSquare(2)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(3)}
    //       {this.renderSquare(4)}
    //       {this.renderSquare(5)}
    //     </div>
    //     <div className="board-row">
    //       {this.renderSquare(6)}
    //       {this.renderSquare(7)}
    //       {this.renderSquare(8)}
    //     </div>
    //   </div>
    // );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      historyLocation:[{
        x: null,
        y: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const historyLocation = this.state.historyLocation.slice(0, this.state.stepNumber + 1);
    // const currentLocation = historyLocation[history.length - 1]; 
    const location_x = Math.floor(i / 3);
    const location_y = i % 3;
    
    if (calculateWinner(squares) || squares[i]) {
      return ;
    }
    squares[i] = this.state.xIsNext ? 'X': 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      historyLocation: historyLocation.concat([{
        x: location_x,
        y: location_y,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const historyLocation = this.state.historyLocation;
    const currentLocation = historyLocation[this.state.stepNumber]; 
    const win = calculateWinner(current.squares);
    let winner = null
    let winLines = null
    // console.log(win)
    if (win) {
      winner = win.squares
      winLines = win.lines
    }
    // console.log(winner)
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #'+ move + ' ('+ historyLocation[move].x+', '+ historyLocation[move].y +')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    let status;
    console.log(this.state.stepNumber)
    if (winner){
      status = 'Winner: ' + winner;
      alert("winner: "+ winner)
    } else if (this.state.stepNumber===9) {
      status = "Draw"
      alert("Draw")
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X': 'O') ;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=> this.handleClick(i)}
            currentLocation={currentLocation}
            winLines={winLines}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {squares: squares[a], lines: lines[i]};
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

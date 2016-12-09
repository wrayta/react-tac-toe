import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  constructor() {
  	super();
  	this.state = {
  		rows: 3,
  		columns: 3,
  	};
  }

  renderSquare(i) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {

  var rows = [];
  var squares = [];
  var squareId = 0;

  for (var i = 0; i < this.state.rows; i++) {

  	for (var j = 0; j < this.state.columns; j++) {
  		squares.push(this.renderSquare(squareId));
  		squareId++;
  	}

  	rows.push(<div key={squareId} className="board-row">{ squares }</div>);
  	squares = [];
  }
    return (
      <div>
      	{rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
  	super();
  	this.state = {
  	  history: [{
  	  	squares: Array(9).fill(null)
  	  }],
  	  stepNumber: 0,
  	  xIsNext: true
  	};
  }

  jumpTo(step) {
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step % 2) ? false : true,
  	});
  }

  handleClick(i) {
  	const history = this.state.history;
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	if (calculateWinner(squares) || squares[i]) {
  		return;
  	}
  	squares[i] = this.state.xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
  			squares: squares
  		}]),
  		stepNumber: history.length,
  		xIsNext: !this.state.xIsNext,
  	});
  }

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);

  	const moves = history.map((step, move) => {
  		const desc = move ?
  		'Move #' + move :
  		'Game start';
  		return (
  			<li key={move}>
  				<a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
  			</li>
  		);
  	});

  	let status;
  	if (winner) {
  		status = 'Winner: ' + winner;
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
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

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

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
      return squares[a];
    }
  }
  return null;
}

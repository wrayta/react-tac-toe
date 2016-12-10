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

  	rows.push(<div key={i} className="board-row">{ squares }</div>);
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
  	  	squares: Array(9).fill(null),
  	  	xIsNext: true,
  	  	move: null,
  	  	when: Date.now(),
  	  }],
  	  stepNumber: 0,
  	};
  }

  jumpTo(step) {
  	this.setState({
  		stepNumber: step,
  	});
  }

  handleClick(i) {
  	var history = this.state.history;
  	var current = history[history.length - 1];
  	const squares = current.squares.slice();
  	if (calculateWinner(squares) || squares[i]) {
  		return;
  	}
  	const xIsNext = current.xIsNext;
  	squares[i] = xIsNext ? 'X' : 'O';
  	this.setState({
  		history: history.concat([{
  			squares: squares,
  			xIsNext: !xIsNext,
  			move: {player: squares[i], location: i},
  			when: Date.now(),
  		}]),
  		stepNumber: history.length,
  	});
  }

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);

  	const moves = history.map((step, move) => {
  		const [row, column] = step.move ? 
  		  displayCoords(step.move.location) :
  		  [null, null];

  		const desc = step.move ?
  		  step.move.player + ' played at (' + row + ',' + column + ')' :
  		  'Game start';

  		const isCurrentMove = move == this.state.stepNumber;
  		const className = isCurrentMove ? "bold" : "";
  		return (
  			<li key={step.when}>
  				<a href="#" className={className} onClick={() => this.jumpTo(move)}>{desc}</a>
  			</li>
  		);
  	});

  	let status;
  	if (winner) {
  		status = 'Winner: ' + (current.xIsNext ? 'O' : 'X');
  	} else {
  		status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
  	}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
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

function displayCoords(loc) {
	const location = loc + 1;
	var row = Math.ceil(location / 3);
	var column = location % 3;

	if (column == 0) {
		column = 3;
	}

	return [row, column];
}
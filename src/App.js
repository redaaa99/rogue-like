import React, { Component } from 'react';
import './App.css';

let gameArray = new Array(100);

for (let i = 0; i < 100; i++) {
    gameArray[i] = new Array(100);
}
for(let i=0;i<100;i++)
{
    for(let j=0;j<100;j++)
    {
        gameArray[i][j]={type : (Math.random()>0.5 ) ? "empty":"full"};
    }
}

console.log(gameArray);

class App extends Component {
    constructor(props)
    {
        super(props);
    }
  render() {
    return (
      <div id="app" className="container-fluid">
          <GameState></GameState>
          <Board></Board>
      </div>
    );
  }
}

class GameState extends Component{
    constructor(props)
    {
        super(props);
        this.state = {
            health : 100,
            weapon : "Hands",
            attack : 10,
            level : 1,
            nextLevel : 100,
            dungeon : 1
        }
    }
    render() {
        return (
            <div id="gameInfo" className="col-md-6">
                <p>Health: {this.state.health.toString()}</p>

                <p>Weapon: {this.state.weapon}</p>

                <p>Attack: {this.state.attack.toString()}</p>

                <p>Level: {this.state.level.toString()}</p>

                <p>Next Level in: {this.state.nextLevel.toString()+" XP"} </p>

                <p>Dungeon: {this.state.dungeon}</p>
            </div>
        );
    }
}

class Board extends Component {
    constructor(props)
    {
      super(props);
      this.state = {
          displayFromx : 25,
          displayFromy: 25,
      }
    }
    render() {
        let c= [];
        for(let i=this.state.displayFromx;i<this.state.displayFromx+50;i++)
        {
            for(let j=this.state.displayFromy;j<this.state.displayFromy+50;j++)
            {
                c.push(<Cell key={i.toString()+" "+j.toString()} id={i.toString()+" "+j.toString()} type={gameArray[i][j].type}/>);
            }
        }
        return (

            <div id="Board" >
                {c}
            </div>
        );
    }
}

class Cell extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.type.toString()+" cell"} id={this.props.id}></div>
        );
    }
}

export default App;

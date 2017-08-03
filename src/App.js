// all Thanks goes to https://medium.com/@victorcatalintorac/dungeon-with-rooms-algorithm-for-javascript-ultimate-begginer-guide-ec1489e90314
// for generating dungeons

import humane from 'humane-js';
import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
let _ = require('lodash');


humane.addnCls = 'humane-bigbox-info';
humane.baseCls = 'humane-bigbox';
humane.timeout = 3000;
humane.log("Kill Boss and all enemies in last dungeon to Win");

let events={};
const GRID_HEIGHT = 100;
const GRID_WIDTH = 100;
const MAX_ROOMS = 10;
const ROOM_SIZE_RANGE = [7, 25];
const c= { GRID_HEIGHT, GRID_WIDTH, MAX_ROOMS, ROOM_SIZE_RANGE};
let rooms =[];
let spawnX,spawnY;
let weapons = [
{name : "knife", attack : 12},
{name : "Dagger", attack : 15},
{name : "Sword", attack : 18},
{name : "Double Sword", attack : 20}
];
function refreshPosition(matrix,before,after) {
    matrix[before.y][before.x].type="empty";
    matrix[after.y][after.x].type="player";
    if(matrix[before.y][before.x].id)
{
    delete matrix[before.y][before.x].id;
}
    return matrix;
}
function checkEnemies() {
    for(let i=0;i<enemies.length;i++)
    {
        if(!enemies[i].dead){
            return false;
        }
    }
    return true;
}
let enemies = [];
function placeHeals(grid,healsNumber) {
    let room;
    let x;
    let y;
    let i=0;
    let num = _.random(0,rooms.length-1);
    let lastnum;
    while(i<healsNumber)
{
    num = _.random(0,rooms.length-1);
    room = rooms[num];
    if(num===lastnum)
{
    continue;
}
    lastnum = num;
    x = room.x+_.random(0,room.width-1);
    y = room.y+_.random(0,room.height-1);
    if((grid[y][x].type === "heal") || (grid[y][x].type === "enemy") || (grid[y][x].type === "portal") || (grid[y][x].type === "player"))
{
    continue;
}
    grid[y][x].type = "heal";
    i++;
}

    return grid;
}
function placePlayer(grid) {
    while(true)
    {
        spawnX = rooms[0].x+_.random(0,rooms[0].width-1);
        spawnY = rooms[0].y+_.random(0,rooms[0].height-1);
        if(grid[spawnY][spawnX].type === "empty")
        {
            grid[spawnY][spawnX].type = "player";
            break;
        }
    }
    return grid;
}
function placeEnemies(grid,enemiesNumber,level) {
    let room;
    let x;
    let y;
    let i=0;
    let num = _.random(0,rooms.length-1);
    let lastnum;
    while(i<enemiesNumber)
    {
        num = _.random(0,rooms.length-1);
        room = rooms[num];
        if(num===lastnum)
    {
        continue;
    }
        lastnum = num;
        x = room.x+_.random(0,room.width-1);
        y = room.y+_.random(0,room.height-1);
        if((grid[y][x].type === "heal") || (grid[y][x].type === "portal") || (grid[y][x].type === "player"))
    {
        continue;
    }

    let  enemyState = {
    enemyX : x,
    enemyY : y,
    health : 50+level*15,
    level : level,
    attack : 5+5*level,
        dead: false,
    id : enemies.length
};
    enemies.push(enemyState);

    grid[y][x].type = "enemy";
    grid[y][x].id = enemyState.id;
    i++;
}

    return grid;
}
function placeWeapons(grid,level) {
    let room;
    let x;
    let y;
    while(true)
{
    room = rooms[_.random(0,rooms.length-1)];
    x = room.x+_.random(0,room.width-1);
    y = room.y+_.random(0,room.height-1);
    if(grid[y][x].type === "empty")
{
    grid[y][x].type = "weapon";
    grid[y][x].id = level;
    break;
}
}

    return grid;
}
function placePortal(grid) {
    let room;
    let x;
    let y;
    while(true)
    {
    room = rooms[_.random(0,rooms.length-1)];
    x = room.x+_.random(0,room.width-1);
    y = room.y+_.random(0,room.height-1);
    if(grid[y][x].type !== "player")
    {
    grid[y][x].type = "portal";
    break;
    }
    }

    return grid;
    }
function placeBoss(grid,level){
    let x;
    let y;
    let room = rooms[_.random(0,rooms.length-1)];
    x = room.x+_.random(0,room.width-3);
    y = room.y+_.random(0,room.height-3);
    let  enemyState = {
        enemyX : x,
        enemyY : y,
        health : 100,
        level : level,
        attack : 20,
        dead: false,
        id : enemies.length
    };
    enemies.push(enemyState);
    grid[y][x].type = "enemy";
    grid[y][x].id = enemyState.id;

    enemyState = {
        enemyX : x+1,
        enemyY : y,
        health : 100,
        level : level,
        attack : 20,
        dead: false,
        id : enemies.length
    };
    enemies.push(enemyState);
    grid[y][x+1].type = "enemy";
    grid[y][x+1].id = enemyState.id;

    enemyState = {
        enemyX : x+1,
        enemyY : y+1,
        health : 100,
        level : level,
        attack : 20,
        dead: false,
        id : enemies.length
    };
    enemies.push(enemyState);
    grid[y+1][x+1].type = "enemy";
    grid[y+1][x+1].id = enemyState.id;

    enemyState = {
        enemyX : x,
        enemyY : y+1,
        health : 100,
        level : level,
        attack : 20,
        dead: false,
        id : enemies.length
    };
    enemies.push(enemyState);
    grid[y+1][x].type = "enemy";
    grid[y+1][x].id = enemyState.id;
    return grid;
}
function newDungeon(healsNumber,enemyNumbers,level = 1) {
    let grid;
    enemies = [];
    rooms =[];
    const createDungeon = () => {
    // HELPER FUNCTIONS FOR CREATING THE MAP
    const isValidRoomPlacement = (grid, {x, y, width = 1, height = 1}) => {
    // check if on the edge of or outside of the grid
    if (y < 1 || y + height > grid.length - 1) {
    return false;
}
    if (x < 1 || x + width > grid[0].length - 1) {
    return false;
}

    // check if on or adjacent to existing room
    for (let i = y - 1; i < y + height + 1; i++) {
    for (let j = x - 1; j < x + width + 1; j++) {
    if (grid[i][j].type === 'empty') {
    return false;
}
}
}
    // all grid cells are clear
    return true;
};

    const placeCells = (grid, {x, y, width = 1, height = 1}, type = 'empty') => {
    for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
    grid[i][j].type = type;
}
}
    if(height!==1)
{
    rooms.push({x,y,width,height});
}
    return grid;
};

    const createRoomsFromSeed = (grid, {x, y, width, height}, range = c.ROOM_SIZE_RANGE) => {
    // range for generating the random room heights and widths
    const [min, max] = range;

    // generate room values for each edge of the seed room
    const roomValues = [];

    const north = { height: _.random(min, max), width: _.random(min, max) };
    north.x = _.random(x, x + width - 1);
    north.y = y - north.height - 1;
    north.doorx = _.random(north.x, (Math.min(north.x + north.width, x + width)) - 1);
    north.doory = y - 1;
    north.id= 'N';
    roomValues.push(north);

    const east = { height: _.random(min, max), width: _.random(min, max) };
    east.x = x + width + 1;
    east.y = _.random(y, height + y - 1);
    east.doorx = east.x - 1;
    east.doory = _.random(east.y, (Math.min(east.y + east.height, y + height)) - 1);
    east.id= 'E';
    roomValues.push(east);

    const south = { height: _.random(min, max), width: _.random(min, max) };
    south.x = _.random(x, width + x - 1);
    south.y = y + height + 1;
    south.doorx = _.random(south.x, (Math.min(south.x + south.width, x + width)) - 1);
    south.doory = y + height;
    south.id='S';
    roomValues.push(south);

    const west = { height: _.random(min, max), width: _.random(min, max) };
    west.x = x - west.width - 1;
    west.y = _.random(y, height + y - 1);
    west.doorx = x - 1;
    west.doory = _.random(west.y, (Math.min(west.y + west.height, y + height)) - 1);
    west.id='W';
    roomValues.push(west);

    const placedRooms = [];
    roomValues.forEach(room => {
    if (isValidRoomPlacement(grid, room)) {
    // place room
    grid = placeCells(grid, room);
    // place door
    grid = placeCells(grid, {x: room.doorx, y: room.doory}, 'empty');
    // need placed room values for the next seeds
    placedRooms.push(room);
}
});
    return {grid, placedRooms};
};

    // BUILD OUT THE MAP

    // 1. make a grid of 'empty' cells, with a random opacity value (for styling)
    let grid = [];
    for (let i = 0; i < c.GRID_HEIGHT; i++) {
    grid.push([]);
    for (let j = 0; j < c.GRID_WIDTH; j++) {
    grid[i].push({type: "full"});
}
}

    // 2. random values for the first room
    const [min, max] = c.ROOM_SIZE_RANGE;
    const firstRoom = {
    x: _.random(1, c.GRID_WIDTH - max - 15),
    y: _.random(1, c.GRID_HEIGHT - max - 15),
    height: _.random(min, max),
    width: _.random(min, max),
    id: 'O'
};

    // 3. place the first room on to grid
    grid = placeCells(grid, firstRoom);

    // 4. using the first room as a seed, recursivley add rooms to the grid
    const growMap = (grid, seedRooms, counter = 1, maxRooms = c.MAX_ROOMS) => {
    if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
    return grid;
}

    grid = createRoomsFromSeed(grid, seedRooms.pop());
    seedRooms.push(...grid.placedRooms);

    counter += grid.placedRooms.length;
    return growMap(grid.grid, seedRooms, counter);
};



    return growMap(grid, [firstRoom]);
};
    grid = createDungeon();

    grid = placePlayer(grid);
    if(level !==4)
    {
        grid = placePortal(grid);
    }
    grid = placeHeals(grid,healsNumber);
    grid = placeEnemies(grid,enemyNumbers,level);
    grid = placeWeapons(grid,level);
    if(level===4)
    {
        grid = placeBoss(grid);
    }
    return grid;
    }

let youDied = false;
let changeLevel = false;
class App extends Component {
    constructor(props) {
    super(props);
    this.state={
    gameArray:newDungeon(10,10,1),
    playerPositionX :spawnX, // horizontal
    playerPositionY : spawnY,// Vertical
    health : 100,
    weapon : "Hands",
    level : 1,
    attack : 8+3*1, //level
    nextLevel : 100,
    dungeon : 1
    };

    let that= this;
    $(events).on("move",function (event,data) {
        that.move(data);
    });

    }
    addHealth(){
        let newHealth = this.state.health+20;
        newHealth = (newHealth>100) ? 100:newHealth;
    this.setState({health : newHealth});
    }
    attackedEnemy(id){
    let myheal = this.state.health;
    if(myheal-enemies[id].attack<=0)
    {
        youDied = true;
        return false;
    }
    enemies[id].health -= this.state.attack;
    this.setState({health : this.state.health-enemies[id].attack});
    if(enemies[id].health<=0) {
        if(this.state.nextLevel-20<=0)
        {
            this.setState({health : this.state.health+(15*this.state.level),level : this.state.level+1,nextLevel : 100,attack : this.state.attack+(this.state.level+1)*3});
        }
        else
        {
            this.setState({nextLevel : this.state.nextLevel-20});
        }
        enemies[id].dead = true;
        return true;
    }else{
        return false;
    }
    }
    changeWeapon(id) {
    this.setState({weapon : weapons[id-1].name,attack : weapons[id-1].attack+this.state.attack+this.state.level*5});
    }
    changeLevel() {
        changeLevel = true;
    }
    possibleToMove(tile) {
    if(tile.type==="empty")
    {
        return true;
    }
    if(tile.type==="heal")
    {
        this.addHealth();
        return true;
    }
    if(tile.type==="enemy")
    {
        return this.attackedEnemy(tile.id);
    }
    if(tile.type==="weapon")
    {
        this.changeWeapon(tile.id);
        return true;
    }
    if(tile.type==="portal")
    {
        this.changeLevel();
        return true;
    }
    return false;
}
    move(direction) {
    let helpMatrix = this.state.gameArray;
    let actualPosition={
        x: this.state.playerPositionX,
        y: this.state.playerPositionY
    };
    let newPosition = $.extend({}, actualPosition); // clone object
    if(direction==="up"){
        if(this.possibleToMove(helpMatrix[actualPosition.y-1][actualPosition.x]))
        {
            newPosition.y -= 1;
        }
    }
    else if(direction==="down")
    {
        if(this.possibleToMove(helpMatrix[actualPosition.y+1][actualPosition.x]))
        {
            newPosition.y += 1;
        }
    }
    else if(direction==="left")
    {
        if(this.possibleToMove(helpMatrix[actualPosition.y][actualPosition.x-1]))
        {
            newPosition.x -= 1;
        }
    }
    else if(direction==="right")
    {
        if(this.possibleToMove(helpMatrix[actualPosition.y][actualPosition.x+1]))
        {
            newPosition.x += 1;
        }
    }
    console.log(enemies);
    if((this.state.dungeon===4) && (checkEnemies()))
    {
        humane.addnCls = 'humane-bigbox-success';
        humane.baseCls = 'humane-bigbox';
        humane.log("You Won ! ! !");
        this.setState({
            gameArray:newDungeon(10,10,1),
            playerPositionX :spawnX, // horizontal
            playerPositionY : spawnY,// Vertical
            health : 100,
            weapon : "Hands",
            level : 1,
            attack : 8+3*1, //level
            nextLevel : 100,
            dungeon : 1
        });
        return;
    }
    if(changeLevel)
    {
        humane.addnCls = 'humane-bigbox-info';
        humane.baseCls = 'humane-bigbox';
        let num = this.state.dungeon+1;
        humane.log("Dungeon "+num);

        this.setState({
            gameArray:newDungeon(10,10,this.state.dungeon+1),
            playerPositionX :spawnX, // horizontal
            playerPositionY : spawnY,// Vertical
            dungeon : this.state.dungeon+1
        });
        changeLevel = false;

        return;
    }
    if(youDied)
    {
        humane.addnCls = 'humane-bigbox-error';
        humane.baseCls = 'humane-bigbox';
        humane.log("You Died!");

        this.setState({
            gameArray:newDungeon(10,10,1),
            playerPositionX :spawnX, // horizontal
            playerPositionY : spawnY,// Vertical
            health : 100,
            weapon : "Hands",
            level : 1,
            attack : 8+3*1, //level
            nextLevel : 100,
            dungeon : 1
        });
        youDied = false;

        return;
    }
    helpMatrix = refreshPosition(helpMatrix,actualPosition,newPosition);
    this.setState({gameArray: helpMatrix,playerPositionX:newPosition.x,playerPositionY:newPosition.y});
    }
    render() {
        return (
        <div id="app" className="container-fluid">
          <GameState gameArray={this.state.gameArray} playerState={{
              health : this.state.health,
              weapon : this.state.weapon,
              attack : this.state.attack,
              level : this.state.level,
              nextLevel : this.state.nextLevel,
              dungeon : this.state.dungeon
          }} ></GameState>
          <Board playerPosition={{
              x: this.state.playerPositionX,
              y: this.state.playerPositionY
          }} gameArray={this.state.gameArray}></Board>
        </div>
        );
    }
}


// game array [VERTICAL][HORIZONTAL]


class GameState extends Component{
    constructor(props) {
        super(props);
        this.state  = {
            health : this.props.playerState.health,
            weapon : this.props.playerState.weapon,
            attack : this.props.playerState.attack,
            level : this.props.playerState.level,
            nextLevel : this.props.playerState.nextLevel,
            dungeon : this.props.playerState.dungeon
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({health : nextProps.playerState.health,
            weapon : nextProps.playerState.weapon,
            attack : nextProps.playerState.attack,
            level : nextProps.playerState.level,
            nextLevel : nextProps.playerState.nextLevel,
            dungeon : nextProps.playerState.dungeon});
    }
    render() {
        return (
            <div id="gameInfo" className="col-md-6">
                <p>Health: {this.state.health.toString()+" %"}</p>

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
    constructor(props){
      super(props);
        if((this.props.playerPosition.y>25) && (this.props.playerPosition.y<75))
        {
            if((this.props.playerPosition.x>=25) && (this.props.playerPosition.x<75))
            {
                this.state = {
                    displayFromx : 25,
                    displayFromy: 25,
                };
            }
            else if((this.props.playerPosition.x<=25))
            {
                this.state = {
                    displayFromx : 25,
                    displayFromy: 0,
                };
            }
            else if((this.props.playerPosition.x>=75))
            {
                this.state = {
                    displayFromx : 25,
                    displayFromy: 50,
                };
            }

        }
        else if(this.props.playerPosition.x<=50)
        {
            if(this.props.playerPosition.y<=50)
            {
                this.state = {
                    displayFromx : 0,
                    displayFromy: 0,
                };
            }
            else
            {
                this.state = {
                    displayFromx : 50,
                    displayFromy: 0,
                };
            }
        }
        else
        {
            if(this.props.playerPosition.y<=50)
            {
                this.state = {
                    displayFromx : 0,
                    displayFromy: 50,
                };
            }
            else
            {
                this.state = {
                    displayFromx : 50,
                    displayFromy: 50,
                };
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if((nextProps.playerPosition.y>25) && (nextProps.playerPosition.y<75))
        {
            if((nextProps.playerPosition.x>=25) && (nextProps.playerPosition.x<=75))
            {
                this.setState({
                    displayFromx : 25,
                    displayFromy: 25,
                });
            }
            else if((nextProps.playerPosition.x<=25))
            {
                this.setState({
                    displayFromx : 25,
                    displayFromy: 0,
                });
            }
            else if((nextProps.playerPosition.x>=75))
            {
                this.setState({
                    displayFromx : 25,
                    displayFromy: 50,
                });
            }

        }
        else if(nextProps.playerPosition.x<50)
        {
            if(nextProps.playerPosition.y<50)
            {
                this.setState({displayFromx:0,displayFromy:0});
            }
            else
            {
                this.setState({displayFromx:50,displayFromy:0});
            }
        }
        else
        {
            if(nextProps.playerPosition.y<50)
            {
                this.setState({displayFromx:0,displayFromy:50});
            }
            else
            {
                this.setState({displayFromx:50,displayFromy:50});
            }
        }
    }
    render() {
        let c= [];
        for(let i=this.state.displayFromx;i<this.state.displayFromx+50;i++)
        {
            for(let j=this.state.displayFromy;j<this.state.displayFromy+50;j++)
            {
                c.push(<Cell key={i.toString()+" "+j.toString()} id={i.toString()+" "+j.toString()} type={this.props.gameArray[i][j].type}/>);
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
    render() {
        return (
            <div className={this.props.type.toString()+" cell"} id={this.props.id}></div>
        );
    }
}

$(document).keydown(function(e){
    //if( e.which === 32){
        //space
        // $(events).trigger("onSpacesPress");
    //}
    switch(e.which) {
        case 37:
            $(events).trigger("move","left");
            break;
        case 38:
            $(events).trigger("move","up");
            break;
        case 39:
            $(events).trigger("move","right");
            break;
        case 40:
            $(events).trigger("move","down");
            break;
        default:
            break;
    }
});

export default App;
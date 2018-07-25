'use strict';

//Wrap into Module
  //Module for Container
  //Module for Crystals
  //Event loop for actions
//Create Crystal Constructor
  //Crystals have common properties to let them read the divs
  //around them
  //Each crystal time has special properties to put on the prototype

//Initalize creation of blank table and divs
//Event Click to create instance of Crystal

const gameBoard = {
  //default is a 4 by 4 square of divs
  numDiv: [],
  //two dimensional array to store position and color of clicked crystals
  positionAndColor: [],
  init: function() {
    this.numDiv.push(16);
    this.cacheDom();
    this.bindEvents();
  },
  cacheDom: function() {
    //wrapping container
    this.$container = $('#container');
    //panel elements
    this.$panel = this.$container.find('#panel');
    this.$userInput = this.$panel.find('input');
    this.$start = this.$panel.find('#start');
    this.$reset = this.$panel.find('#reset');
    this.$reload = this.$panel.find('#reload');
    //board elements
    this.$board = this.$container.find('#board');
  },
  bindEvents: function() {
    // 'this' on the button reload, refers to the button itself
    // 'this' inside of bind refers to the container object
    // bind is needed to reference the render function inside
    // on the container object, while use the event handler.
    this.$reload.on('click', this.render.bind(this));
    this.$divs = this.$board.find('.item');
    //change color to red
    this.$divs.one('click', function() { this.style.background = 'tomato'});
    // log color and position
    this.$divs.one('click', this.getPositionAndColor);
    //TODO start
    //TODO reset
  },
  getPositionAndColor: function() {
    let position = this.id;
    let color = "Red"
    gameBoard.logPositionAndColor(position, color);
  },
  logPositionAndColor: function(position, color) {
    this.positionAndColor.push([position, color]);
    console.log(this.positionAndColor);
  },
  clear: function() {
    //remove all divs from board
    this.$board.empty();
  },
  setInput: function() {
    //read user input and change CSS variables
    this.numDiv.pop();
    let inputValue = this.$userInput.val();
    this.numDiv.push(inputValue * inputValue);
    this.$board.css('--colNum', inputValue);
  },
  render: function() {
    if (this.$userInput.val() >= 4 && this.$userInput.val() <= 64) {
      this.clear();
      this.setInput();
      for (let i = 0; i < this.numDiv[0]; i++) {
        this.$board.append(`<div id="${i}" class="item"></div>`);
      };
      this.bindEvents();
    }
    else {
      console.log("Input must be greater than 4 and less than 64.");
    }
  }
};

const crystals = {
  init: function() {
    this.generateCrystal(true, "Red");
    console.log(this.redCrystals)
  },
  //Store Crystal Constructors
  generateCrystal: function(position, color) { //TODO add color parameter
    //Crystal Parent Constructor
    function ParentCrystal (position) {
      this.position = position,
      this.willGrow = false,
      this.willDie = false,
      this.Neighbors = []
    };
    ParentCrystal.prototype = {
      getNeighbors: function() {
        //what kind of piece am I?
        //scan position and color Array from gameBoardAPI for neighbors
        //Log Neighbors
        return;
      },
      setGrow: function() {
        this.willGrow = true;
      },
      setDie: function() {
        this.willDie = true;
      }
    };
    //Child Crystal Contructors
    switch (color) {
      case "Red":
        function RedCrystal (position) {
          ParentCrystal.call(this, position);
          this.color = "Red";
        };
        RedCrystal.prototype = Object.create(ParentCrystal.prototype);
        RedCrystal.prototype.redTest = function() {
          return "REDTEST";
        };
        RedCrystal.prototype.constructor = RedCrystal;
        for(let i = 0; i < 5; i++) {
          const aRedCrystal = new RedCrystal(i);
          this.redCrystals.push(aRedCrystal);
          //console.log(aRedCrystal);
        }
        break;
      case "Blue":
        break;
    }
    }
};



gameBoard.init();
//crystals.init();

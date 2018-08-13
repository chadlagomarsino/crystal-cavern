'use strict';

//Wrap into Module

const boardModule = (function board() {
  // default is a 4 by 4 square of divs
  let numDiv = [16];

  // array of color and position values for active crystals from the
  // crystalsModule.crystalsToRender array of objects
  let crystalsToActivate = [];

  //cache DOM
  const $container = $('#container');
  const $panel = $container.find('#panel');
  const $userInput = $panel.find('input');
  const $start = $panel.find('#start');
  const $reset = $panel.find('#reset');
  const $reload = $panel.find('#reload');
  const $board = $container.find('#board');

  //bind events
  $reload.on('click', function() {
    if ($userInput.val() >= 4 && $userInput.val() <= 64) {
      _render();
    }
    else {console.log("Input must be greater than 4 and less than 64.");}
  });
  $start.on('click', function() {
    crystalsModule.crystalsModuleInit();
  });
  //TODO reset
  _refreshDivs();

  //Methods

  function boardModuleInit() {
    //access from crystal array
    return;
  }

  function _refreshDivs() {
    //grab all divs
    let $divs = $board.find('.item');
    // enable color change on click
    $divs.one('click', function() { this.style.background = 'tomato'});
    // track which divs were clicked
    $divs.one('click', _logPosition);
  }

  //log position of activated divs
  function _logPosition() {
    let color = "red"
    //NOTE: Position IDs begin with 0 and increment untill the number of
    // squares - 1.
    let position = this.id;
    crystalsToActivate.push([color, position]);
  }

  //remove all divs from game board
  function _clearBoard() {
    $board.empty();
  }

  //update numDiv and --colNum for CSS Grid with user input
  function _setInput() {
    numDiv.pop();
    let inputValue = $userInput.val();
    numDiv.push(inputValue * inputValue);
    $board.css('--colNum', inputValue);
  }

  function _render() {
    //clear all board divs
    _clearBoard();
    //resize grid to fit user input
    _setInput();
    //add divs based on user input
    for (let i = 0; i < numDiv[0]; i++) {
      $board.append(`<div id="${i}" class="item"></div>`);
    };
    //add event handlers to divs
    _refreshDivs();
    //TODO clear cached crystalsToRender array from crystalsModule
  }

  return {
    numDiv: numDiv,
    boardModuleInit: boardModuleInit,
    crystalsToActivate: crystalsToActivate,
  };
})();

const crystalsModule = (function crystals() {

  //An a array of crystal objects built from the color and position
  //values recieved from the boardModule.crystalsToActivate array
  let crystalsToRender = [];

  //Crystal Objects
  const Crystal = {
    init: function(color, position) {
      this.color = color,
      this.position = position,
      this.willGrow = false,
      this.willDie = false,
      this.pieceType = "central",
      this.neighbors = []
    },
    setPieceType: function(boardLength) {
      //what kind of piece am I?
      if (this.position == 0) {
        //NW corner
        this.pieceType = "nw corner";
        return;
      }
      else if (this.position == (boardLength - 1)) {
        //NE corner
        this.pieceType = "ne corner";
        return;
      }
      else if (this.position == ((boardLength*boardLength) - 1)) {
        //SE corner
        this.pieceType = "se corner";
        return;
      }
      else if (this.position == ((boardLength*boardLength) - boardLength)) {
        //SW corner
        this.pieceType = "sw corner";
        return;
      }
      else if (this.position % boardLength == 0) {
        //West Edge
        this.pieceType = "west edge";
        return;
      }
      else if ((this.position) % (boardLength) == (boardLength - 1)) {
        //East Edge
        this.pieceType = "east edge";
        return;
      }
      else if ((this.position > 0) && (this.position < (boardLength - 1))) {
        //North Edge
        this.pieceType = "north edge";
        return;
      }
      else if ((this.position > ((boardLength*boardLength) - boardLength)) &&
      (this.position < (boardLength*boardLength))) {
        //South Edge
        this.pieceType = "south edge";
        return;
      }
      else {
        //central position
        this.pieceType = "central";
        return;
      }
    },
    findNeighbors: function(boardLength) {

      function crystalFilter(crystal) {
        function checkNorth() {
          return (parseInt(crystal.position) == parseInt(this.position) - boardLength);
        };
        function checkNorthEast() {
          return (parseInt(crystal.position) == parseInt(this.position) - boardLength + 1);
        };
        function checkEast() {
          return (parseInt(crystal.position) == parseInt(this.position) + 1);
        };
        function checkSouthEast() {
          return (parseInt(crystal.position) == parseInt(this.position) + boardLength + 1);
        };
        function checkSouth() {
          return (parseInt(crystal.position) == parseInt(this.position) + boardLength);
        };
        function checkSouthWest() {
          return (parseInt(crystal.position) == parseInt(this.position) + boardLength - 1);
        };
        function checkWest() {
          return (parseInt(crystal.position) == parseInt(this.position) - 1);
        };
        function checkNorthWest() {
          return (parseInt(crystal.position) == parseInt(this.position) - boardLength - 1);
        };
        if (this.pieceType == "nw corner") {
          return (checkEast.apply(this) ||
          checkSouth.apply(this) ||
          checkSouthEast.apply(this));
        };
        if (this.pieceType == "ne corner") {
          return (checkWest.apply(this) ||
          checkSouth.apply(this) ||
          checkSouthWest.apply(this));
        };
        if (this.pieceType == "se corner") {
          return (checkWest.apply(this) ||
          checkNorth.apply(this) ||
          checkNorthWest.apply(this));
        };
        if (this.pieceType == "sw corner") {
          return (checkEast.apply(this) ||
          checkNorth.apply(this) ||
          checkNorthEast.apply(this));
        };
        if (this.pieceType == "north edge") {
          return (checkEast.apply(this) ||
          checkWest.apply(this) ||
          checkSouth.apply(this) ||
          checkSouthEast.apply(this) ||
          checkSouthWest.apply(this));
        };
        if (this.pieceType == "south edge") {
          return (checkEast.apply(this) ||
          checkWest.apply(this) ||
          checkNorth.apply(this) ||
          checkNorthEast.apply(this) ||
          checkNorthWest.apply(this));
        };
        if (this.pieceType == "west edge") {
          return (checkEast.apply(this) ||
          checkNorth.apply(this) ||
          checkSouth.apply(this) ||
          checkNorthEast.apply(this) ||
          checkSouthEast.apply(this));
        };
        if (this.pieceType == "east edge") {
          return (checkWest.apply(this) ||
          checkNorth.apply(this) ||
          checkSouth.apply(this) ||
          checkNorthWest.apply(this) ||
          checkSouthWest.apply(this));
        };
        if (this.pieceType == "central") {
          return (checkNorth.apply(this) ||
          checkNorthEast.apply(this) ||
          checkEast.apply(this) ||
          checkSouthEast.apply(this) ||
          checkSouth.apply(this) ||
          checkSouthWest.apply(this) ||
          checkWest.apply(this) ||
          checkNorthWest.apply(this));
        };
      };

      //store all active neighbor crystal objects adjacent to this crystal
      let neighborCrystals = crystalsToRender.filter(crystalFilter, this)
      //reduce neighbor crystal objects to color and position
      let reducedNeighbors = neighborCrystals.map(obj => ({color: obj.color, position: obj.position}));
      //push to this crystal's neighbor array
      this.neighbors.push(reducedNeighbors);

      //console.log(this.neighbors);

    },
    setGrow: function() { this.willGrow = true; },
    setUnGrow: function() { this.willGrow = false; },
    setDie: function() { this.willDie = true; },
    setUnDie: function() { this.willDie = false; },
  };

  //Methods
  function crystalsModuleInit() {
    //recieve active crystal list from boardModule.
    //index 0 = position, index 1 = color
    let crystalsToActivate = boardModule.crystalsToActivate;
    //clear cached crystalsToRender array
    //find game boardLength
    let boardLength = Math.sqrt(boardModule.numDiv);
    generateCrystal(crystalsToActivate, boardLength);
    changeCrystalState(boardLength);
    updateCrystalsToActivate();
  };

  function generateCrystal(crystalsToActivate, boardLength) {
    //create crystal objects in crystals to activate
    for(let i = 0; i < crystalsToActivate.length; i++) {
      crystalsToRender[i] = Object.create(Crystal);
      crystalsToRender[i].init("red", crystalsToActivate[i][1]);
      crystalsToRender[i].setPieceType(boardLength);
      //TIME TO WHIP OUT SOME FUNCTIONAL PROGRAMMING AND
      // Grow crystals by passing back crystalsToRender module
    };
  };

  function changeCrystalState(boardLength) {
    // once all crystals are generate record neighboring crystals
    for(let i = 0; i < crystalsToRender.length; i++) {
      crystalsToRender[i].findNeighbors(boardLength);
      //set toGrow
      if (crystalsToRender[i].neighbors[0].length > 2 ) {
        crystalsToRender[i].setGrow();
      }
      //set toDie
      if (crystalsToRender[i].neighbors[0].length < 2 ) {
        crystalsToRender[i].setDie();
      }
    };
    console.log(crystalsToRender);
  }

//TODO
  function updateCrystalsToActivate() {
    console.log(boardModule.crystalsToActivate);
    //create function for crystal growth
    //remove crystals marked for deletion


    return;
  }

  return {
    crystalsModuleInit: crystalsModuleInit,
    crystalsToRender: crystalsToRender,
  };
})();

'use strict';

//Wrap into Module
  //Module for Container
  //Module for Crystals
  //Event loop for actions
//Create Crystal Constructor
  //Crystals have common properties to let them read the divs
  //around them
  //Each crystal time has special properties to put on the prototype

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
  $start.one('click', function() {
    crystalsModule.crystalsModuleInit();
  });
  //TODO reset
  _refreshDivs();

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
    _clearBoard();
    _setInput();
    for (let i = 0; i < numDiv[0]; i++) {
      $board.append(`<div id="${i}" class="item"></div>`);
    };
    _refreshDivs();
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
    setGrow: function() { this.willGrow = true; },
    setUnGrow: function() { this.willGrow = false; },
    setDie: function() { this.willDie = true; },
    setUnDie: function() { this.willDie = false; },
    findNeighbors: function() {
      switch (this.pieceType) {
        case: "nw corner"
          //search crystal to render for crystals in position
          // log color and position and in neighbors
          // use filter
      }
      return
    }
  };

  function crystalsModuleInit() {
    //recieve active crystal list from boardModule.
    //index 0 = position, index 1 = color
    let crystalsToActivate = boardModule.crystalsToActivate;
    generateCrystal(crystalsToActivate);
  };

  function generateCrystal(crystalsToActivate) {
    let boardLength = Math.sqrt(boardModule.numDiv);
    console.log(crystalsToActivate);
    for(let i = 0; i < crystalsToActivate.length; i++) {
      crystalsToRender[i] = Object.create(Crystal);
      crystalsToRender[i].init("red", crystalsToActivate[i][1]);
      crystalsToRender[i].setPieceType(boardLength);
      //TIME TO WHIP OUT SOME FUNCTIONAL PROGRAMMING AND
      // Grow crystals by passing back crystalsToRender module
    };
  };

  function changeCrystalState() {
    return;
  }

  function changeCrystalsToActivate() {
    return;
  }

  function returnCrystals() {
    return;
  }

  return {
    crystalsModuleInit: crystalsModuleInit,
    crystalsToRender: crystalsToRender,
  };
})();

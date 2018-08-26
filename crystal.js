//TODO ENABLE COLOR CHANGE FOR DIVS ON CRYSTAL DROP AND GROW

'use strict';

// Cellular Autonoma with Manual and Auto Mode
// Runs on event loop with two modules:
// boardModule == manipulates DOM and accepts user input to change board display
// crystalsModule == tracks and mutates crystal objects

const boardModule = (function board() {
  // default is a 4 by 4 square of divs
  let numDiv = [16];

  // Manual Mode:
  // array of color and position values for divs that have been manually
  // selected by the user to later populate with crystal objects
  let manualActiveCrystals = [];

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
      _reloadBoard();
    }
    else {console.log("Input must be greater than 4 and less than 64.");}
    //console.log(crystalsModule.crystalsToRender);
    //crystalsModule.crystalsToRender.length = 0;
    //console.log(crystalsModule.crystalsToRender);
  });
  $start.on('click', function() {
    //TODO begin game loop
    crystalsModule.manualCrystalsModuleInit();
    boardModuleInit();
    console.log("loop test");
    crystalsModule.autoCrystalsModuleInit();
    boardModuleInit();
    console.log("loop 2 test");
    crystalsModule.autoCrystalsModuleInit();
    boardModuleInit();
    console.log("loop 3 test");
    crystalsModule.autoCrystalsModuleInit();
    boardModuleInit();
  });
  //TODO reset

  //intialize board
  _refreshDivs();

  //*
  //Methods
  //*

  // accepts crystalsToRender array from crystal module and displays
  // activated crystals on the DOM
  function boardModuleInit() {

    //reset all DOM colors
    //grab all active divs
    let $active_divs = $board.find('.item-active');
    //reset active div classes
    $active_divs.toggleClass('item-active');

    //fetch crystalsToRender
    let crystalsToRender = crystalsModule.crystalsToRender;
    console.log(crystalsToRender);
    //display activated crystals on DOM
    for (let i = 0; i < crystalsToRender.length; i++) {
      //grab each div that maps to an active crystal object
      let activeDiv = document.getElementById(crystalsToRender[i].position);
      activeDiv.classList.add("item-active");
      //console.log(activeDiv);
    }
  }

  function _reloadBoard() {

    //remove all divs from game board
    $board.empty();

    //update numDiv and --colNum for CSS Grid with user input
    numDiv.pop();
    let inputValue = $userInput.val();
    numDiv.push(inputValue * inputValue);
    $board.css('--colNum', inputValue);

    //add divs based on user input
    for (let i = 0; i < numDiv[0]; i++) {
      $board.append(`<div id="${i}" class="item"></div>`);
    };
    //add event handlers to divs
    _refreshDivs();
  }

  function _refreshDivs() {

    //log position of activated divs
    function _logPosition() {
      let color = "red"
      //NOTE: Position IDs begin with 0 and increment untill the number of
      // squares - 1.
      let position = this.id;
      manualActiveCrystals.push([color, position]);
    }

    //grab all divs
    let $divs = $board.find('.item');
    // enable color change on click
    $divs.one('click', function() { this.classList.add("item-active") });
    // track which divs were clicked
    $divs.one('click', _logPosition);
  }

  return {
    numDiv: numDiv,
    boardModuleInit: boardModuleInit,
    manualActiveCrystals: manualActiveCrystals,
  };
})();

const crystalsModule = (function crystals() {

  //An a array of crystal objects built from the color and position
  //values recieved from the boardModule.crystalsToActivate array
  let crystalsToRender = [];

  //Crystal Object Constructor
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

      //pop current neighbors
      this.neighbors.pop();
      //store all active neighbor crystal objects adjacent to this crystal
      let neighborCrystals = crystalsModule.crystalsToRender.filter(crystalFilter, this)
      //reduce neighbor crystal objects to color and position
      let reducedNeighbors = neighborCrystals.map(obj => ({color: obj.color, position: obj.position}));
      //push to this crystal's neighbor array
      this.neighbors.push(reducedNeighbors);
    },
    setGrow: function() { this.willGrow = true; },
    setUnGrow: function() { this.willGrow = false; },
    setDie: function() { this.willDie = true; },
    setUnDie: function() { this.willDie = false; },
  };

  //*
  //Methods
  //*

  function manualCrystalsModuleInit() {
    // Manual Mode: After the user inputs active divs on the game board,
    // the corresponding divs are populated with crystal objects using the
    // manualActiveCrystal array as a reference, index 0 = position, index 1 = color
    let manualActiveCrystals = boardModule.manualActiveCrystals;
    //find game boardLength
    let boardLength = Math.sqrt(boardModule.numDiv);
    //add crystal objects to manually active divs
    manualGenerateCrystal(manualActiveCrystals, boardLength);
    updateCrystalState(boardLength);
  };

  function manualGenerateCrystal(manualActiveCrystals, boardLength) {
    // use manualActiveCrystals as a reference to place new crystal objects
    for(let i = 0; i < manualActiveCrystals.length; i++) {
      crystalsToRender[i] = Object.create(Crystal);
      crystalsToRender[i].init("red", manualActiveCrystals[i][1]);
      crystalsToRender[i].setPieceType(boardLength);
    };
  };

  function autoCrystalsModuleInit() {
    // Auto Mode: After intialized with Manual Mode, accept the crystalToRender
    // object array and mutate every cycle by droping or growing crystal objects,
    // and then updating setDie and setGrow properties. This is then passed
    // back to the boardModule to be uploaded to the DOM
    let boardLength = Math.sqrt(boardModule.numDiv);
    //drop crystals, filter out crystals with setDie property TRUE
    let filteredCrystals = crystalsToRender.filter(function(crystal) {
      return crystal.willDie == false;
    });
    //update module with new crystalsToRender
    crystalsModule.crystalsToRender = filteredCrystals;
    //grow crystals, create function for this, look for setgrow
    //create a new list of crystals and merge to existing list
    updateCrystalState(boardLength);
  };

  function updateCrystalState(boardLength) {
    // once all crystals are generated, record neighboring crystals
    for(let i = 0; i < crystalsModule.crystalsToRender.length; i++) {
      crystalsModule.crystalsToRender[i].findNeighbors(boardLength);
      //set willGrow
      if (crystalsModule.crystalsToRender[i].neighbors[0].length > 2 ) {
        crystalsModule.crystalsToRender[i].setGrow();
      };
      //set willDie
      if (crystalsModule.crystalsToRender[i].neighbors[0].length < 2 ) {
        crystalsModule.crystalsToRender[i].setDie();
      };
    };
  };

  return {
    autoCrystalsModuleInit: autoCrystalsModuleInit,
    manualCrystalsModuleInit: manualCrystalsModuleInit,
    crystalsToRender: crystalsToRender,
  };
})();

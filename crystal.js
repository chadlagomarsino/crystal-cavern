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

const boardModule = (function board() {
  //default is a 4 by 4 square of divs
  let numDiv = [16];
  //two dimensional array to store position and color of clicked crystals
  let positionAndColor = [];

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
      render();
    }
    else {console.log("Input must be greater than 4 and less than 64.");}
  });
  //TODO start
  //TODO reset
  refreshDivs();

  function refreshDivs() {
    //grab all divs
    let $divs = $board.find('.item');
    // enable color change on click
    $divs.one('click', function() { this.style.background = 'tomato'});
    // track which divs were clicked
    $divs.one('click', logPosition);
  }

  //log position of activated divs
  function logPosition() {
    let position = this.id;
    let color = "Red"
    positionAndColor.push([position, color]);
    console.log(positionAndColor);
  }

  //remove all divs from game board
  function clearBoard() {
    $board.empty();
  }

  //update numDiv and --colNum for CSS Grid with user input
  function setInput() {
    numDiv.pop();
    let inputValue = $userInput.val();
    numDiv.push(inputValue * inputValue);
    $board.css('--colNum', inputValue);
  }

  function render() {
    clearBoard();
    setInput();
    for (let i = 0; i < numDiv[0]; i++) {
      $board.append(`<div id="${i}" class="item"></div>`);
    };
    refreshDivs();
  }

  return {
    //pass ACTIVATED divs to crystalModule
    positionAndColor: positionAndColor
  };
})();

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

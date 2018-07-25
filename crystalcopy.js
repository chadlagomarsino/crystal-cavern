'use strict';

//Wrap into Module
  //Module for Container
  //Module for Crystals
//Create Crystal Constructor
  //Crystals have common properties to let them read the divs
  //around them
  //Each crystal time has special properties to put on the prototype

//Initalize creation of blank table and divs
//Event Click to create instance of Crystal

const myContainer = {
  //default is a 4 by 4 square of divs
  numDiv: [16],
  init: function() {
    this.cacheDom();
    this.bindEvents();
    this.bindDivs();
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
    //TODO start
    //TODO reset
  },
  bindDivs: function() {
    this.$divs = this.$board.find('.item');
    this.$divs.on('click', function() { this.style.background = 'tomato';});
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
        this.$board.append('<div class="item"></div>');
      };
      this.bindDivs();
    }
    else {
      console.log("Input must be greater than 4 and less than 64.");
    }
  }
};

myContainer.init();




//function Crystal() {
//
// };

//Define elements to be added

//grab container
const container = document.getElementsByClassName('container')[0];

//accept user input
function newTable() {

  //remove all divs from container
  divs = document.getElementsByClassName('item')
  while(divs[0]) {
    divs[0].parentNode.removeChild(divs[0])
  }

  //read userInput
  let userInput = document.getElementById("userInput").value;
  square = userInput * userInput;
  console.log(square);

  //set value of CSS Variables colNum & rowNum
  container.style.setProperty('--colNum', userInput);
  //container.style.setProperty('--rowNum', userInput);

  //add divs to grid
  let i;
  for (i = 0; i < square; i++) {
    const div = document.createElement('div');
    //add style classes
    div.classList.add('item');
    div.classList.add('item' + i);
    //add hover event listener
    div.addEventListener('mouseover', function(e) {
      e.target.style.background = 'tomato'
    })
    //div.textContent = i; //FOR TESTING
    container.appendChild(div);
  }
}

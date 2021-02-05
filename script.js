const btns = document.querySelectorAll(".btn");
const smallDisp = document.querySelector(".small");
const bigDisp = document.querySelector(".big");

let opQueue = ["0"];
let currString = "";
let displayString = "";
//let lastValue = "";
let result = 0;

function display(str, disp) {
  disp.innerText = str;
}

function IsDigit(chr) {
  return Number.isInteger(Number.parseInt(chr));
}

//is it a +, *, -, /?
function isOpSymbol(chr) {
  return chr === "-" || chr == "+" || chr === "*" || chr === "/";
}

// return the result of a operation defined by the parameters
function doOperation(op1, op2, sign) {
  switch (sign) {
    case "+":
      return op1 + op2;
    case "-":
      return op1 - op2;
    case "*":
      return op1 * op2;
    case "/":
      return op1 / op2;
    default:
      return undefined;
  }
}
//returns the result of the current queue of operations
function flushQueue(queue) {
  let sign = "+";
  queue = parseQueueToNr(queue);
  const reducer = (acc, currValue) => {
    if (isOpSymbol(currValue)) {
      sign = currValue;
      return acc;
    } else {
      return doOperation(acc, currValue, sign);
    }
  };

  return queue.reduce(reducer);
}

function reset() {
  opQueue = ["0"];
  currString = "";
  result = 0;
  displayString = "";
  display("0", smallDisp);
  display(0, bigDisp);
}

//return a new queue with all strings parsed into numbers
function parseQueueToNr(queue) {
  let newQueue = [];

  queue.forEach((el) => {
    if (isOpSymbol(el)) {
      newQueue.push(el);
    } else {
      newQueue.push(Number.parseFloat(el));
    }
  });

  return newQueue;
}

//is a string valid number or sign
function validatedString(str) {
  let result = true;
  if (str === "00") {
    result = false;
  }
  if (str.length > 18) {
    result = false;
  }
  if (isSign(str)) {
    result = true;
  }

  if (str.length > 3 && Number.parseFloat(str) != NaN) {
    result = true;
  }

  return result;
}

function last(arr) {
  return arr[arr.length - 1];
}

function resetQueue(res) {
  opQueue = ["0"];
  opQueue.push(res);
}

function formatStr(str) {
  // if there is a leading zero, on a string longer than 1 with no decimal point, eliminate it
  let strArr = str.split("");
  if (str.length > 1 && str.indexOf(".") != 1 && str[0] === "0") {
    strArr.shift();
    return strArr.join("");
  }
  return str;
}

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.id;
    processCmd(key, btn);
  });
});

function isDigitKey(key) {
  const keys = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "zero",
  ];
  if (keys.indexOf(key) > -1) {
    return true;
  }
  return false;
}

function isOpKey(key) {
  const keys = ["add", "subtract", "multiply", "divide"];
  if (keys.indexOf(key) > -1) {
    return true;
  }
  return false;
}

function getOp(symbol) {
  switch (symbol) {
    case "add":
      return "+";
    case "divide":
      return "/";
    case "subtract":
      return "-";
    case "multiply":
      return "*";
  }
}

function removeLast(str) {
  let strArr = str.split("");
  strArr.pop();
  return strArr.join("");
}

function processCmd(key, el) {
  //reset the state if clear is pressed
  if (key === "clear") {
    reset();
  }

  //if key is a digit, except zero and length does not exceed 18
  if (isDigitKey(key) && key != "zero" && currString.length < 18) {
    currString += el.innerText;
    //display current string on display plus updated string
    display(displayString + formatStr(currString), smallDisp);
  }

  //if key is zero and length does not exceed 18
  if (key == "zero" && currString.length < 18) {
    //if is zero
    if (currString == "") {
      // if current string is empty
      currString += "0";
    } else if (currString[0] != 0) {
      //if current string is not empty but first digit  !=0
      //we can add another zero
      currString += "0";
      //if string is not empty and first digit ==0 and second digit is decimal(dot)
    } else if (currString[0] == "0" && currString[1] === ".") {
      //we can add another zero
      currString += "0";
    }
    //display current string on display plus updated string
    display(displayString + formatStr(currString), smallDisp);
  }

  //if key is decimal point ...
  if (key === "decimal") {
    //if length of the string is greater than 3 and there is no other decimal point, just add a decimal point
    if (currString.length >= 2 && currString.indexOf(".") == -1) {
      currString += ".";
    }
    //if length of the string is 1 just add a decimal point
    if (currString.length === 1) {
      currString += ".";
    }
    //if string is empty, and "dot" is pressed add "0." to the string
    if (currString.length === 0) {
      currString = "0.";
    }
    //display current string on display plus updated string
    display(displayString + formatStr(currString), smallDisp);
  }

  //if the key is an operation. Here we are processing the  operation queue
  if (isOpKey(key)) {
    //commit current string to display and add current string to queue
    displayString += currString;
    if (currString.length > 0) {
      opQueue.push(currString);
    }

    //test if a symbol was entered in the queue
    if (!isOpSymbol(last(opQueue))) {
      opQueue.push(getOp(key));
      displayString += getOp(key);
      display(displayString, smallDisp);
    } else {
      //replace last simbol with current one in the queue and on display
      if (getOp(key) != "-") {
        opQueue.pop();
        opQueue.push(getOp(key));
        if (isOpSymbol(last(displayString))) {
          displayString = removeLast(displayString);
          displayString += getOp(key);
          display(displayString, smallDisp);
          //if there is a minus already entered, remove it from current string
          if (currString == "-") {
            currString = "";  
          }
        }
      } else {
        //if we are entering a negative number
        //ad a minus in the display
        //check if "-" has been already entered
        if (last(displayString) != "-") {
          currString = "-"; // add a minus to the current working number
          //display a temporary minus sign
          display(displayString + "-", smallDisp);
        }
      }
    }

    //TODO: deal with the minus sign

    //reset the current string
    if (currString != "-") currString = "";
  }

  //here we are handling the "equals" key
  if (key === "equals") {
    //push the last value entered and reset the current value
    if (currString.length > 0) {
      displayString += currString;
      opQueue.push(currString);
    }

    //reduce the queue to a single value
    result = flushQueue(opQueue);
    //put the result on display
    displayString = result.toString();
    display(displayString, smallDisp);
    display(result, bigDisp);
    displayString = result.toString();
    //initialize the operation queue with the result
    opQueue = [result];
    currString = "";
  }
}

//initial reset
reset();

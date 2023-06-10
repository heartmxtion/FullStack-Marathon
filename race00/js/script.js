// import ExpArray from './number.js';
//HEAD
var equation = document.getElementById('equation');
var result = document.getElementById('result');

function factorial(num) {
  if (num === 0 || num === 1) {
      return 1;
  }
  let result = 1;
  for (let i = 2; i <= num; i++) {
      result *= i;
  }
  return result;
}

function pow(a, b) {
  let result = 1;
  for (let i = 0; i < b; i++) {
      result *= a;
  }
  return result;
}

function sqrt(num) {
  if (num < 0) return NaN; 
  if (num === 0 || num === 1) return num; 
  var precision = 0.00001;
  var guess = num;

  while (Math.abs(guess * guess - num) > precision) {
      guess = (guess + num / guess) / 2;
  }
  return guess;
}


class MyNumber {
  constructor() {
      this.number = 0;
      this.stringNum = "";
      this.publicString = "";
      this.hasDot = false;
      this.base = 10;
      this.Nan = true;
  }

  addElem(elem) {

      if (elem == '.') {
          if (this.hasDot) return;
          this.hasDot = true;
          this.Nan = true;
      }
      else this.Nan = false;

      if (/[a-f]/.test(elem) && this.base != 16) return;
      if (/[2-9]/.test(elem) && this.base == 2) return;
      this.stringNum += elem;

      if (!this.Nan) {
          let decimalValue = parseInt(this.stringNum, this.base);
          
          if (this.stringNum.includes('.')) {
            const fractionalPart = this.stringNum.slice(this.stringNum.indexOf('.') + 1);
            if (fractionalPart) {
                const fractionalValue = parseInt(fractionalPart, this.base) / Math.pow(this.base, fractionalPart.length);
                this.number = decimalValue + (fractionalValue || 0);
            }
            else this.number = decimalValue;
          }
          else this.number = decimalValue;
      }

  }

  clear() {
    this.number = 0;
    this.stringNum = "";
  }

  popa() {
    this.stringNum = this.stringNum.slice(0, this.stringNum.length - 1);
    if (!this.Nan) {
      let decimalValue = parseInt(this.stringNum, this.base);
      
      const fractionalPart = this.stringNum.split(".")[1];
      if (fractionalPart) {
          const fractionalValue = parseInt(fractionalPart, this.base) / Math.pow(this.base, fractionalPart.length);
          this.number = decimalValue + (fractionalValue || 0);
      }
      else this.number = decimalValue;
    }
  }

  setBase(base) {
      this.base = base;
      if (this.number != 0)
          this.stringNum = this.number.toString(this.base);
      else this.stringNum = "";
  }

  toString() {
      if (this.Nan) this.publicString = this.stringNum;
      else this.publicString = this.number.toString(this.base);
      console.log("->", this.number, this.number.toString(this.base), this.base);
      return this.publicString;
  }

  get num() {
      return this.number;
  }

  setNum(num) {
      this.number = num;
      this.Nan = false;
  }
}

class ExpArray {
  constructor() {
      this.array = [new MyNumber()];
      this.array[0].setNum(0);
      this.array.push('+');
      this.base = 10;
  }

  insert(symbol) {
      if (/[+\-*/!()^√]/.test(symbol)) {
          // if (!(/[+\-*/!()^√]/.test(this.array[this.array.length - 1])))
          this.array.push(symbol);
          return;
      }

      if (this.array.length == 2
          || /[+\-*/!()^√]/.test(this.array[this.array.length - 1])) {
          this.array.push(new MyNumber());
      }
      this.array[this.array.length - 1].addElem(symbol);
  }

  popa() {
      if (this.array.length != 2) {
        if (!(this.array[this.array.length - 1] instanceof MyNumber)) {
          this.array.pop();
        }
        else if (this.array[this.array.length - 1].stringNum.length == 1) {
          this.array.pop();
        }
        else this.array[this.array.length - 1].popa();
      }
  }

  clear() {
    this.array = [new MyNumber()];
    this.array[0].setNum(0);
    this.array.push('+');
  }

  setBase(base) {
      this.base = base;
      for (let i = 2; i < this.array.length; i++) {
          if (this.array[i] instanceof MyNumber) {
              this.array[i].setBase(this.base);
          }
      }
  }

  toString() {
      let str = "";
      for (let i = 1; i < this.array.length; i++) {
          if (this.array[i] instanceof MyNumber) {
              str += this.array[i].toString();
          }
          else {
              if ((i == 1 && this.array[i] != '+') || i != 1) 
                  str += this.array[i];
          }
      }
      return str;
  }

  toExpression() {
      let str = "";
      for (let i = 0; i < this.array.length; i++) {
          if (this.array[i] instanceof MyNumber) {
              str += this.array[i].num.toString();
          }
          else str += this.array[i];
      }
      return str;
  }


  toggleSign() {
      if (this.array[this.array.length - 1] instanceof MyNumber) {
          if (this.array.length - 1 != 0) {
              if (this.array[this.array.length - 2] == '-') {
                  this.array[this.array.length - 2] = '+';
              } 
              else if (this.array[this.array.length - 2] == '+') {
                  this.array[this.array.length - 2] = '-';
              }
          }
      }
  }

  calculateExpression() {
      let expression = this.array;
  
      const operators = {
          '+': { precedence: 1, fn: (a, b) => a + b },
          '-': { precedence: 1, fn: (a, b) => a - b },
          '*': { precedence: 2, fn: (a, b) => a * b },
          '/': { precedence: 2, fn: (a, b) => a / b },
          '^': { precedence: 3, fn: (a, b) => pow(a, b) },
          '!': { precedence: 3, fn: factorial },
          '√': { precedence: 4, fn: sqrt }
      };
  
      const outputQueue = [];
      const operatorStack = [];

      for (let i = 0; i < expression.length; i++) {
          const item = expression[i];
  
          if (item instanceof MyNumber) {
              outputQueue.push(item.num);
          } else if (item === '(') {
              operatorStack.push(item);
          } else if (item === ')') {
              while (
                  operatorStack.length > 0 &&
                  operatorStack[operatorStack.length - 1] !== '('
              ) {
                  const operator = operatorStack.pop();
                  const operand2 = outputQueue.pop();
                  const operand1 = outputQueue.pop();
                  const result = operators[operator].fn(operand1, operand2);
                  outputQueue.push(result);
              }
  
              if (operatorStack.length === 0 
                  || operatorStack[operatorStack.length - 1] !== '(') {
                  throw new Error('Некорректное выражение');
              }
  
              operatorStack.pop();
          } else if (item === '√') {
              operatorStack.push(item);
          } else if (item === '!') {
              const operator = operators[item];
              const operand = outputQueue.pop();
              const result = operator.fn(operand);
              outputQueue.push(result);
          } else {
              const currentOperator = operators[item];
              let precedence = currentOperator.precedence;
  
              if (item === '-' && (i === 0 || expression[i - 1] === '(')) {
                  outputQueue.push(0);
                  precedence = 3;
              }
  
              while (
                  operatorStack.length > 0 &&
                  operatorStack[operatorStack.length - 1] !== '(' &&
                  precedence <= operators[operatorStack[operatorStack.length - 1]].precedence
              ) {
                  const operator = operatorStack.pop();
                  const operand2 = outputQueue.pop();
                  const operand1 = outputQueue.pop();
                  const result = operators[operator].fn(operand1, operand2);
                  outputQueue.push(result);
              }
  
              operatorStack.push(item);
          }
      }
  
      while (operatorStack.length > 0) {
          const operator = operatorStack.pop();
          if (operator === '√') {
              const operand = outputQueue.pop();
              const result = operators[operator].fn(operand);
              outputQueue.push(result);
          } else {
              const operand2 = outputQueue.pop();
              const operand1 = outputQueue.pop();
              const result = operators[operator].fn(operand1, operand2);
              outputQueue.push(result);
          }
      }
  
      if (outputQueue.length !== 1 || operatorStack.length !== 0) {
          throw new Error('Некорректное выражение');
      }
      
      return outputQueue[0];
  }
}

let arr = new ExpArray();
let res = new MyNumber();


// Получаем ссылку на элемент powerBtn
var powerBtn = document.querySelector('.powerBtn');

// Флаг для отслеживания текущего состояния калькулятора в целом
var isCalculatorActive = false;

// Флаг для отслеживания текущего состояния только конвертора
var isConvertorActive = false;

// Добавляем обработчик события клика на powerBtn
powerBtn.addEventListener('click', function() {
    // Получаем ссылку на изображение внутри powerBtn
    var image = powerBtn.querySelector('img');
    var calculatorInput = document.getElementById('screen');
    var equation = document.getElementById('equation');
    var result = document.getElementById('result');

    // Проверяем текущее состояние изображения
    if (isCalculatorActive) {
        // Если изображение активно, возвращаем исходное изображение
        image.src = 'https://cdn.discordapp.com/attachments/695034009666846723/1113420826109292555/power-btn.png';
        isCalculatorActive = false;
        calculatorInput.style.backgroundColor = 'gray';
        equation.textContent = '';
		result.textContent = '';

    } else {
        // Если изображение неактивно, меняем его на активное изображение
        image.src = 'https://media.discordapp.net/attachments/695034009666846723/1113420826809749514/power-btn-active.png';
        isCalculatorActive = true;
        calculatorInput.style.backgroundColor = '#7B7392';
		equation.textContent = '';
        result.textContent = '0';

        arr.clear();
        res.clear();
    }
});

// Обработчик события загрузки для iframe
document.getElementById('spotifyFrame').onload = function() {
  const button = document.getElementById('hideButton');
  button.style.display = 'block'; // Отображение кнопки после полной загрузки iframe
};
//HEAD

//SUB FUNCTIONS
function removeDuplicatePlus() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive) {
		var currentInput = equation.textContent;

		// Используем регулярное выражение для поиска последовательности "+" подряд
		var regex = /\++/g;
		var updatedInput = currentInput.replace(regex, '+');

		equation.textContent = updatedInput;
	}
}

function removeLeadingPlus() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive) {
		var currentInput = equation.textContent;

		// Проверяем, является ли первый символ "+" и удаляем его, если это так
		if (currentInput.startsWith("+")) {
			equation.textContent = currentInput.substring(1);
		}
	}
}

function removeAdjacentPlus() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive) {
		var currentInput = equation.textContent;

		// Используем регулярное выражение для удаления плюса, если рядом с ним стоит минус
		var regex = /\+-(?=\d)/g; // Находим плюс, если за ним следует минус и число
		var updatedInput = currentInput.replace(regex, '-');

		equation.textContent = updatedInput;
	}
}

function replacePlusWithNegative() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive) {
		var currentInput = equation.textContent;

		// Используем регулярное выражение для замены плюса на минус в скобках,
		// если перед плюсом стоит знак операции * или / или %
		var regex = /([*/%])\s*\-/g; // Находим * или / или %, за которым следует плюс
		var updatedInput = currentInput.replace(regex, '$1(-');

		equation.textContent = updatedInput;
	}
}

function removePlusBeforeOpeningBracket() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive) {
		var currentInput = equation.textContent;

		// Используем регулярное выражение для удаления плюса, если перед ним стоит (
		var regex = /\(\s*\+/g; // Находим (, за которым следует плюс
		var updatedInput = currentInput.replace(regex, '(');

		equation.textContent = updatedInput;
	}
}

// Функция для сохранения истории в localStorage
function saveHistoryToLocalStorage() {
  if (isCalculatorActive) {
    localStorage.setItem("calculatorHistory", calculatorHistory.join(";"));
  }
}

// Функция для загрузки истории из localStorage
function loadHistoryFromLocalStorage() {
  var history = localStorage.getItem("calculatorHistory");
  if (history) {
    calculatorHistory = history.split(";");
  }
}

// Вызываем функцию загрузки при загрузке страницы
window.addEventListener("load", loadHistoryFromLocalStorage);

// Вызываем функцию сохранения при закрытии страницы или перезагрузке
window.addEventListener("beforeunload", saveHistoryToLocalStorage);
//SUB FUNCTIONS

//TOP MENU
function clearCalculator() {
	if (isCalculatorActive) {
		equation.textContent = '';
		result.textContent = '0';
    arr.clear();
    res.clear();
	}
}

function removeLastCharacter() {
	var equation = document.getElementById('equation');
	if (isCalculatorActive){
    arr.popa();
    equation.textContent = arr.toString();
    if (arr.array.length > 2)
      autucalc();
    else result.textContent = "0";
	}
}

var calculatorHistory = [];

function showHistory() {
  if (isCalculatorActive) {
    var historyMenu = document.getElementById("historyMenu");
    var historyList = document.getElementById("historyList");

    // Очищаем список истории перед отображением
    historyList.innerHTML = "";

    // Создаем элементы списка истории и добавляем их в меню
    calculatorHistory.forEach(function(expression) {
      var listItem = document.createElement("li");
      listItem.textContent = expression;
      historyList.appendChild(listItem);
    });

    // Проверяем текущее состояние меню
    if (historyMenu.style.display === "block") {
      // Если меню уже отображено, скрываем его
      historyMenu.style.display = "none";
    } else {
      // Иначе отображаем меню с историей
      historyMenu.style.display = "block";
    }
  }
}

function addToHistory(expression, result) {
  var historyItem = expression + " = " + result;
  calculatorHistory.push(historyItem);
}

function clearHistory() {
	calculatorHistory = [];
	showHistory(); //закрытие меню
	showHistory(); //повторное открытие для обновления
}

function showFunctions() {
  if (isCalculatorActive) {
    var funcMenu = document.getElementById("funcMenu");
	  var calculator = document.getElementById("calculator");
    let letterMenu = document.getElementById("letterMenu");


    // Проверяем текущее состояние меню
    if (funcMenu.style.display === "block") {
      // Если меню уже отображено, скрываем его
      funcMenu.style.display = "none";
      if (letterMenu.style.display == "block") {
        calculator.style.borderRadius = "10px 10px 10px 0px";
      }
      else calculator.style.borderRadius = "10px 10px 10px 10px";
    } else {
      // Иначе отображаем меню
     funcMenu.style.display = "block";
      if (letterMenu.style.display == "block") {
        calculator.style.borderRadius = "10px 10px 0px 0px";
      }
      else calculator.style.borderRadius = "10px 10px 0px 10px";
    }
  }
}

function showConvert() {
	if (isCalculatorActive) {
	  var convertMenu = document.getElementById("convertMenu");
	  isConvertorActive = true;
      convertMenu.style.display = "block";
	}
}

function backToCalculator() {
	if (isCalculatorActive) {
	  var convertMenu = document.getElementById("convertMenu");
	  isConvertorActive = false;
      convertMenu.style.display = "none";
	}
}
//TOP MENU

//Calculating


function sliceStringByRegex(string, regex) {
  const match = string.match(regex);
  if (match) {
    const startIndex = match.index;
    const endIndex = startIndex + match[0].length;
    return string.slice(startIndex, endIndex);
  }
  return '';
}



function addToHistory(expression, result) {
    var historyItem = expression + " = " + result;
    calculatorHistory.push(historyItem);
	showHistory(); //обновление значения
	showHistory(); //меню
}



//Convertations BTNS
function convertLengths() {
	if (isCalculatorActive) {
	  var convertByLength = document.getElementById("convertByLength");
	  var convertByWeight = document.getElementById("convertByWeight");
	  var convertByArea = document.getElementById("convertByArea");
	  
      var convertByLengthBTN = document.querySelector(".convertationChoose-list-item:nth-child(1)");
      var convertByWeightBTN = document.querySelector(".convertationChoose-list-item:nth-child(2)");
      var convertByAreaBTN = document.querySelector(".convertationChoose-list-item:nth-child(3)");
	  
      convertByLength.style.display = "block";
	  convertByWeight.style.display = "none";
	  convertByArea.style.display = "none";
	  
	  convertByLengthBTN.style.border = "1px solid #fff";
	  convertByWeightBTN.style.border = "1px solid gray";
	  convertByAreaBTN.style.border = "1px solid gray";
	}
}

function convertWeights() {
	if (isCalculatorActive) {
	  var convertByLength = document.getElementById("convertByLength");
	  var convertByWeight = document.getElementById("convertByWeight");
	  var convertByArea = document.getElementById("convertByArea");
	  
      var convertByLengthBTN = document.querySelector(".convertationChoose-list-item:nth-child(1)");
      var convertByWeightBTN = document.querySelector(".convertationChoose-list-item:nth-child(2)");
      var convertByAreaBTN = document.querySelector(".convertationChoose-list-item:nth-child(3)");
	  
	  convertByLength.style.display = "none";
      convertByWeight.style.display = "block";
	  convertByArea.style.display = "none";
	  
	  convertByLengthBTN.style.border = "1px solid gray";
	  convertByWeightBTN.style.border = "1px solid #fff";
	  convertByAreaBTN.style.border = "1px solid gray";
	}
}

function convertAreas() {
	if (isCalculatorActive) {
	  var convertByLength = document.getElementById("convertByLength");
	  var convertByWeight = document.getElementById("convertByWeight");
	  var convertByArea = document.getElementById("convertByArea");
	  
      var convertByLengthBTN = document.querySelector(".convertationChoose-list-item:nth-child(1)");
      var convertByWeightBTN = document.querySelector(".convertationChoose-list-item:nth-child(2)");
      var convertByAreaBTN = document.querySelector(".convertationChoose-list-item:nth-child(3)");
	  
      convertByLength.style.display = "none";
      convertByWeight.style.display = "none";
	  convertByArea.style.display = "block";
	  
	  convertByLengthBTN.style.border = "1px solid gray";
	  convertByWeightBTN.style.border = "1px solid gray";
	  convertByAreaBTN.style.border = "1px solid #fff";
    }
}
//Convertations BTNS

//Convertations
	const lengthConverterItems = document.querySelectorAll('#convertByLength .converter-input');
	lengthConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[2].value = val / 100;
		lengthConverterItems[1].value = val / 100000;
	});
	lengthConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[0].value = val * 100000;
		lengthConverterItems[2].value = val * 1000;
	});

	lengthConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		lengthConverterItems[0].value = val * 100;
		lengthConverterItems[1].value = val / 1000;
	});

	const weightConverterItems = document.querySelectorAll('#convertByWeight .converter-input');
	weightConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[1].value = val / 1000;
		weightConverterItems[2].value = val / 1000000;
	});
	weightConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[0].value = val * 1000;
		weightConverterItems[2].value = val / 1000;
	});

	weightConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		weightConverterItems[0].value = val * 1000000;
		weightConverterItems[1].value = val * 1000;
	});
	const areaConverterItems = document.querySelectorAll('#convertByArea .converter-input');
	areaConverterItems[0].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[2].value = val / 10000;
		areaConverterItems[1].value = val / 10000000000;
	});
	areaConverterItems[1].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[0].value = val * 10000000000;
		areaConverterItems[2].value = val * 1000000;
	});

	areaConverterItems[2].addEventListener('input', (e) => {
		const val = e.target.value;
		areaConverterItems[0].value = val * 10000;
		areaConverterItems[1].value = val / 1000000;
	});
//Convertations

//Memory
	function memoryAction(operation) {
		switch (operation) {
			case 'mr':
				memoryRecall();
				break;
			case 'mc':
				memoryClear();
				break;
			case 'm+':
				memoryAdd();
				break;
			case 'm-':
				memorySubtract();
				break;
			case 'ms':
				memoryStore();
		}
	}

var memory = 0;

// Функция очистки памяти
function memoryClear() {
  memory = 0;
}

// Функция получения значения из памяти и отображения на экране
function memoryRecall() {
  var equation = document.getElementById('equation');
  var result = document.getElementById('result');
  equation.textContent = memory.toString();
  result.textContent = memory.toString();
}

// Функция сохранения текущего значения на экране в память
function memoryStore() {
  var result = document.getElementById('result');
  memory = parseFloat(result.textContent);
}

// Функция добавления текущего значения на экране к значению в памяти
function memoryAdd() {
  var result = document.getElementById('result');
  var currentValue = parseFloat(result.textContent);
  memory += currentValue;
}

// Функция вычитания текущего значения на экране из значения в памяти
function memorySubtract() {
  var result = document.getElementById('result');
  var currentValue = parseFloat(result.textContent);
  memory -= currentValue;
}
//Memory



function showMusicMenu(){
    var musicMenu = document.getElementById("calculatorPlaylist");
	  if (isCalculatorActive) {
        if (musicMenu.style.display === "block") {
            musicMenu.style.display = "none";
        } else {
            musicMenu.style.display = "block";
      }
	}
}

//Numeral systems BTNS
function decimalSystem() {
	if (isCalculatorActive) {
	  
      var decimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(1)");
      var hexadecimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(2)");
      var binaryBTN = document.querySelector(".numeralChoose-list-item:nth-child(3)");

	  decimalBTN.style.border = "1px solid #fff";
	  hexadecimalBTN.style.border = "1px solid gray";
	  binaryBTN.style.border = "1px solid gray";
    arr.setBase(10);
    res.setBase(10);
    equation.textContent = arr.toString();
    result.textContent = res.toString();
    let letterMenu = document.getElementById("letterMenu");
    letterMenu.style.display = "none";
    var funcMenu = document.getElementById("funcMenu");
    var calculator = document.getElementById("calculator");
    if (funcMenu.style.display == "block") {
      calculator.style.borderRadius = "10px 10px 0px 10px";
    }
    else calculator.style.borderRadius = "10px 10px 10px 10px";
	}
}

function hexadecimalSystem() {
	if (isCalculatorActive) {
	  
      var decimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(1)");
      var hexadecimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(2)");
      var binaryBTN = document.querySelector(".numeralChoose-list-item:nth-child(3)");

	  decimalBTN.style.border = "1px solid gray";
	  hexadecimalBTN.style.border = "1px solid #fff";
	  binaryBTN.style.border = "1px solid gray";
    arr.setBase(16);
    res.setBase(16);
    equation.textContent = arr.toString();
    result.textContent = res.toString();
    let letterMenu = document.getElementById("letterMenu");
    letterMenu.style.display = "block";
    var funcMenu = document.getElementById("funcMenu");
    var calculator = document.getElementById("calculator");
    if (funcMenu.style.display == "block") {
      calculator.style.borderRadius = "10px 10px 0px 0px";
    }
    else calculator.style.borderRadius = "10px 10px 10px 0px";
	}
}

function binarySystem() {
	if (isCalculatorActive) {
	  
      var decimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(1)");
      var hexadecimalBTN = document.querySelector(".numeralChoose-list-item:nth-child(2)");
      var binaryBTN = document.querySelector(".numeralChoose-list-item:nth-child(3)");

      decimalBTN.style.border = "1px solid gray";
      hexadecimalBTN.style.border = "1px solid gray";
      binaryBTN.style.border = "1px solid #fff";
      arr.setBase(2);
      res.setBase(2);
      equation.textContent = arr.toString();
      result.textContent = res.toString();
      let letterMenu = document.getElementById("letterMenu");
      letterMenu.style.display = "none";
      var funcMenu = document.getElementById("funcMenu");
    var calculator = document.getElementById("calculator");
    if (funcMenu.style.display == "block") {
      calculator.style.borderRadius = "10px 10px 0px 10px";
    }
    else calculator.style.borderRadius = "10px 10px 10px 10px";
    }
}
//Numeral systems BTNS

//Keyboard support
document.addEventListener("keydown", function (event) {
	if(isConvertorActive === false) {
    if(isCalculatorActive) {
      switch (event.key) {
        case "0": case "1": case "2": case "3": case "4":
        case "5": case "6": case "7": case "8": case "9":
        case "+": case "-": case "*": case "/": case "^":
        case ".":
          append(event.key);
          break;
        case "=": case "Enter":
          calculate();
          break;
        case "Backspace":
          removeLastCharacter();
          break;
        default:
          break;
      }
    }
	}
});
//Keyboard support

function square() {
  arr.insert('^');
  arr.insert('2');
  equation.textContent = arr.toString();
  autucalc();
}

function inverse() {
  arr.insert('1');
  arr.insert('/');
  equation.textContent = arr.toString();
  autucalc();
}

function append(symbol) {
  if (isCalculatorActive) {
    arr.insert(symbol);
    console.log(arr.toString());
    equation.textContent = arr.toString();
    autucalc();
  }
}

function toggleSign() {
  if (isCalculatorActive) {
    arr.toggleSign();
    equation.textContent = arr.toString();
    autucalc();
  }
}

function autucalc() {
  if (isCalculatorActive) {
    res.setNum(arr.calculateExpression());
    console.log(res.toString(), arr.calculateExpression());
    result.textContent = res.toString();
  }
}

function calculate() {
  if (isCalculatorActive) {
    res.setNum(arr.calculateExpression());
    console.log(res.toString(), arr.calculateExpression());
    result.textContent = res.toString();
    addToHistory(arr.toString(), res.toString());
    equation.textContent = result.textContent;
  }
}
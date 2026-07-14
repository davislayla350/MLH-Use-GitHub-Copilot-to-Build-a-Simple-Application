const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');

let currentValue = '0';
let previousValue = null;
let operator = null;
let waitingForSecondOperand = false;
let memoryValue = 0;

function updateDisplay() {
  display.textContent = currentValue;
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function appendDigit(digit) {
  if (waitingForSecondOperand) {
    currentValue = digit;
    waitingForSecondOperand = false;
  } else if (currentValue === '0') {
    currentValue = digit;
  } else {
    currentValue += digit;
  }

  updateDisplay();
}

function appendDecimal() {
  if (waitingForSecondOperand) {
    currentValue = '0.';
    waitingForSecondOperand = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }

  updateDisplay();
}

function backspace() {
  if (waitingForSecondOperand) return;
  currentValue = currentValue.length <= 1 ? '0' : currentValue.slice(0, -1);
  updateDisplay();
}

function formatResult(value) {
  const rounded = Number(value.toFixed(10));
  return String(rounded);
}

function calculate(firstValue, secondValue, operation) {
  switch (operation) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '*':
      return firstValue * secondValue;
    case '/':
      if (secondValue === 0) {
        return 'Error';
      }
      return firstValue / secondValue;
    default:
      return secondValue;
  }
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (previousValue === null) {
    previousValue = inputValue;
  } else if (operator) {
    const result = calculate(previousValue, inputValue, operator);
    currentValue = formatResult(result);
    previousValue = Number(currentValue);
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  updateDisplay();
}

function handleEquals() {
  if (!operator || previousValue === null) return;

  const inputValue = Number(currentValue);
  const result = calculate(previousValue, inputValue, operator);
  currentValue = result === 'Error' ? 'Error' : formatResult(result);
  previousValue = null;
  operator = null;
  waitingForSecondOperand = true;
  updateDisplay();
}

function handleMemory(action) {
  const inputValue = Number(currentValue);

  switch (action) {
    case 'clear':
      memoryValue = 0;
      break;
    case 'add':
      memoryValue += inputValue;
      break;
    case 'subtract':
      memoryValue -= inputValue;
      break;
    case 'recall':
      currentValue = String(memoryValue);
      waitingForSecondOperand = false;
      updateDisplay();
      return;
  }

  currentValue = String(memoryValue);
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'number') {
      appendDigit(value);
    } else if (action === 'decimal') {
      appendDecimal();
    } else if (action === 'backspace') {
      backspace();
    } else if (action === 'clear') {
      clearAll();
    } else if (action === 'operator') {
      handleOperator(value);
    } else if (action === 'equals') {
      handleEquals();
    } else if (action === 'memory') {
      handleMemory(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    appendDigit(key);
  } else if (key === '.') {
    appendDecimal();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearAll();
  } else if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key === '*' ? '*' : key === '/' ? '/' : key);
  } else if (key === 'Enter' || key === '=') {
    handleEquals();
  }
});

updateDisplay();

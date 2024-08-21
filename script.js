class Calculator {
  constructor(previousOperandDisplayElement, currentOperandDisplayElement) {
    this.previousOperandDisplayElement = previousOperandDisplayElement;
    this.currentOperandDisplayElement = currentOperandDisplayElement;
    this.clear();
    this.memory = 0;
  }

  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.trigonometricOperation = undefined;
    this.isRadMode = true;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
  }

  appendNumber(number) {
    if (this.trigonometricOperation && this.currentOperand.includes("()")) {
      this.currentOperand = this.currentOperand.replace("()", `(${number})`);
    } else if (
      this.trigonometricOperation &&
      this.currentOperand.includes("(")
    ) {
      this.currentOperand = this.currentOperand.replace(
        /\((.*?)\)/,
        `($1${number})`
      );
    } else {
      if (number === "." && this.currentOperand.includes(".")) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentOperand === "") return;
    if (this.previousOperand !== "") {
      this.calculate();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
  }

  applyTrigonometricOperation(operation) {
    console.log(`Applying trigonometric operation: ${operation}`);

    if (!this.currentOperand.includes(`${operation}(`)) {
      this.currentOperand = `${operation}()`;
    }
    this.trigonometricOperation = operation;
    this.updateDisplay();
  }

  toggleMode() {
    this.isRadMode = !this.isRadMode;
    const degButton = document.querySelector("[data-mode='Deg']");
    const radButton = document.querySelector("[data-mode='Rad']");
    if (degButton && radButton) {
      if (this.isRadMode) {
        radButton.classList.add("active");
        degButton.classList.remove("active");
      } else {
        degButton.classList.add("active");
        radButton.classList.remove("active");
      }
    }
  }

  addParentheses(parenthesis) {
    this.currentOperand += parenthesis;
  }

  calculate() {
    let calculation;
    if (this.trigonometricOperation) {
      const current = parseFloat(this.currentOperand.match(/\((.*?)\)/)?.[1]);
      if (isNaN(current)) return;

      switch (this.trigonometricOperation) {
        case "sin":
          calculation = Math.sin(
            this.isRadMode ? current : (current * Math.PI) / 180
          );
          break;
        case "cos":
          calculation = Math.cos(
            this.isRadMode ? current : (current * Math.PI) / 180
          );
          break;
        case "tan":
          calculation = Math.tan(
            this.isRadMode ? current : (current * Math.PI) / 180
          );
          break;
        case "sin⁻¹":
          calculation = this.isRadMode
            ? Math.asin(current)
            : (Math.asin(current) * 180) / Math.PI;
          break;
        case "cos⁻¹":
          calculation = this.isRadMode
            ? Math.acos(current)
            : (Math.acos(current) * 180) / Math.PI;
          break;
        case "tan⁻¹":
          calculation = this.isRadMode
            ? Math.atan(current)
            : (Math.atan(current) * 180) / Math.PI;
          break;
        default:
          return;
      }

      this.currentOperand = calculation;
      this.trigonometricOperation = undefined;
    } else {
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;

      switch (this.operation) {
        case "+":
          calculation = prev + current;
          break;
        case "-":
          calculation = prev - current;
          break;
        case "x":
          calculation = prev * current;
          break;
        case "÷":
          calculation = prev / current;
          break;
        case "%":
          calculation = (prev * current) / 100;
          break;
        case "x10^x":
          calculation = prev * Math.pow(10, current);
          break;
        case "x^y":
          calculation = Math.pow(prev, current);
          break;
        case "log":
          calculation = Math.log10(parseFloat(current));
          break;
        case "ln":
          calculation = Math.log(parseFloat(current));
          break;
        case "e^x":
          calculation = Math.exp(parseFloat(current));
          break;
        case "π":
          calculation = Math.PI;
          break;
        case "√":
          calculation = Math.sqrt(parseFloat(current));
          break;
        case "x!":
          calculation = this.factorial(parseInt(current));
          break;
        case "x^2":
          calculation = Math.pow(parseFloat(current), 2);
          break;
        case "x^-1":
          calculation = 1 / parseFloat(current);
          break;
        default:
          return;
      }
      this.currentOperand = calculation;
      this.operation = undefined;
      this.previousOperand = "";
    }
    this.updateDisplay();
  }

  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  getDisplayNumber(number) {
    if (typeof number === "string" && number.includes("(")) {
      return number;
    }
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 10,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }
  
  // Memory Add (M+)
  memoryAdd() {
    const current = parseFloat(this.currentOperand);
    if (!isNaN(current)) {
      this.memory += current;
    }
    console.log("Memory after M+:", this.memory);
  }

  // Memory Subtract (M-)
  memorySubtract() {
    const current = parseFloat(this.currentOperand);
    if (!isNaN(current)) {
      this.memory -= current;
    }
    console.log("Memory after M-:", this.memory);
  }

  // Memory Clear (MC)
  memoryClear() {
    this.memory = 0;
    console.log("Memory cleared:", this.memory);
  }

  updateDisplay() {
    this.currentOperandDisplayElement.innerText = this.getDisplayNumber(
      this.currentOperandResult ?? this.currentOperand
    );
    if (this.operation != null) {
      this.previousOperandDisplayElement.innerText = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandDisplayElement.innerText = "";
    }
  }
}

const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-allClear]");
const trigonometricButtons = document.querySelectorAll("[data-trigonometric]");
const mathematicalButtons = document.querySelectorAll("[data-mathematics]");
const modeButtons = document.querySelectorAll("[data-mode]");
const parenthesesButtons = document.querySelectorAll("[data-parentheses]");
const previousOperandDisplayElement = document.querySelector("[data-previous]");
const currentOperandDisplayElement = document.querySelector("[data-current]");
const memoryAddButton = document.querySelector("[data-memory-add]");
const memorySubtractButton = document.querySelector("[data-memory-subtract]");
const memoryClearButton = document.querySelector("[data-memory-clear]");

const calculator = new Calculator(
  previousOperandDisplayElement,
  currentOperandDisplayElement
);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

trigonometricButtons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(`Button clicked: ${button.innerText}`);
    calculator.applyTrigonometricOperation(button.innerText);
  });
});

mathematicalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.toggleMode();
  });
});

parenthesesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.addParentheses(button.innerText);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener("click", () => {
  calculator.calculate();
  calculator.updateDisplay();
});

allClearButton.addEventListener("click", () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", () => {
  calculator.delete();
  calculator.updateDisplay();
});

memoryAddButton.addEventListener("click", () => {
  calculator.memoryAdd();
});

memorySubtractButton.addEventListener("click", () => {
  calculator.memorySubtract();
});

memoryClearButton.addEventListener("click", () => {
  calculator.memoryClear();
});

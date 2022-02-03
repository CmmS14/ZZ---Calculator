var isRadiant = false;

const equation = document.getElementById('equation');
const equals = document.getElementById('equals');
const resultOutput = document.getElementById('result');
const equationContainer = document.getElementById('equation_container');
const radiant = document.getElementById('radiant');
const degree = document.getElementById('degree');

equation.addEventListener('keydown', checkInput);
equals.addEventListener('click', findResult);

function checkInput(e) {
    let allow_char = [8, 13, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 188, 189, 190, 223];
    if (allow_char.indexOf(e.which) === -1) {
        e.preventDefault();
    }
}

function pressedKey(e) {
    switch (e.textContent) {
        case '√': {
            equation.value += '√(';
            break;
        }
        case 'x²': {
            equation.value += '^(2)';
            break;
        }
        case 'xⁿ': {
            equation.value += '^(';
            break;
        }
        case 'log': {
            equation.value += 'log(';
            break;
        }
        case 'ln': {
            equation.value += 'ln(';
            break;
        }
        case 'sin': {
            equation.value += 'sin(';
            break;
        }
        case 'cos': {
            equation.value += 'cos(';
            break;
        }
        case 'tan': {
            equation.value += 'tan(';
            break;
        }
        case 'cot': {
            equation.value += 'cot(';
            break;
        }
        case 'C': {
            equation.value = '';
            resultOutput.textContent = '';
            break;
        }
        case 'rad|°': {
            if (isRadiant) {
                isRadiant = false;
                radiant.classList.add('muted');
                degree.classList.remove('muted');
            } else {
                isRadiant = true;
                radiant.classList.remove('muted');
                degree.classList.add('muted');
            }
            break;
        }
        default: {
            equation.value += e.textContent;
            break;
        }
    }

}

function findResult() {
    let isNewNum = true;
    let bracketIndexes = [];
    let operatorIndex = 0;
    let i = 0;
    let numbers = [];
    let operators = [];
    let val;
    let isNumeric = /^[-+]?(\d+|\d+\.\d*|\d*\.\d+)$/;
    let equArray = Array.from(equation.value) || [];
    equArray.forEach(char => {
        if (isNumeric.test(char)) {
            if (isNewNum) {
                val = char;
                isNewNum = false;
            } else {
                val += char;
            }
        } else {
            if ((val != undefined && !isNewNum) && char != '.') {
                numbers.push(Number(val));
            }
            console.log(numbers);
            isNewNum = true;
            switch (char) {
                case '+': {
                    operators.push('+');
                    break;
                }
                case '-': {
                    operators.push('-');
                    break;
                }
                case '/': {
                    operators.push('/');
                    break;
                }
                case '*': {
                    operators.push('*');
                    break;
                }
                case '(': {
                    operators.push('(');
                    bracketIndexes.push(operatorIndex);
                    break;
                }
                case ')': {
                    operators.push(')');
                    break;
                }
                case '√': {
                    operators.push('√');
                    break;
                }
                case '.': {
                    if (isNumeric.test(equArray[i - 1]) && i != 0) {
                        val += '.';
                    } else {
                        val = '0.';
                    }
                    isNewNum = false;
                    break;
                }
                case '^': {
                    operators.push('^');
                    break;
                }
                case 'l': {
                    if (equArray[i + 1] == 'o') {
                        operators.push('log');
                    } else if (equArray[i + 1] == 'n') {
                        operators.push('ln');
                    }
                    break;
                }
                case 'c': {
                    if (equArray[i + 2] == 's') {
                        operators.push('cos');
                    } else if (equArray[i + 2] == 't') {
                        operators.push('cot');
                    }
                    break;
                }
                case 's': {
                    if (equArray[i + 1] == 'i') {
                        operators.push('sin');
                    }
                    break;
                }
                case 't': {
                    if (equArray[i + 1] == 'a') {
                        operators.push('tan');
                    }
                    break;
                }
                case 'π': {
                    numbers.push(Math.PI);
                    break;
                }
                default: {
                    break;
                }
            }
            operatorIndex++;
        }
        if (isNumeric.test(Number(equArray[equArray.length - 1])) && i == (equArray.length - 1)) {
            numbers.push(Number(val));
        }
        i++;
    });

    bracketIndexes.reverse().forEach(i => {
        let k = 0;
        let counter = 0;
        let nums = [];
        let ops = [];
        for (let p = 0; p < i; p++) {
            if (operators[p] != '(' && operators[p] != ')') {
                k++;
            }
        }
        for (let j = i + 1; j < operators.length; j++) {
            if (operators[j] != ')') {
                counter++;
            } else {
                break;
            }
        }
        if (counter != 0) {
            for (let m = 0; m < counter; m++) {
                ops.push(operators[i + 1 + m]);
            }
            for (let m = 0; m < counter; m++) {
                nums.push(numbers[k + m]);
            }
            nums.push(numbers[k + counter]);
        } else {
            nums.push(numbers[k]);
        }
        numbers[k] = calculate(ops, nums);

        operators.splice(i, counter + 2);
        numbers.splice(k + 1, counter);

        if (operators[i - 1] == 'log' || operators[i - 1] == 'ln' || operators[i - 1] == '√') {
            numbers[k] = calculate(operators[i - 1], numbers[k])
        }
    });
    if (numbers.length == 1) {
        resultOutput.textContent = numbers[0];
    } else {
        resultOutput.textContent = calculate(operators, numbers);
    }
    equation.value = ''
}

function calculation(operator, number1, number2) {
    let result;
    switch (operator) {
        case '+': {
            result = number1 + number2;
            break;
        }
        case '-': {
            result = number1 - number2;
            break;
        }
        case '/': {
            result = number1 / number2;
            break;
        }
        case '*': {
            result = number1 * number2;
            break;
        }
        case '√': {
            result = Math.sqrt(number1);
            break;
        }
        case '^': {
            result = Math.pow(number1, number2);
            break;
        }
        case 'log': {
            result = Math.log10(number1);
            break;
        }
        case 'ln': {
            result = Math.log(number1);
            break;
        }
        case 'sin': {
            if (isRadiant) {
                result = Math.sin(number1);
            } else {
                result = Math.sin(number1 * Math.PI / 180);
            }
            break;
        }
        case 'cos': {
            if (isRadiant) {
                result = Math.cos(number1);
            } else {
                result = Math.cos(number1 * Math.PI / 180);
            }
            break;
        }
        case 'tan': {
            if (isRadiant) {
                result = Math.tan(number1);
            } else {
                result = Math.tan(number1 * Math.PI / 180);
            }
            break;
        }
        case 'cot': {
            if (isRadiant) {
                result = 1 / Math.tan(number1);
            } else {
                result = 1 / Math.tan(number1 * Math.PI / 180);
            }
            break;
        }
    }
    return result;
}

function calculate(operators, numbers) {
    let result;
    let ops = [];
    let nums = [];
    let j = 0;
    if (operators.length == 0) {
        result = numbers[0];
    } else {
        if (numbers.length == 1) {
            result = calculation(operators[0], numbers[0]);
        } else if (numbers.length == 2) {
            result = calculation(operators[0], numbers[0], numbers[1]);
        } else {
            for (let i = 0; i < operators.length; i++) {
                if (operators[i] == '*') {
                    numbers[j + 1] = calculation('*', numbers[j], numbers[j + 1]);
                    numbers.splice(j, 1);
                } else if (operators[i] == '/') {
                    numbers[j + 1] = calculation('/', numbers[j], numbers[j + 1]);
                    numbers.splice(j, 1);
                } else {
                    ops.push(operators[i]);
                    j++;
                }
            }
            nums.push(numbers[0]);
            for (let i = 0; i < ops.length; i++) {
                if (ops[i] == '+') {
                    nums.push(calculation(ops[i], nums[i], numbers[i + 1]));
                } else if (ops[i] == '-') {
                    nums.push(calculation(ops[i], nums[i], numbers[i + 1]));
                }
            }
            result = nums[nums.length - 1];
        }
    }

    return result;
}
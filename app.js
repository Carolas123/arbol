document.getElementById('generateTreeBtn').addEventListener('click', generateTree);

function generateTree() {
    const equation = document.getElementById('equationInput').value;
    const errorContainer = document.getElementById('error');
    const treeContainer = document.getElementById('treeContainer');

    // Limpiar errores previos y contenedor de árbol
    errorContainer.innerHTML = '';
    treeContainer.innerHTML = '';

    // Validación de ecuación: sin números negativos o incompleta
    if (/[-]\d/.test(equation)) {
        errorContainer.innerHTML = 'Error: No se permiten números negativos.';
        return;
    }

    // Validar si hay errores en paréntesis o ecuaciones incompletas
    try {
        const rpnExpression = infixToPostfix(equation);
        const tree = buildTreeFromRPN(rpnExpression);
        renderTree(tree, treeContainer);
    } catch (error) {
        errorContainer.innerHTML = 'Error: Ecuación incompleta o inválida.';
    }
}

// Función para convertir la ecuación infija a notación postfija (RPN)
function infixToPostfix(equation) {
    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    const output = [];
    const operators = [];
    const tokens = equation.match(/(\d+|\+|\-|\*|\/|\(|\))/g);

    tokens.forEach(token => {
        if (!isNaN(token)) {
            output.push(token); // Si es un número, lo añadimos al resultado
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Descartar el '('
        } else {
            // Es un operador (+, -, *, /)
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    });

    // Añadir operadores restantes
    while (operators.length) {
        output.push(operators.pop());
    }

    return output;
}

// Función para construir un árbol binario a partir de la notación RPN
function buildTreeFromRPN(tokens) {
    const stack = [];

    tokens.forEach(token => {
        if (!isNaN(token)) {
            stack.push({ value: token });
        } else {
            const rightOperand = stack.pop();
            const leftOperand = stack.pop();
            stack.push({
                value: token,
                left: leftOperand,
                right: rightOperand
            });
        }
    });

    return stack[0];
}

// Renderizar el árbol en el DOM
function renderTree(node, container) {
    if (!node) return;

    const treeNode = document.createElement('div');
    treeNode.classList.add('tree-node');
    treeNode.innerText = node.value;
    container.appendChild(treeNode);

    if (node.left || node.right) {
        const childrenContainer = document.createElement('div');
        childrenContainer.classList.add('row-tree');
        container.appendChild(childrenContainer);

        const leftChildContainer = document.createElement('div');
        const rightChildContainer = document.createElement('div');

        renderTree(node.left, leftChildContainer);
        renderTree(node.right, rightChildContainer);

        childrenContainer.appendChild(leftChildContainer);
        childrenContainer.appendChild(rightChildContainer);
    }
}

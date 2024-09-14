document.getElementById('generateTreeBtn').addEventListener('click', generateTree);

function generateTree() {
    const equation = document.getElementById('equationInput').value;
    const errorContainer = document.getElementById('error');
    const treeContainer = document.getElementById('treeContainer');
    const recorridosContainer = document.getElementById('recorridosContainer');
    const preordenElem = document.getElementById('preorden');
    const inordenElem = document.getElementById('inorden');
    const posordenElem = document.getElementById('posorden');

    // Limpiar errores previos y contenedor de árbol
    errorContainer.innerHTML = '';
    treeContainer.innerHTML = '';
    recorridosContainer.style.display = 'none';

    // Validación de ecuación: sin números negativos o incompleta
    if (/[-]\d/.test(equation)) {
        errorContainer.innerHTML = 'Error: No se permiten números negativos.';
        return;
    }

    // Validar paréntesis balanceados
    if (!areParenthesesBalanced(equation)) {
        errorContainer.innerHTML = 'Error: Paréntesis no balanceados.';
        return;
    }

    // Validar si hay errores en paréntesis o ecuaciones incompletas
    try {
        const rpnExpression = infixToPostfix(equation);
        const tree = buildTreeFromRPN(rpnExpression);
        renderTree(tree, treeContainer);

        // Mostrar los recorridos del árbol
        preordenElem.innerText = preorder(tree).join(' ');
        inordenElem.innerText = inorder(tree).join(' ');
        posordenElem.innerText = postorder(tree).join(' ');
        recorridosContainer.style.display = 'block';

    } catch (error) {
        errorContainer.innerHTML = 'Error: Ecuación incompleta o inválida.';
    }
}

function areParenthesesBalanced(equation) {
    const stack = [];
    for (const char of equation) {
        if (char === '(') stack.push(char);
        if (char === ')') {
            if (stack.length === 0) return false;
            stack.pop();
        }
    }
    return stack.length === 0;
}

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
            output.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(') {
                output.push(operators.pop());
            }
            operators.pop(); // Descartar el '('
        } else {
            while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        }
    });

    while (operators.length) {
        output.push(operators.pop());
    }

    return output;
}

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

        // Estilo para los contenedores de hijos
        leftChildContainer.style.flex = "1";
        rightChildContainer.style.flex = "1";

        renderTree(node.left, leftChildContainer);
        renderTree(node.right, rightChildContainer);

        childrenContainer.appendChild(leftChildContainer);
        childrenContainer.appendChild(rightChildContainer);
    }
}

// Funciones para calcular los recorridos
function preorder(node) {
    if (!node) return [];
    return [node.value].concat(preorder(node.left), preorder(node.right));
}

function inorder(node) {
    if (!node) return [];
    return inorder(node.left).concat([node.value], inorder(node.right));
}

function postorder(node) {
    if (!node) return [];
    return postorder(node.left).concat(postorder(node.right), [node.value]);
}

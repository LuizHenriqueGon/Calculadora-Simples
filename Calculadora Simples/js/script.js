// --- 1. SELEÇÃO DOS ELEMENTOS ---
// Seleciona todos os botões que têm o atributo 'data-number'
const numberButtons = document.querySelectorAll('[data-number]');
// Seleciona todos os botões de operação
const operationButtons = document.querySelectorAll('[data-operation]');
// Seleciona os botões específicos
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
// Seleciona os 'divs' do visor
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');


// --- 2. VARIÁVEIS DE ESTADO ---
// Variáveis para guardar o estado atual da calculadora
let currentOperand = '0';
let previousOperand = '';
let operation = undefined; // Guarda qual operação (+, -, etc.) foi escolhida


// --- 3. FUNÇÕES PRINCIPAIS ---

// Função para limpar tudo e resetar para o estado inicial
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
}

// Função para deletar o último dígito
function del() {
    // Converte para string, pega do primeiro caractere (0) até o penúltimo (-1)
    currentOperand = currentOperand.toString().slice(0, -1);
    
    // Se apagar tudo, reseta para '0' em vez de ficar vazio
    if (currentOperand === '') {
        currentOperand = '0';
    }
}

// Função para adicionar um número ao visor
function appendNumber(number) {
    // Impede que vários pontos decimais sejam adicionados
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Se o valor atual for '0' (e não for um '.'), substitui o '0' pelo número
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        // Senão, apenas concatena o novo número
        currentOperand = currentOperand.toString() + number.toString();
    }
}

// Função chamada quando o usuário clica em um operador (+, -, ×, ÷)
function chooseOperation(op) {
    // Se não houver número digitado, não faz nada
    if (currentOperand === '0' || currentOperand === '') return;
    
    // Se já tiver uma operação anterior (ex: 5 + 5), calcula ela primeiro
    if (previousOperand !== '') {
        compute();
    }
    
    // Prepara para a próxima operação
    operation = op; // Guarda a operação
    previousOperand = currentOperand; // Move o número atual para "cima"
    currentOperand = '0'; // Reseta o visor atual
}

// Função que realiza o cálculo
function compute() {
    let computation; // Variável para guardar o resultado
    
    // Converte as strings para números (float = número com decimal)
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // Se qualquer um dos números não for válido, para a função
    if (isNaN(prev) || isNaN(current)) return;
    
    // Usa um 'switch' para decidir qual cálculo fazer
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            // Verifica divisão por zero
            if (current === 0) {
                alert("Não é possível dividir por zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            // Caso nenhuma operação seja válida, não faz nada
            return;
    }
    
    // Após o cálculo, atualiza as variáveis
    currentOperand = computation.toString(); // O resultado vira o operando atual
    operation = undefined; // Limpa a operação
    previousOperand = ''; // Limpa o operando anterior
}

// Função para atualizar o que é mostrado no visor
function updateDisplay() {
    currentOperandTextElement.innerText = currentOperand;
    
    // Se uma operação foi escolhida, mostra no visor de cima (ex: "123 +")
    if (operation != null) {
        previousOperandTextElement.innerText = `${previousOperand} ${operation}`;
    } else {
        // Senão, limpa o visor de cima
        previousOperandTextElement.innerText = '';
    }
}


// --- 4. EVENT LISTENERS (Ouvintes de Eventos) ---

// Adiciona o 'click' para o botão de 'All Clear'
allClearButton.addEventListener('click', () => {
    clear();
    updateDisplay(); // Sempre atualiza o visor após uma ação
});

// Adiciona o 'click' para o botão 'Delete'
deleteButton.addEventListener('click', () => {
    del();
    updateDisplay();
});

// Adiciona o 'click' para o botão '=' (Equals)
equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

// Adiciona o 'click' para TODOS os botões de número de uma vez
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.innerText); // Passa o texto do botão (ex: '7')
        updateDisplay();
    });
});

// Adiciona o 'click' para TODOS os botões de operação
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.innerText); // Passa o texto do botão (ex: '+')
        updateDisplay();
    });
});

// Chama a função uma vez no início para garantir que o visor comece com '0'
updateDisplay();
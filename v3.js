const loginArea = document.getElementById('login-area');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginMsg = document.getElementById('login-msg');
const signupMsg = document.getElementById('signup-msg');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const mainArea = document.querySelector('main');
const leaderboardArea = document.getElementById('leaderboard-area');
const userInfo = document.getElementById('user-info');

let currentUser = null;

// Alternar entre login e signup
signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Função de login
loginBtn.onclick = function() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    const senha = document.getElementById('senha').value;
    
    if (!email || !senha) {
        loginMsg.textContent = "Preencha todos os campos!";
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (!users[email]) {
        loginMsg.textContent = "Email não registado!";
        return;
    }
    
    if (users[email].senha !== senha) {
        loginMsg.textContent = "Senha incorreta!";
        return;
    }
    
    // Login bem sucedido
    localStorage.setItem('currentUser', email);
    currentUser = users[email];
    loginArea.style.display = 'none';
    mainArea.style.display = '';
    leaderboardArea.style.display = '';
    userInfo.textContent = "Bem-vindo, " + currentUser.nome + "!";
    startGame();
    mostrarRanking();
};

// Função de registo
signupBtn.onclick = function() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('new-email').value.trim().toLowerCase();
    const senha = document.getElementById('new-senha').value;
    
    if (!nome || !email || !senha) {
        signupMsg.textContent = "Preencha todos os campos!";
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[email]) {
        signupMsg.textContent = "Email já registado!";
        return;
    }
    
    // Registo bem sucedido
    users[email] = { nome, senha, pontos: 0 };
    localStorage.setItem('users', JSON.stringify(users));
    signupMsg.textContent = "Registo concluído! Faça login.";
    
    // Volta para o formulário de login
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    document.getElementById('email').value = email;
    document.getElementById('senha').value = '';
};

// --- WORDLE GAME ---
const wordBank = [
    "casa", "pato", "fogo", "lago", "vida", "amor", "bola", "luz", "rato", "mesa",
"ruas", "dado", "copo", "piso", "vela", "fada", "gato", "mato", "lata", "roda",
"nojo", "sapo", "urso", "ouro", "rede", "pena", "vaca", "muro", "feno", "raiz",
"rolo", "frio", "calo", "lixo", "faca", "teto", "boca", "joio", "pote", "limo",
"nora", "vara", "boda", "cura", "sala", "cama", "bala", "tela", "dono", "selo",
"riso", "cais", "cabo", "neve", "liso", "nato", "cimo", "fado", "nave", "lodo",
"saco", "pano", "polo", "roxo", "fumo", "cubo", "raio", "neta", "lima", "vila",
"gelo", "tubo", "cava", "sede", "cova", "mira", "tino", "pata", "nabo", "gado",
"voto", "solo", "tapa", "duna", "pira", "roca", "leao", "rabo", "galo", "coro",
"naco", "leme", "tira", "bela", "melo", "bico", "vale", "giro", "alto", "baixo",
"rico", "puro", "fama", "povo", "bolo", "fera", "rosa", "rama", "dona", "lado",
"rado", "pico", "soro", "peao", "nuvem", "dura", "leve", "peso", "roto", "ruim",
"belo", "brio", "fino", "leal", "nulo", "rude", "ouro", "cimo", "coro", "gomo",
"trio", "taco", "toco", "papo", "lodo", "bico", "cera", "seio", "bolo", "roda",
"copo", "lume", "ruga", "fios", "muro", "pega", "tomo", "curo", "remo", "fios",
"cabo", "cais", "nado", "rima", "mala", "sapo", "vela", "pano", "lira", "lodo",
"tora", "muro", "rola", "pena", "ouro", "pina", "ciso", "rato", "lodo", "nevo",
"tomo", "polo", "vila", "rima", "soma", "ruga", "dano", "fome", "curo", "lado",
"muro", "sede", "pena", "nato", "solo", "veio", "nube", "limo", "seco", "toro",
"juro", "liso", "covo", "ruas", "camo", "reto", "cepo", "bolo", "pata", "fare",
"lida", "bico", "saco", "fumo", "rede", "vara", "pino", "rito", "viva", "nave",
"faro", "bolo", "leao", "galo", "sela", "vela", "lago", "rico", "piso", "cova",
"fogo", "pote", "pena", "duna", "belo", "boca", "cama", "rolo", "lima", "voto",
"mato", "solo", "valo", "faca", "mira", "tino", "rosa", "cura", "lado", "tira",
"vale", "cubo", "raio", "feno", "nora", "fado", "neve", "leal", "alto", "baixo",
"roxo", "teto", "pira", "cais", "boda", "rosa", "bolo", "rede", "vido", "melo",
"gato", "bala", "vida", "fumo", "roca", "povo", "peso", "puro", "joio", "cava",
"raiz", "cimo", "tapa", "solo", "fome", "nevo", "gelo", "soro", "sela", "coro",
"vale", "cura", "dono", "remo", "lado", "neve", "vela", "povo", "faro", "fino",
"cava", "casa", "pino", "rito", "vila", "copo", "saco", "riso", "taco", "bolo",
"pena", "nabo", "gado", "fada", "cais", "vida", "ouro", "pato", "rede", "sapo"
];

let secretWord = "";
const maxAttempts = 6;
let currentAttempt = 0;
let gameOver = false;

const board = document.getElementById('game-board');
const form = document.getElementById('guess-form');
const input = document.getElementById('guess-input');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Inicializa o jogo
function startGame() {
    board.innerHTML = "";
    currentAttempt = 0;
    gameOver = false;
    message.textContent = "";
    input.value = "";
    input.disabled = false;
    form.querySelector('button').disabled = false;
    restartBtn.style.display = "none";
    secretWord = wordBank[Math.floor(Math.random() * wordBank.length)];

    // Cria as linhas do tabuleiro
    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function showMessage(msg, color="#ffd700") {
    message.textContent = msg;
    message.style.color = color;
}

function checkGuess(guess) {
    guess = guess.toLowerCase();
    let result = Array(4).fill("absent");
    let secretArr = secretWord.split("");
    let guessArr = guess.split("");

    // Marca as letras corretas
    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === secretArr[i]) {
            result[i] = "correct";
            secretArr[i] = null; // Remove para não contar de novo
            guessArr[i] = null;
        }
    }
    // Marca as letras presentes (mas em posição errada)
    for (let i = 0; i < 4; i++) {
        if (guessArr[i] && secretArr.includes(guessArr[i])) {
            result[i] = "present";
            secretArr[secretArr.indexOf(guessArr[i])] = null;
        }
    }
    return result;
}

// Pontuação: 1 ponto se acertar na última, 2 na penúltima, ..., 5 na primeira, -1 se não acertar
function calcularPontos() {
    if (gameOver && input.disabled) {
        if (message.textContent.includes("Parabéns")) {
            return 7 - currentAttempt; // 6 tentativas: 1 ponto, 1 tentativa: 6 pontos
        } else {
            return -1;
        }
    }
    return 0;
}

// Atualiza pontos do usuário logado
function atualizarPontos(pontosGanhos) {
    const email = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        users[email].pontos += pontosGanhos;
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = users[email];
    }
}

// Mostra ranking
function mostrarRanking() {
    let users = JSON.parse(localStorage.getItem('users') || '{}');
    let lista = Object.values(users).sort((a, b) => b.pontos - a.pontos);
    let ol = document.getElementById('leaderboard');
    ol.innerHTML = '';
    lista.forEach(u => {
        let li = document.createElement('li');
        li.textContent = `${u.nome} - ${u.pontos} pontos`;
        ol.appendChild(li);
    });
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (gameOver) return;

    const guess = input.value.trim().toLowerCase();
    if (guess.length !== 4) {
        showMessage("Digite uma palavra de 4 letras!", "#ff8080");
        return;
    }
    // Aceita qualquer palavra de 4 letras
    const row = board.children[currentAttempt];
    const result = checkGuess(guess);

    for (let i = 0; i < 4; i++) {
        row.children[i].textContent = guess[i] ? guess[i].toUpperCase() : "";
        row.children[i].classList.add(result[i]);
    }

    if (guess === secretWord) {
        showMessage("🎉 Parabéns! Você acertou!", "#7fff7f");
        input.disabled = true;
        form.querySelector('button').disabled = true;
        gameOver = true;
        restartBtn.style.display = "inline-block";
        let pontos = 7 - (currentAttempt + 1);
        atualizarPontos(pontos);
        mostrarRanking();
    } else {
        currentAttempt++;
        input.value = "";
        if (currentAttempt === maxAttempts) {
            showMessage("Fim de jogo! A palavra era: " + secretWord.toUpperCase(), "#ff8080");
            input.disabled = true;
            form.querySelector('button').disabled = true;
            gameOver = true;
            restartBtn.style.display = "inline-block";
            atualizarPontos(-1);
            mostrarRanking();
        } else {
            showMessage("Tente novamente!");
        }
    }
});

restartBtn.addEventListener('click', function() {
    startGame();
    showMessage("");
});
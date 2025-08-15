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

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (gameOver) return;

    const guess = input.value.trim().toLowerCase();
    if (guess.length !== 4) {
        showMessage("Digite uma palavra de 4 letras!", "#ff8080");
        return;
    }

    const row = board.children[currentAttempt];
    const result = checkGuess(guess);

    for (let i = 0; i < 4; i++) {
        row.children[i].textContent = guess[i].toUpperCase();
        row.children[i].classList.add(result[i]);
    }

    if (guess === secretWord) {
        showMessage("🎉 Parabéns! Você acertou!", "#7fff7f");
        input.disabled = true;
        form.querySelector('button').disabled = true;
        gameOver = true;
        restartBtn.style.display = "inline-block";
    } else {
        currentAttempt++;
        input.value = "";
        if (currentAttempt === maxAttempts) {
            showMessage("Fim de jogo! A palavra era: " + secretWord.toUpperCase(), "#ff8080");
            input.disabled = true;
            form.querySelector('button').disabled = true;
            gameOver = true;
            restartBtn.style.display = "inline-block";
        } else {
            showMessage("Tente novamente!");
        }
    }
});

restartBtn.addEventListener('click', startGame);

// Inicia o jogo ao carregar a página
startGame();
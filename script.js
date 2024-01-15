import Enums from "./enums.js";

const container = document.querySelector(".tiles");
let currentSymbol;
let usedUpCells;
let matrix;
let isNehezitesActive;

const GenerateBuff = () => {
	const randomNum = Math.floor(Math.random() * 50) + 1;
	if (randomNum == 1) {
		return Enums.Nehezites;
	} else if (randomNum == 2) {
		return Enums.Konnyites;
	}
	return Enums.SimaMezo;
};

const GenerateMatrix = () => {
	let matrix = [];
	for (let i = 0; i < 25; i++) {
		let row = [];
		for (let j = 0; j < 25; j++) {
			row.push(new Tile(GenerateBuff()));
		}
		matrix.push(row);
	}
	return matrix;
};

const WinCheck = () => {
	// sorok
	for (let i = 0; i < 25; i++) {
		for (let j = 0; j < 25 - 4; j++) {
			if (
				matrix[i][j].tileFill !== "" &&
				matrix[i][j].tileFill === matrix[i][j + 1].tileFill &&
				matrix[i][j].tileFill === matrix[i][j + 2].tileFill &&
				matrix[i][j].tileFill === matrix[i][j + 3].tileFill &&
				matrix[i][j].tileFill === matrix[i][j + 4].tileFill
			) {
				return true;
			}
		}
	}

	// oszlopok
	for (let i = 0; i < 25 - 4; i++) {
		for (let j = 0; j < 25; j++) {
			if (
				matrix[i][j].tileFill !== "" &&
				matrix[i][j].tileFill === matrix[i + 1][j].tileFill &&
				matrix[i][j].tileFill === matrix[i + 2][j].tileFill &&
				matrix[i][j].tileFill === matrix[i + 3][j].tileFill &&
				matrix[i][j].tileFill === matrix[i + 4][j].tileFill
			) {
				return true;
			}
		}
	}

	// bal-jobb átlók
	for (let i = 0; i < 25 - 4; i++) {
		for (let j = 0; j < 25 - 4; j++) {
			if (
				matrix[i][j].tileFill !== "" &&
				matrix[i][j].tileFill === matrix[i + 1][j + 1].tileFill &&
				matrix[i][j].tileFill === matrix[i + 2][j + 2].tileFill &&
				matrix[i][j].tileFill === matrix[i + 3][j + 3].tileFill &&
				matrix[i][j].tileFill === matrix[i + 4][j + 4].tileFill
			) {
				return true;
			}
		}
	}

	// jobb-bal átlók
	for (let i = 0; i < 25 - 4; i++) {
		for (let j = 4; j < 25; j++) {
			if (
				matrix[i][j].tileFill !== "" &&
				matrix[i][j].tileFill === matrix[i + 1][j - 1].tileFill &&
				matrix[i][j].tileFill === matrix[i + 2][j - 2].tileFill &&
				matrix[i][j].tileFill === matrix[i + 3][j - 3].tileFill &&
				matrix[i][j].tileFill === matrix[i + 4][j - 4].tileFill
			) {
				return true;
			}
		}
	}

	return false;
};

const HandleClick = (x, y) => {
	usedUpCells.push(`${x}-${y}`);
	matrix[x][y].tileFill = currentSymbol;
	Render();
	if (matrix[x][y].type == Enums.Konnyites) {
		alert(`${currentSymbol} kétszer léphet, mert felszedett egy könnyítést!`);
	} else if (matrix[x][y].type == Enums.Nehezites) {
		alert(`${currentSymbol} ellenfele kétszer léphet, mert felszedett egy nehezítést!`);
	}
	if (WinCheck()) {
		alert(`${currentSymbol} megnyerte a játékot!`);
		const winnerWins = parseInt(localStorage.getItem(currentSymbol));
		localStorage.setItem(currentSymbol, winnerWins + 1);
		if (confirm("Szeretnétek mégegyet játszani?")) {
			ResetGame();
		}
	} else if (currentSymbol == "x" && matrix[x][y].type == Enums.SimaMezo && !isNehezitesActive) {
		currentSymbol = "o";
	} else if (currentSymbol == "o" && matrix[x][y].type == Enums.SimaMezo && !isNehezitesActive) {
		currentSymbol = "x";
	} else if (currentSymbol == "x" && matrix[x][y].type == Enums.Nehezites) {
		isNehezitesActive = true;
		currentSymbol = "o";
	} else if (currentSymbol == "o" && matrix[x][y].type == Enums.Nehezites) {
		isNehezitesActive = true;
		currentSymbol = "x";
	} else if (isNehezitesActive) {
		isNehezitesActive = false;
	}
};

const Jatekosok = () => {
	let bal = document.querySelector('#bal');
	let jobb = document.querySelector('#jobb');
	let jatekos1 = new Jatekos(document.querySelector("#player1").value);
	let jatekos2 = new Jatekos(document.querySelector("#player2").value);
	bal.querySelector(".nev").innerHTML = jatekos1.nev;
	jobb.querySelector(".nev").innerHTML = jatekos2.nev;

}

const Render = () => {
	container.innerHTML = "";
	for (let i = 0; i < 25; i++) {
		for (let j = 0; j < 25; j++) {
			let div = document.createElement("div");
			let span = document.createElement("span");
			span.innerText = matrix[i][j].tileFill;
			span.classList.add("symbol");
			div.appendChild(span);
			div.classList.add("tile");
			if (!usedUpCells.includes(`${i}-${j}`) && !WinCheck()) {
				div.addEventListener("click", () => {
					HandleClick(i, j);
				});
			}
			container.appendChild(div);
		}
	}
};


class Tile {
	constructor(type) {
		this.type = type; //1 - könnyítés / 0 - sima mező / -1 - nehezítés
		this.tileFill = "";
	}
	Place(symbol) {
		this.tileFill = symbol;
		return this.type;
	}
}

class Jatekos {
	constructor(nev) {
		this.nev = nev;
		this.pontok = 0;
	}
}

const ResetGame = () => {
	matrix = GenerateMatrix();
	usedUpCells = [];
	isNehezitesActive = false;
	currentSymbol = "x";
	Jatekosok();
	Render();
};

ResetGame();

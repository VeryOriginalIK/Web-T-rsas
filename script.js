import Enums from "./enums.js";

const container = document.querySelector(".tiles");
let currentSymbol;
let usedUpCells;
let matrix = [];
let isNehezitesActive;
let nehezites;



const GenerateBuff = (matrix) => {
	let index = 0
	for(let index = 0; index < nehezites*2; index++)
	{
		let oszlop = Math.floor(Math.random() * matrix.length)
		let sor = Math.floor(Math.random() * matrix.length)
		let nehezvagykonnyu = Math.floor(Math.random() * 2 ) + 1
		matrix[oszlop][sor].type = nehezvagykonnyu
		console.log(oszlop + " " + sor)
	}
	return matrix
};

const GenerateMatrix = () => {
	let matrix = [];
	for (let i = 0; i < 25; i++) {
		let row = [];
		for (let j = 0; j < 25; j++) {
			row.push(new Tile(Enums.SimaMezo));
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
		if(currentSymbol == "x"){
			localStorage.setItem("pont1", String((Number(localStorage.getItem("pont1")) + 1))) 
		}

		else
			localStorage.setItem("pont2", (Number(localStorage.getItem("pont2")) + 1)) 
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
	let jatekos1 = new Jatekos(localStorage.getItem("name1"));
	let jatekos2 = new Jatekos(localStorage.getItem("name2"));
	try{
		jatekos1.pontok = Number(localStorage.getItem("pont1"))
		jatekos2.pontok = Number(localStorage.getItem("pont2"))
	}
	catch{}
	bal.querySelector(".nev").innerHTML = jatekos1.nev;
	jobb.querySelector(".nev").innerHTML = jatekos2.nev;
	bal.querySelector(".pontok").innerHTML = jatekos1.pontok;
	jobb.querySelector(".pontok").innerHTML = jatekos2.pontok;
	return [jatekos1,jatekos2]
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

const JatekTer = (jatekos1,jatekos2) =>{
	jatekos1.pontok = localStorage.getItem("pont1")
	jatekos2.pontok = localStorage.getItem("pont2")
}

const FormBeadva = () =>{
	localStorage.setItem("name1",document.querySelector("#player1").value);
	localStorage.setItem("name2",document.querySelector("#player2").value);
	localStorage.setItem("nehezites", document.querySelector("#slider").value)
	localStorage.setItem("pont1",0);
	localStorage.setItem("pont2",0);
	document.querySelector("#form").remove()
	ResetGame();
}

const ResetGame = () => {
	let jatekos1 = Jatekosok()[0];
	let jatekos2 = Jatekosok()[1];
	nehezites = localStorage.getItem("nehezites")
	matrix = GenerateBuff(GenerateMatrix());
	usedUpCells = [];
	isNehezitesActive = false;
	currentSymbol = "x";
	JatekTer(jatekos1,jatekos2)
	Render();
};


export {FormBeadva, ResetGame}
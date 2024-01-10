import Enums from "./enums.js";

const container = document.querySelector(".tiles");

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

const Render = () => {
	for (let i = 0; i < 25; i++) {
		for (let j = 0; j < 25; j++) {
			let div = document.createElement("div");
			let span = document.createElement("span");
			span.innerText = matrix[i][j].tileFill;
			div.appendChild(span);
			div.classList.add("tile");
			container.appendChild(div);
		}
	}
};

class Tile {
	constructor(type) {
		this.type = type; //1 - nehezítés / 0 - könnyítés / 2 - sima mező
		this.tileFill = "";
	}
	Place(symbol) {
		this.tileFill = symbol;
		return this.type;
	}
}

let matrix = GenerateMatrix();
Render();

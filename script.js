import Enums from "./enums.js";

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

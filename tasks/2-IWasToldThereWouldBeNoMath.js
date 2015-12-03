#!/usr/bin/env node
"use strict";

let Promise = require('bluebird'),
	lineReader = require('line-reader'),
	eachLine = Promise.promisify(lineReader.eachLine);

class Box {
	constructor(l, w, h) {
		this.length = parseInt(l);
		this.width  = parseInt(w);
		this.height = parseInt(h);
	}

	getBaseSides() {
		return [
			this.length * this.width,
			this.width * this.height,
			this.height * this.length
		];
	}

	getDimensions() {
		return [
			this.length,
			this.width,
			this.height
		]
	}

	getSmallestSide() {
		return Math.min(...this.getBaseSides());
	}

	getBiggestSide() {
		return Math.max(...this.getBaseSides());
	}

	getTwoSmallestDimensions() {
		return this.getDimensions().sort((x,y) => x > y ? 1 : -1).slice(0,2);
	}
}

class BoxCalculator {
	static calculateVolume(Box) {
		return Box.getDimensions().reduce((x, y) => x * y);
	}

	static calculateArea(Box) {
		return Box.getBaseSides().map((x) => x * 2).reduce((x, y) => x + y);
	}

	static calculateSmallestCircumference(Box) {
		return Box.getTwoSmallestDimensions().map((x) => x * 2).reduce((x, y ) => x + y)
	}

	static calculateWrappingPaperFor(Box) {
		return this.calculateArea(Box) + Box.getSmallestSide();
	}

	static calculateRibbonFor(Box) {
		return this.calculateSmallestCircumference(Box) + this.calculateVolume(Box);
	}
}

let wrappingPaperTotal = 0,
	ribbonTotal = 0;

eachLine(__dirname + '/../sourceFiles/2-IWasToldThereWouldBeNoMath.txt', (line) => {
	let box = new Box(...line.split('x'));
	wrappingPaperTotal += BoxCalculator.calculateWrappingPaperFor(box);
	ribbonTotal += BoxCalculator.calculateRibbonFor(box);
}).then(() => {
	console.log('Square feet of paper needed: ' + wrappingPaperTotal, 'Ribbon needed: ' + ribbonTotal);
}).catch((err) => {
	console.error(err);
});

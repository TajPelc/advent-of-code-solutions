#!/usr/bin/env node
"use strict";

let _ = require('underscore'),
	Promise = require('bluebird'),
	lineReader = require('line-reader'),
	eachLine = Promise.promisify(lineReader.eachLine);

class Box {
	constructor(l, w, h) {
		this.length = l;
		this.width  = w;
		this.height = h;
	}

	getBottomSide() {
		return this.length * this.width;
	}

	getLeftSide() {
		return this.width * this.height;
	}

	getFrontSide() {
		return this.height * this.length;
	}

	getBaseSides() {
		return [
			this.getBottomSide(),
			this.getLeftSide(),
			this.getFrontSide()
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
		return _.min(this.getBaseSides());
	}

	getBiggestSide() {
		return _.max(this.getBaseSides());
	}

	getTwoSmallestDimensions() {
		return this.getDimensions().sort().splice(0,2);
	}
}

class BoxCalculator {
	static calculateVolume(Box) {
		return _.reduce(Box.getDimensions(), (x, y) => x * y);
	}

	static calculateArea(Box) {
		return _(_(Box.getBaseSides()).map((x) => x * 2)).reduce((x, y) => x + y);
	}

	static calculateSmallestCircumference(Box) {
		return _(_(Box.getTwoSmallestDimensions()).map((x) => x * 2)).reduce((x, y ) => x + y)
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

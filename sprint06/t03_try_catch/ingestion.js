const { EatException } = require("./eat-exception");

class Ingestion {
	constructor(meal_type, day_of_diet) {
		this.meal_type = meal_type;
		this.day_of_diet = day_of_diet;
		this.products = [];
	}

	setProduct(product) {
		this.products.push(product);
	}

	getProductInfo(productName) {
		const product = this.products.find(p => p.name === productName);
		return {
			name: product.name,
			kcal: product.kcal_per_portion
		};
	}

	getFromFridge(productName) {
		const product = this.products.find(p => p.name === productName);
		if (product) {
			if (product.kcal_per_portion > 200) {
				throw new EatException(`Too many calories in ${productName} for ${this.meal_type}!`);
			}
			return `You're doing great, ${productName} is good!`;
		} else {
			throw new Error(`Product ${productName} not found in fridge!`);
		}
	}
}

module.exports = { Ingestion };


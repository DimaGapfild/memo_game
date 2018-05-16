let randomNumb = (min,max) => {
	return Math.floor(Math.random() * ( max - min ) + min);
};
module.exports.randM = randomNumb;
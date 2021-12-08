import coffeescript from 'rollup-plugin-coffee-script';

export default {
	input: "source/main.js",
	plugins: [
		coffeescript()
	],
	output: [
		{
			format: "umd",
			name: "CP",
			file: "build/cart-pendulum.js",
			indent: "\t"
		}
	]
};

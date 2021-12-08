import coffeescript from 'rollup-plugin-coffee-script';
import serve from "rollup-plugin-serve";

export default {
	input: "source/main.js",
	plugins: [
		coffeescript(),
		serve({
			open: true,
			contentBase: '.',
			openPage: '/examples',
			host: 'localhost',
			port: 8080
		})
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

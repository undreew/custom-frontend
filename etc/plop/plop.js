module.exports = function (plop) {
	plop.setGenerator("component", {
		description: "Create a React component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Component name?",
			},
		],
		actions: [
			{
				type: "add",
				path: "../../app/components/{{pascalCase name}}/{{pascalCase name}}.js",
				templateFile: "../plop/templates/DefaultReactComponent.js",
			},
			{
				type: "add",
				path: "../../app/components/{{pascalCase name}}/{{pascalCase name}}.css",
				templateFile: "../plop/templates/DefaultReactComponent.css",
			},
		],
	});
};

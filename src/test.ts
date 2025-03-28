import fs from "node:fs";
import Mustache from "mustache";
import { transformTokens } from "./transformTokens";

function preprocess() {
	console.log("preprocess");
	const workingDir = process.cwd();

	const template = fs.readFileSync(`${workingDir}/test_template.css`, {
		encoding: "utf8",
	});
	const tokens = require(`${workingDir}/Design_Tokens_Jung.json`);

	const variables = transformTokens(tokens);

	const rendered = Mustache.render(template, variables);
	//console.log(rendered);

	fs.writeFileSync(`${workingDir}/test.css`, rendered, {
		encoding: "utf8",
	});
}

preprocess();

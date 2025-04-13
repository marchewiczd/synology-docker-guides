import { parse } from "./src/yamlParser.js";
import { generateHtml } from "./src/htmlGenerator.js";

let args = process.argv.slice(2);

if (args.length !== 2) {
    throw new Error('Provide 2 arguments: docker-compose path and HTML file output path.');
}

let descriptors = parse(args[0]);
generateHtml(args[1], descriptors)
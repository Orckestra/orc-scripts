const path = require("path");
const baseDir = path.resolve(process.cwd(), "src");
const content = path.resolve(baseDir, "content");
const icons = path.resolve(content, "icons");
const fs = require("fs");

const iconsSheet = path.resolve(content, "iconsSheet.svg");

const outStream = fs.createWriteStream(iconsSheet);
outStream.addListener("open", () => {
	outStream.write('<svg xmlns="http://www.w3.org/2000/svg">\n');
	// Beware of any files with spaces in filenames, they're bad
	const fileList = fs.readdirSync(icons).filter(file => file.endsWith(".svg"));

	fileList.forEach(fileName => {
		const pathToIcon = path.resolve(icons, fileName);

		const fileNameWithoutExtension = fileName.replace(".svg", "");

		const svgContent = fs.readFileSync(pathToIcon).toString();

		const strippedContent = svgContent
			.replace(/<?(.*)?>/, "")
			.replace(/<!--(.*)-->/, "")
			.replace(/<title>(.*)<\/title>/, "")
			.replace(/<desc>(.*)<\/desc>/, "")
			.replace("svg", "symbol")
			.replace("</svg>", "</symbol>\n")
			.replace("<symbol", `<symbol id="icon-${fileNameWithoutExtension}"`)
			.replace(/<g id="(.*?)"/, "<g")
			.replace(/width(.*)px" /, "")
			.replace(/ version(.*)>/, ">")
			.replace(/ fill="(.*?)"><\/path>/, "></path>")
			.replace(/[!@$^&%*+[\]{}|?\\]/g, "")
			.replace(/^\s*[\r\n]/gm, "");

		outStream.write(strippedContent);
	});
	outStream.end("</svg>");
});

import { ShortDetails } from "./lib/types/short";

export function uploadShort(shortDetails: ShortDetails) {
	console.log(shortDetails.title);
	console.log(shortDetails.description);

	const filePath = `../out/${shortDetails.file}`;

	console.log(filePath);
}
export let isPainting = false;
export let isErasing = false;
export let isTextTool = false;
export let usingCircleBrush = false;

export function resetState() {
	isPainting = false;
	isErasing = false;
	isTextTool = false;
}

export function activateTextTool() {
	resetState();
	isTextTool = true;
	console.log("Text tool activated");
}

export function activateBrushTool() {
	resetState();
	isPainting = true;
	console.log("Brush tool activated");
}

export function activateCircleBrushTool() {
	resetState();
	usingCircleBrush = true;
	console.log("Circle brush tool activated");
}

export function activateEraserTool() {
	resetState();
	isErasing = true;
	isPainting = true; // Eraser tool is a type of brush tool
	console.log("Eraser tool activated");
}

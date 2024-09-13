import { canvas, ctx } from './canvasSetup.js';

let undoStack = [];
let redoStack = [];

// Save canvas state to the undo stack, including text blocks
export function saveState(action = "unspecified", textBlocks = []) {
	const state = {
		image: canvas.toDataURL(), // Save the current canvas image
		textBlocks: JSON.parse(JSON.stringify(textBlocks)) // Save a copy of the current text blocks
	};
	undoStack.push(state);
	if (undoStack.length > 50) undoStack.shift();
	redoStack = []; // Clear redo stack whenever a new action is taken
	console.log(`Saving state for ${action}`);
}

// Restore a canvas state from an image
export function restoreState(state) {
	console.log("Restoring state...");
	const img = new Image();
	img.src = state.image;
	img.onload = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas first
		ctx.globalCompositeOperation = 'source-over';  // Ensure proper restoring
		ctx.drawImage(img, 0, 0);  // Restore the saved canvas state with all previous drawings and text
	};
}

// Undo function
export function undo(textBlocks) {
	if (undoStack.length > 0) {
		const lastState = undoStack.pop();
		redoStack.push({
			image: canvas.toDataURL(),
			textBlocks: JSON.parse(JSON.stringify(textBlocks)) // Save current state to redo stack
		});
		// Restore the previous state
		restoreState(lastState);
		// Update the current textBlocks
		textBlocks.length = 0;
		textBlocks.push(...JSON.parse(JSON.stringify(lastState.textBlocks)));
		console.log("Undo action");
	} else {
		console.log("Undo stack is empty");
	}
}

// Redo function
export function redo(textBlocks) {
	if (redoStack.length > 0) {
		const nextState = redoStack.pop();
		undoStack.push({
			image: canvas.toDataURL(),
			textBlocks: JSON.parse(JSON.stringify(textBlocks)) // Save current state to undo stack
		});
		// Restore the next state
		restoreState(nextState);
		// Update the current textBlocks
		textBlocks.length = 0;
		textBlocks.push(...JSON.parse(JSON.stringify(nextState.textBlocks)));
		console.log("Redo action");
	} else {
		console.log("Redo stack is empty");
	}
}

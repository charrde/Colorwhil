import { enableDrawing } from './drawing.js';
import { activateBrush, activateEraser } from './drawing.js';
import { enableTextTool } from './textTool.js';
import { undo, redo } from './stateManagement.js';
import { repaintCanvas, textBlocks } from './textTool.js';
import { saveState } from './stateManagement.js';
import { canvas, ctx } from './canvasSetup.js';

enableDrawing();

// Event Listeners for Toolbar Buttons
document.querySelector('#brush').addEventListener('click', activateBrush);
document.querySelector('#eraser').addEventListener('click', activateEraser);
document.querySelector('#textTool').addEventListener('click', enableTextTool);

// Undo and Redo Buttons
document.querySelector('#undo').addEventListener('click', () => undo(textBlocks));
document.querySelector('#redo').addEventListener('click', () => redo(textBlocks));


// Clear Canvas Button
document.getElementById('clearCanvas').addEventListener('click', () => {
	saveState("canvas clear", textBlocks);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	textBlocks.length = 0;
	console.log("Canvas cleared");
});

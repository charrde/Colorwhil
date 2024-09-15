import { activateBrush } from './tools/brushTool.js';
import { activateEraser } from './tools/eraserTool.js';
import { activateText } from './tools/textTool.js';
import { activateMouse } from './tools/mouseTool.js';
import { activateClearCanvas } from './tools/clearCanvasTool.js'; // Import the new clearCanvas tool
import { undo, redo } from './canvas/stateManagement.js';
import { objectManager } from './managers/objectManager.js';
import { canvas, ctx } from './canvas/canvasSetup.js';
import { setupColorPresets } from './utilities/color.js';
const { ipcRenderer } = require('electron');

// Initialize color presets
setupColorPresets();

ctx.lineWidth = 10;
ctx.lineCap = 'round';

// Event Listeners for Toolbar Buttons
document.querySelector('#brushTool').addEventListener('click', activateBrush);
document.querySelector('#eraserTool').addEventListener('click', activateEraser);
document.querySelector('#textTool').addEventListener('click', activateText);
document.querySelector('#mouseTool').addEventListener('click', activateMouse);
document.querySelector('#clearCanvas').addEventListener('click', activateClearCanvas); // Attach the clear canvas action

document.getElementById('closeButton').addEventListener('click', () => {
	ipcRenderer.send('app-quit');
});

// Undo and Redo Buttons
document.querySelector('#undo').addEventListener('click', () => undo(objectManager.getObjects()));
document.querySelector('#redo').addEventListener('click', () => redo(objectManager.getObjects()));

// Keybindings for tools and actions
window.addEventListener('keydown', (event) => {
	if (event.ctrlKey && event.shiftKey) {
		if (event.key.toLowerCase() === 'z') {
			redo(objectManager.getObjects());
			event.preventDefault();
		}
	} else if (event.ctrlKey && event.key.toLowerCase() === 'z') {
		undo(objectManager.getObjects());
		event.preventDefault();
	}
});

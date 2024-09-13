import { canvas, ctx } from './canvasSetup.js';
import { saveState } from './stateManagement.js';
import { textBlocks } from './textTool.js';
import { isPainting, isErasing, activateBrushTool, activateEraserTool } from './toolState.js';

let drawing = false;

export function enableDrawing() {
	canvas.addEventListener('mousedown', (e) => {
		if (isPainting) {
            ctx.strokeStyle = document.querySelector('#colorPicker').value;  // Set brush color based on color picker
			saveState("drawing/erasing", textBlocks);
			drawing = true;
			ctx.beginPath();
			ctx.moveTo(e.clientX, e.clientY);
		}
	});

	canvas.addEventListener('mousemove', (e) => {
		if (drawing && isPainting) {
			ctx.lineTo(e.clientX, e.clientY);
			ctx.stroke();  // This applies the current stroke (either drawing or erasing)
		}
	});

	canvas.addEventListener('mouseup', () => {
		drawing = false;
	});
}

// Brush Tool Activation
export function activateBrush() {
	activateBrushTool();  // Activate brush state
	ctx.globalCompositeOperation = 'source-over';  // Set to normal drawing mode
	canvas.style.cursor = 'crosshair';
	ctx.strokeStyle = document.querySelector('#colorPicker').value;  // Set brush color based on color picker
}

// Eraser Tool Activation
export function activateEraser() {
	activateEraserTool();  // Activate eraser state
	ctx.globalCompositeOperation = 'destination-out';  // Set to erase mode (makes strokes transparent)
	canvas.style.cursor = 'crosshair';
	ctx.strokeStyle = 'rgba(0,0,0,1)';  // The color is irrelevant when erasing, but it needs a valid strokeStyle
}

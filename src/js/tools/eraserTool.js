import { canvas, ctx } from '../canvas/canvasSetup.js';
import { toolManager } from '../managers/toolManager.js';
import EraserStroke from '../drawables/EraserStroke.js';
import { objectManager } from '../managers/objectManager.js';
import { eventBus } from '../canvas/eventBus.js';

let erasing = false;
let points = [];

const eraserTool = {
	name: 'eraserTool',
	activate() {
		enableEraser();
		eventBus.subscribe('canvasUpdated', resetErasing);
	},
	deactivate() {
		disableEraser();
		eventBus.unsubscribe('canvasUpdated', resetErasing);
	},
	loadOptions() {
		const optionsContainer = document.getElementById('optionsContainer');
		optionsContainer.innerHTML = '';

		// Eraser Size
		const eraserSizeLabel = document.createElement('label');
		eraserSizeLabel.innerText = 'Eraser Size:';

		const eraserSizeInput = document.createElement('input');
		eraserSizeInput.type = 'range';
		eraserSizeInput.min = '5';
		eraserSizeInput.max = '100';
		eraserSizeInput.value = ctx.lineWidth;

		const eraserSizeCounter = document.createElement('span');
		eraserSizeCounter.innerText = `${ctx.lineWidth}px`;

		eraserSizeInput.addEventListener('input', (e) => {
			const size = e.target.value;
			ctx.lineWidth = size;
			eraserSizeCounter.innerText = `${size}px`;
			updateSliderBackground(eraserSizeInput);
		});

		optionsContainer.appendChild(eraserSizeLabel);
		optionsContainer.appendChild(eraserSizeInput);
		optionsContainer.appendChild(eraserSizeCounter);

		updateSliderBackground(eraserSizeInput);
	}
};

function updateSliderBackground(slider) {
	const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
	slider.style.setProperty('--slider-percentage', `${value}%`);
}

export function activateEraser() {
	toolManager.setActiveTool(eraserTool);
}

function enableEraser() {
	canvas.addEventListener('mousedown', startErasing);
	canvas.addEventListener('mousemove', erase);
	canvas.addEventListener('mouseup', stopErasing);
}

function disableEraser() {
	canvas.removeEventListener('mousedown', startErasing);
	canvas.removeEventListener('mousemove', erase);
	canvas.removeEventListener('mouseup', stopErasing);
}

function resetErasing() {
	erasing = false;
	points = [];
}

function startErasing(e) {
	canvas.style.cursor = 'crosshair';
	if (toolManager.activeTool === eraserTool) {
		eventBus.emit('saveState', { action: 'eraser stroke added', objects: objectManager.getObjects() });
		erasing = true;
		points = [];
		points.push({ x: e.clientX, y: e.clientY });
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
}

function erase(e) {
	if (erasing && toolManager.activeTool === eraserTool) {
		ctx.globalCompositeOperation = 'destination-out';
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		points.push({ x: e.clientX, y: e.clientY });
		ctx.globalCompositeOperation = 'source-over';
	}
}

function stopErasing() {
	if (erasing) {
		erasing = false;
		const newEraserStroke = new EraserStroke(points, ctx.lineWidth);
		objectManager.add(newEraserStroke);
	}
}

import { canvas, ctx } from '../canvas/canvasSetup.js';
import { toolManager } from '../managers/toolManager.js';
import BrushStroke from '../drawables/BrushStroke.js';
import { objectManager } from '../managers/objectManager.js';
import { eventBus } from '../canvas/eventBus.js';

let drawing = false;
let points = [];

const brushTool = {
	name: 'brushTool',
	activate() {
		ctx.globalCompositeOperation = 'source-over';
		canvas.style.cursor = 'crosshair';
		enableBrush();
		eventBus.subscribe('canvasUpdated', resetDrawing);
	},
	deactivate() {
		disableBrush();
		eventBus.unsubscribe('canvasUpdated', resetDrawing);
	},
	loadOptions() {
		const optionsContainer = document.getElementById('optionsContainer');
		optionsContainer.innerHTML = '';  // Clear previous options

		// Brush Size Slider
		const brushSizeLabel = document.createElement('label');
		brushSizeLabel.innerText = 'Brush Size:';

		const brushSizeInput = document.createElement('input');
		brushSizeInput.type = 'range';
		brushSizeInput.min = '1';
		brushSizeInput.max = '100';
		brushSizeInput.value = ctx.lineWidth;
		brushSizeInput.classList.add('styled-slider');

		const brushSizeCounter = document.createElement('span');
		brushSizeCounter.innerText = `${ctx.lineWidth}px`;

		brushSizeInput.addEventListener('input', (e) => {
			const size = e.target.value;
			ctx.lineWidth = size;
			brushSizeCounter.innerText = `${size}px`;
			updateSliderBackground(brushSizeInput);
		});

		// Line Cap (Brush Style) Selector
		const lineCapLabel = document.createElement('label');
		lineCapLabel.innerText = 'Brush Style:';

		const lineCapSelect = document.createElement('select');
		const lineCapOptions = ['butt', 'round', 'square'];
		lineCapOptions.forEach((option) => {
			const opt = document.createElement('option');
			opt.value = option;
			opt.text = option.charAt(0).toUpperCase() + option.slice(1);
			if (ctx.lineCap === option) {
				opt.selected = true;
			}
			lineCapSelect.appendChild(opt);
		});

		lineCapSelect.addEventListener('change', (e) => {
			ctx.lineCap = e.target.value;
		});

		optionsContainer.appendChild(brushSizeLabel);
		optionsContainer.appendChild(brushSizeInput);
		optionsContainer.appendChild(brushSizeCounter);
		optionsContainer.appendChild(document.createElement('br'));
		optionsContainer.appendChild(lineCapLabel);
		optionsContainer.appendChild(lineCapSelect);

		updateSliderBackground(brushSizeInput);
	}
};

function updateSliderBackground(slider) {
	const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
	slider.style.setProperty('--slider-percentage', `${value}%`);
}

export function activateBrush() {
	toolManager.setActiveTool(brushTool);
}

function enableBrush() {
	canvas.addEventListener('mousedown', startDrawing);
	canvas.addEventListener('mousemove', draw);
	canvas.addEventListener('mouseup', stopDrawing);
}

function disableBrush() {
	canvas.removeEventListener('mousedown', startDrawing);
	canvas.removeEventListener('mousemove', draw);
	canvas.removeEventListener('mouseup', stopDrawing);
}

function resetDrawing() {
	drawing = false;
	points = [];
}

function startDrawing(e) {
	if (toolManager.activeTool === brushTool) {
		eventBus.emit('saveState', { action: 'brush stroke added', objects: objectManager.getObjects() });
		drawing = true;
		points = [];
		points.push({ x: e.clientX, y: e.clientY });
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
}

function draw(e) {
	if (drawing && toolManager.activeTool === brushTool) {
		ctx.lineTo(e.clientX, e.clientY);
		ctx.stroke();
		points.push({ x: e.clientX, y: e.clientY });
	}
}

function stopDrawing() {
	if (drawing) {
		drawing = false;
		const newBrushStroke = new BrushStroke(points, ctx.strokeStyle, ctx.lineWidth);
		objectManager.add(newBrushStroke);
	}
}

import { ctx, canvas } from '../canvas/canvasSetup.js';
import { toolManager } from '../managers/toolManager.js';
import TextBlock from '../drawables/TextBlock.js';
import { objectManager } from '../managers/objectManager.js';
import { eventBus } from '../canvas/eventBus.js';

export let textBlocks = [];
let isTextActive = false;
let textPosition = { x: 0, y: 0 };
const liveTextInput = document.getElementById('liveTextInput');


let defaultFontSize = 16;
let defaultFontFamily = 'Arial';

const textTool = {
	name: 'textTool',
	activate() {
		enableTextTool();
		eventBus.subscribe('canvasUpdated', resetTextInput);
	},

	deactivate() {
		disableTextTool();
		eventBus.unsubscribe('canvasUpdated', resetTextInput);
	},

	loadOptions() {
		const optionsContainer = document.getElementById('optionsContainer');
		optionsContainer.innerHTML = '';

		// Font Size Dropdown
		const fontSizeLabel = document.createElement('label');
		fontSizeLabel.innerText = 'Font Size:';

		const fontSizeSelect = document.createElement('select');
		fontSizeSelect.id = 'fontSize';
		const fontSizes = [12, 14, 16, 18, 24, 32, 48, 64];
		fontSizes.forEach((size) => {
			const option = document.createElement('option');
			option.value = size;
			option.innerText = `${size}px`;
			if (size === defaultFontSize) {
				option.selected = true;
			}
			fontSizeSelect.appendChild(option);
		});

		liveTextInput.style.fontSize = `${defaultFontSize}px`;

		fontSizeSelect.addEventListener('change', (e) => {
			const selectedSize = e.target.value;
			liveTextInput.style.fontSize = `${selectedSize}px`;
			defaultFontSize = selectedSize;
		});

		// Font Family Dropdown
		const fontFamilyLabel = document.createElement('label');
		fontFamilyLabel.innerText = 'Font Family:';

		const fontFamilySelect = document.createElement('select');
		fontFamilySelect.id = 'fontFamily';
		const fontFamilies = ['Arial', 'Verdana', 'Courier', 'Times New Roman', 'Georgia', 'Comic Sans MS', 'Impact'];
		fontFamilies.forEach((family) => {
			const option = document.createElement('option');
			option.value = family;
			option.innerText = family;
			if (family === defaultFontFamily) {
				option.selected = true;
			}
			fontFamilySelect.appendChild(option);
		});

		fontFamilySelect.addEventListener('change', (e) => {
			const selectedFontFamily = e.target.value;
			liveTextInput.style.fontFamily = selectedFontFamily;
			defaultFontFamily = selectedFontFamily;
		});

		optionsContainer.appendChild(fontSizeLabel);
		optionsContainer.appendChild(fontSizeSelect);
		optionsContainer.appendChild(document.createElement('br'));
		optionsContainer.appendChild(fontFamilyLabel);
		optionsContainer.appendChild(fontFamilySelect);
	}
};

export function activateText() {
	toolManager.setActiveTool(textTool);
}

function enableTextTool() {
	ctx.globalCompositeOperation = 'source-over';
	canvas.style.cursor = 'text';
	canvas.addEventListener('click', handleCanvasClick);
}

function disableTextTool() {
	liveTextInput.style.display = 'none';
	isTextActive = false;
	canvas.removeEventListener('click', handleCanvasClick);
}

function resetTextInput() {
	isTextActive = false;
	liveTextInput.value = '';
	liveTextInput.style.display = 'none';
}

function handleCanvasClick(e) {
	if (toolManager.activeTool !== textTool) {
		return;
	}

	if (isTextActive && liveTextInput.value.trim() === "") {
		liveTextInput.style.display = 'none';
		isTextActive = false;
	}

	const color = document.getElementById('colorPicker').value;
	const fontSize = document.getElementById('fontSize').value || defaultFontSize;
	const fontFamily = document.getElementById('fontFamily').value || defaultFontFamily;

	textPosition = { x: e.clientX, y: e.clientY };

	liveTextInput.style.left = `${e.clientX}px`;
	liveTextInput.style.top = `${e.clientY}px`;
	liveTextInput.style.display = 'block';
	liveTextInput.value = '';
	liveTextInput.focus();

	liveTextInput.onkeydown = function (event) {
		if (event.key === 'Enter') {
			if (liveTextInput.value.trim() === "") {
				liveTextInput.style.display = 'none';
				isTextActive = false;
				return;
			}
			eventBus.emit('saveState', { action: 'text added', objects: objectManager.getObjects() });

			const newTextBlock = new TextBlock(
				liveTextInput.value,
				textPosition.x,
				textPosition.y,
				fontSize,
				fontFamily,
				color
			);

			objectManager.add(newTextBlock);
			textBlocks.push(newTextBlock);

			liveTextInput.style.display = 'none';
			isTextActive = false;
		}
	};
}

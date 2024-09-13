import { ctx, canvas } from './canvasSetup.js';
import { saveState } from './stateManagement.js';
import { activateTextTool, isTextTool } from './toolState.js';

export let textBlocks = [];
let isTextActive = false;
let textPosition = { x: 0, y: 0 };
const liveTextInput = document.getElementById('liveTextInput');

// Debug log to ensure liveTextInput is found
if (!liveTextInput) {
	console.error('liveTextInput element not found');
} else {
	console.log('liveTextInput element found');
}

// Detect if click is inside an existing text block
function detectTextClick(x, y) {
	return textBlocks.find(block => {
		const textWidth = ctx.measureText(block.text).width;
		const textHeight = block.fontSize;
		return x >= block.x && x <= block.x + textWidth && y >= block.y && y <= block.y + textHeight;
	});
}

// Enable the text tool
export function enableTextTool() {
	activateTextTool();
	canvas.style.cursor = 'text';
    
	canvas.removeEventListener('click', handleCanvasClick);
	canvas.addEventListener('click', handleCanvasClick);
}

canvas.addEventListener('click', (e) => {
    if (isTextActive) {
        console.log("Text input is active. Please press Enter to finalize.");
    }
});

// Handle text placement or editing on canvas click
function handleCanvasClick(e) {
    if (!isTextTool || isTextActive) return;

	// Check if clicking on existing text to edit
	const clickedText = detectTextClick(e.clientX, e.clientY);
	const color = document.getElementById('colorPicker').value;
	liveTextInput.style.color = color;

	if (clickedText) {
		// Edit existing text
		isTextActive = true;
		liveTextInput.value = clickedText.text;
		liveTextInput.style.left = `${clickedText.x}px`;
		liveTextInput.style.top = `${clickedText.y}px`;
		liveTextInput.style.fontSize = `${clickedText.fontSize}px`;
		liveTextInput.style.display = 'block';
		liveTextInput.focus();

		textPosition = { x: clickedText.x, y: clickedText.y };
		document.getElementById('fontSize').value = clickedText.fontSize;

		// Handle Enter key to finalize text edit
		liveTextInput.onkeydown = function (event) {
			if (event.key === 'Enter') {
				saveState("text edit", textBlocks);
				clickedText.text = liveTextInput.value;
				clickedText.fontSize = parseInt(document.getElementById('fontSize').value);
				clickedText.color = color;
				liveTextInput.style.display = 'none';
				isTextActive = false;
				repaintCanvas();  // Repaint canvas with updated text
			}
		};

		// Temporarily disable canvas clicks while editing text
	} else if (!isTextActive) {
		// Add new text block
		isTextActive = true;
		saveState("text placement", textBlocks);
		textPosition = { x: e.clientX, y: e.clientY };

		const fontSize = document.getElementById('fontSize').value;
		liveTextInput.style.fontSize = `${fontSize}px`;
		liveTextInput.style.left = `${e.clientX}px`;
		liveTextInput.style.top = `${e.clientY}px`;
		liveTextInput.style.display = 'block';
		liveTextInput.value = '';  // Clear previous input
		liveTextInput.focus();

		// Handle Enter key to place new text on canvas
		liveTextInput.onkeydown = function (event) {
			if (event.key === 'Enter') {
				const fontSize = parseInt(document.getElementById('fontSize').value);
				ctx.textBaseline = 'top';
				ctx.font = `${fontSize}px Arial`;
				ctx.fillStyle = color;
				const adjustedYPosition = textPosition.y + 0.2 * fontSize;
				ctx.fillText(liveTextInput.value, textPosition.x, adjustedYPosition);

				// Store the new text block
				textBlocks.push({
					text: liveTextInput.value,
					fontSize,
					color,
					x: textPosition.x,
					y: textPosition.y
				});
				liveTextInput.style.display = 'none';
				isTextActive = false;
				console.log("New text added:", liveTextInput.value);
				saveState("text placement", textBlocks);  // Save the state after adding the text
			}
		};
	};
}

// Repaint canvas to show all text blocks
export function repaintCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
	textBlocks.forEach(block => {
		ctx.font = `${block.fontSize}px Arial`;
		ctx.fillStyle = block.color;
		ctx.textBaseline = 'top';
		const adjustedYPosition = block.y + 0.2 * block.fontSize;
		ctx.fillText(block.text, block.x, adjustedYPosition);  // Repaint all text blocks
	});
}

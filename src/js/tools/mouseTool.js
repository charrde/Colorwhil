import { ctx, canvas } from '../canvas/canvasSetup.js';
import { toolManager } from '../managers/toolManager.js';
import { objectManager } from '../managers/objectManager.js';
import { eventBus } from '../canvas/eventBus.js';

let isDragging = false;
let selectedObject = null;
let dragOffset = { x: 0, y: 0 };
let deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.style.position = 'absolute';
deleteButton.style.display = 'none';
document.body.appendChild(deleteButton);

const mouseTool = {
	name: 'mouseTool',
	activate() {
		enableMouseTool();
		deleteButton.addEventListener('click', handleDelete);
		eventBus.subscribe('canvasUpdated', handleCanvasUpdated); // Listen for canvas updates
	},

	deactivate() {
		disableMouseTool();
		deleteButton.style.display = 'none';
		deleteButton.removeEventListener('click', handleDelete);
		eventBus.unsubscribe('canvasUpdated', handleCanvasUpdated);
	},

	loadOptions() {
	}
};

function enableMouseTool() {
	canvas.style.cursor = 'default';
	canvas.addEventListener('mousedown', startDragging);
	canvas.addEventListener('mousemove', dragObject);
	canvas.addEventListener('mouseup', stopDragging);
	canvas.addEventListener('click', handleClick);
}

function disableMouseTool() {
	canvas.removeEventListener('mousedown', startDragging);
	canvas.removeEventListener('mousemove', dragObject);
	canvas.removeEventListener('mouseup', stopDragging);
	canvas.removeEventListener('click', handleClick);
}

function handleClick(e) {
	const clickedObject = objectManager.getObjects().find(obj => obj.isPointInObject(e.clientX, e.clientY, ctx));

	if (clickedObject && !isDragging) {
		selectedObject = clickedObject;
		showDeleteButton(selectedObject);
		showSelectionBorder();
	} else if (!isDragging) {
		deselectObject();
	}
}

function startDragging(e) {
	selectedObject = objectManager.getObjects().find(obj => obj.isPointInObject(e.clientX, e.clientY, ctx));
	if (selectedObject) {
		isDragging = true;
		window.selectedObject = selectedObject;

		// Emit state before movement for undo
		eventBus.emit('saveState', { action: 'object pre-move', objects: objectManager.getObjects() });

		if (selectedObject.points) {
			dragOffset = selectedObject.points.map(point => ({
				x: e.clientX - point.x,
				y: e.clientY - point.y
			}));
		} else {
			dragOffset.x = e.clientX - selectedObject.x;
			dragOffset.y = e.clientY - selectedObject.y;
		}

		deleteButton.style.display = 'none';
	}
}

function dragObject(e) {
	if (isDragging && selectedObject) {
		if (selectedObject.points) {
			selectedObject.points = selectedObject.points.map((point, index) => ({
				x: e.clientX - dragOffset[index].x,
				y: e.clientY - dragOffset[index].y
			}));
		} else {
			selectedObject.x = e.clientX - dragOffset.x;
			selectedObject.y = e.clientY - dragOffset.y;
		}

		objectManager.repaint();
		showSelectionBorder();  // Draw border when dragging
	}
}

function stopDragging() {
	if (isDragging) {
		isDragging = false;

		objectManager.repaint();
		showDeleteButton(selectedObject);
		showSelectionBorder();
	}
}

function deselectObject() {
	selectedObject = null;
	window.selectedObject = null;
	objectManager.repaint();
	deleteButton.style.display = 'none';
}

function showDeleteButton(object) {
	if (object.text) {
		deleteButton.style.left = `${object.x + ctx.measureText(object.text).width}px`;
		deleteButton.style.top = `${object.y - 30}px`;
	} else if (object.points) {
		const boundingBox = getBoundingBox(object.points);
		deleteButton.style.left = `${boundingBox.right}px`;
		deleteButton.style.top = `${boundingBox.top - 30}px`;
	}
	deleteButton.style.display = 'block';
}

function showSelectionBorder() {
	if (selectedObject) {
		ctx.save();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);

		if (selectedObject.points) {
			const boundingBox = getBoundingBox(selectedObject.points);
			ctx.strokeRect(boundingBox.left, boundingBox.top, boundingBox.right - boundingBox.left, boundingBox.bottom - boundingBox.top);
		} else {
			ctx.strokeRect(selectedObject.x, selectedObject.y, ctx.measureText(selectedObject.text).width, selectedObject.fontSize);
		}
		ctx.restore();
	}
}

function getBoundingBox(points) {
	const xs = points.map(point => point.x);
	const ys = points.map(point => point.y);
	return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}

function handleDelete() {
	if (selectedObject) {
		eventBus.emit('saveState', { action: 'object deleted', objects: objectManager.getObjects() });
		objectManager.remove(selectedObject);
		deselectObject();
	}
}

// Handle canvas updates (triggered on undo/redo)
function handleCanvasUpdated() {
	if (selectedObject) {
		// Re-select the updated object after undo/redo
		const updatedObject = objectManager.getObjects().find(obj => obj.id === selectedObject.id);
		if (updatedObject) {
			selectedObject = updatedObject; // Update reference to the selected object
			showDeleteButton(selectedObject);
			showSelectionBorder();
		} else {
			deselectObject(); // If the object no longer exists, deselect it
		}
	}
}

export function activateMouse() {
	toolManager.setActiveTool(mouseTool);
}

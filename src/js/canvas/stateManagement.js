import { objectManager } from '../managers/objectManager.js';
import { eventBus } from './eventBus.js';
import TextBlock from '../drawables/TextBlock.js';
import BrushStroke from '../drawables/BrushStroke.js';
import EraserStroke from '../drawables/EraserStroke.js';

let undoStack = [];
let redoStack = [];

eventBus.subscribe('saveState', (data) => {
	saveState(data.action, data.objects);
});

function saveState(action = "unspecified", objects = []) {
	const state = {
		objects: objects.map(obj => {
			if (obj instanceof TextBlock) {
				return {
					type: 'TextBlock',
					data: {
						text: obj.text,
						x: obj.x,
						y: obj.y,
						fontSize: obj.fontSize,
						fontFamily: obj.fontFamily,
						color: obj.color
					}
				};
			} else if (obj instanceof BrushStroke) {
				return {
					type: 'BrushStroke',
					data: {
						points: obj.points,
						color: obj.color,
						lineWidth: obj.lineWidth
					}
				};
			} else if (obj instanceof EraserStroke) {
				return {
					type: 'EraserStroke',
					data: {
						points: obj.points,
						lineWidth: obj.lineWidth
					}
				};
			}
			return null;
		}).filter(Boolean)
	};

	undoStack.push(state);
	if (undoStack.length > 50) undoStack.shift(); // Limit stack size
	redoStack = []; // Clear redo stack on new action
	console.log(`State saved for ${action}`);
}

export function restoreState(state) {
	console.log("Restoring state...");

	objectManager.clearObjects();
	state.objects.forEach((objState) => {
		if (objState.type === 'TextBlock') {
			const obj = new TextBlock(
				objState.data.text,
				objState.data.x,
				objState.data.y,
				objState.data.fontSize,
				objState.data.fontFamily,
				objState.data.color
			);
			objectManager.add(obj);
		} else if (objState.type === 'BrushStroke') {
			const obj = new BrushStroke(
				objState.data.points,
				objState.data.color,
				objState.data.lineWidth
			);
			objectManager.add(obj);
		} else if (objState.type === 'EraserStroke') {
			const obj = new EraserStroke(
				objState.data.points,
				objState.data.lineWidth
			);
			objectManager.add(obj);
		}
	});
	objectManager.repaint();

	// Notify tools that the canvas has been updated
	eventBus.emit('canvasUpdated', { action: 'restored' });
}

export function undo(objects) {
	if (undoStack.length > 0) {
		const lastState = undoStack.pop();
		redoStack.push({
			objects: objects.map(obj => {
				if (obj instanceof TextBlock) {
					return {
						type: 'TextBlock',
						data: {
							text: obj.text,
							x: obj.x,
							y: obj.y,
							fontSize: obj.fontSize,
							fontFamily: obj.fontFamily,
							color: obj.color
						}
					};
				} else if (obj instanceof BrushStroke) {
					return {
						type: 'BrushStroke',
						data: {
							points: obj.points,
							color: obj.color,
							lineWidth: obj.lineWidth
						}
					};
				} else if (obj instanceof EraserStroke) {
					return {
						type: 'EraserStroke',
						data: {
							points: obj.points,
							lineWidth: obj.lineWidth
						}
					};
				}
				return null;
			}).filter(Boolean)
		});
		restoreState(lastState); // Restore the previous state
		console.log("Undo action");
	}
}

export function redo(objects) {
	if (redoStack.length > 0) {
		const nextState = redoStack.pop();
		undoStack.push({
			objects: objects.map(obj => {
				if (obj instanceof TextBlock) {
					return {
						type: 'TextBlock',
						data: {
							text: obj.text,
							x: obj.x,
							y: obj.y,
							fontSize: obj.fontSize,
							fontFamily: obj.fontFamily,
							color: obj.color
						}
					};
				} else if (obj instanceof BrushStroke) {
					return {
						type: 'BrushStroke',
						data: {
							points: obj.points,
							color: obj.color,
							lineWidth: obj.lineWidth
						}
					};
				} else if (obj instanceof EraserStroke) {
					return {
						type: 'EraserStroke',
						data: {
							points: obj.points,
							lineWidth: obj.lineWidth
						}
					};
				}
				return null;
			}).filter(Boolean)
		});
		restoreState(nextState);
		console.log("Redo action");
	}
}

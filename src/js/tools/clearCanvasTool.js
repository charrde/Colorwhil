import { canvas, ctx } from '../canvas/canvasSetup.js';
import { objectManager } from '../managers/objectManager.js';
import { eventBus } from '../canvas/eventBus.js';


const clearCanvasTool = {
	name: 'clearCanvasTool',
	activate() {
		eventBus.emit('saveState', { action: 'canvas clear', objects: objectManager.getObjects() });

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		objectManager.clearObjects();
		console.log("Canvas cleared");
	}
};

export function activateClearCanvas() {
	clearCanvasTool.activate();
}

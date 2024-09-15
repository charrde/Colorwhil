import Drawable from '../drawables/Drawable.js';
import { ctx } from '../canvas/canvasSetup.js';

class ObjectManager {
	constructor() {
		this.objects = [];
	}

	add(drawable) {
		if (drawable instanceof Drawable) {
			this.objects.push(drawable);
			this.repaint();
		} else {
			console.error("Tried to add a non-drawable object:", drawable);
		}
	}

	remove(drawable) {
		this.objects = this.objects.filter(obj => obj !== drawable);
		this.repaint();
	}

	getObjects() {
		return this.objects;
	}

	clearObjects() {
		this.objects.length = 0;
		this.repaint();
	}

	repaint() {
		// Clear the canvas and draw all objects
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		this.objects.forEach(object => {
			if (object.draw) {
				object.draw(ctx);
			} else {
				console.error("Object does not have a draw method:", object);
			}
		});
	}
}

export const objectManager = new ObjectManager();

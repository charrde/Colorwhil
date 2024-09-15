import Drawable from './Drawable.js';

class EraserStroke extends Drawable {
	constructor(points, lineWidth) {
		super();
		this.points = points;
		this.lineWidth = lineWidth;
	}

	draw(ctx) {
		ctx.globalCompositeOperation = 'destination-out'; // Set to erasing mode
		ctx.lineWidth = this.lineWidth;
		ctx.beginPath();
		for (let i = 0; i < this.points.length - 1; i++) {
			const currentPoint = this.points[i];
			const nextPoint = this.points[i + 1];
			ctx.moveTo(currentPoint.x, currentPoint.y);
			ctx.lineTo(nextPoint.x, nextPoint.y);
		}
		ctx.stroke();
		ctx.closePath();
		ctx.globalCompositeOperation = 'source-over'; // Reset back to normal mode
	}
}

export default EraserStroke;

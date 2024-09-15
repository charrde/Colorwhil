import Drawable from './Drawable.js';

class BrushStroke extends Drawable {
	constructor(points, color, lineWidth) {
		super();
		this.points = points;
		this.color = color;
		this.lineWidth = lineWidth;
	}

	draw(ctx) {
		ctx.strokeStyle = this.color;
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
	}

	isPointInObject(x, y) {
		const hitRadius = this.lineWidth / 2;
		return this.points.some(point => {
			const dx = point.x - x;
			const dy = point.y - y;
			return Math.sqrt(dx * dx + dy * dy) <= hitRadius;
		});
	}

	// Implement move for BrushStroke (shift all points)
	move(dx, dy) {
		this.points = this.points.map(point => ({
			x: point.x + dx,
			y: point.y + dy
		}));
	}
}

export default BrushStroke;

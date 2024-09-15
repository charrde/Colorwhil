import Drawable from './Drawable.js';

class TextBlock extends Drawable {
	constructor(text, x, y, fontSize, fontFamily, color) {
		super();
		this.text = text;
		this.x = x;
		this.y = y;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		this.color = color;
	}

	draw(ctx) {
		ctx.font = `${this.fontSize}px ${this.fontFamily}`;
		ctx.fillStyle = this.color;
		ctx.textBaseline = 'top';
		ctx.fillText(this.text, this.x, this.y);
	}
	
	isPointInObject(x, y, ctx) {
		const textWidth = ctx.measureText(this.text).width;
		const textHeight = this.fontSize;
		return x >= this.x && x <= this.x + textWidth && y >= this.y && y <= this.y + textHeight;
	}

	move(dx, dy) {
		this.x += dx;
		this.y += dy;
	}
}

export default TextBlock;

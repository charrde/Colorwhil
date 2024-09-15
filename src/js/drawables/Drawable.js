class Drawable {
	// Base draw method to be implemented by subclasses
	draw(ctx) {
		throw new Error("Method 'draw' must be implemented.");
	}

	// Base isPointInObject method to be implemented by subclasses
	isPointInObject(x, y) {
		throw new Error("Method 'isPointInObject' must be implemented.");
	}

	// Base move method; should be overridden by subclasses if needed
	move(dx, dy) {
		throw new Error("Method 'move' must be implemented.");
	}
}

export default Drawable;

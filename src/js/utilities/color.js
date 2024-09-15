function setBrushColor(color) {
	const colorPicker = document.getElementById('colorPicker');
	const ctx = document.getElementById('drawCanvas').getContext('2d');
	ctx.strokeStyle = color;  // Update the canvas context's brush color
	colorPicker.value = color;  // Update the custom color picker to match the preset
}

// Function to create color preset circles
export function setupColorPresets() {
	document.querySelectorAll('.color-circle').forEach(circle => {
		circle.addEventListener('click', function () {
			const selectedColor = this.getAttribute('data-color');
			setBrushColor(selectedColor);
		});
	});

	// Add event listener for custom color picker
	document.getElementById('colorPicker').addEventListener('input', function () {
		setBrushColor(this.value);
	});
}

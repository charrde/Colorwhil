export const canvas = document.getElementById('drawCanvas');
export const ctx = canvas.getContext('2d');

// Set default brush size and color
ctx.lineWidth = 5;
ctx.strokeStyle = '#000000';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

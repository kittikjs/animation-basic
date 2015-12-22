"use strict";

const cursor = require('kittik-cursor').Cursor.create().resetTTY();
const Rectangle = require('kittik-shape-rectangle').default;
const Animation = require('../lib/Basic').default;
const shapes = [
  Rectangle.create({background: cursor.COLORS.WHITE, x: 10, y: 20, text: 'Shape 1'}),
  Rectangle.create({background: cursor.COLORS.DARK_BLUE, x: 60, y: 10, text: 'Shape 2'}),
  Rectangle.create({background: cursor.COLORS.LIGHT_SKY_BLUE_1, x: 100, y: 30, text: 'Shape 3'}),
  Rectangle.create({background: cursor.COLORS.RED, x: 1, y: 1, text: 'Shape 4'})
];

// Your animation
class Slide extends Animation {
  animate(shape, cursor) {
    return Promise.all([
      this.animateProperty({shape: shape, easing: 'outBounce', property: 'x', endValue: Math.random() * 100 + 1}),
      this.animateProperty({shape: shape, easing: 'outBounce', property: 'y', endValue: Math.random() * 30 + 1}),
      this.animateProperty({shape: shape, property: 'background', endValue: Math.random() * 255})
    ]).then(() => Promise.resolve(shape));
  }
}

// It's implemented in Kittik engine, so you need just to implement child class from Animation as above
let renderedShapes = [];
let currentShapeIndex = 0;

const onTick = (shape, property, value) => {
  renderedShapes.forEach(shape => shape.render(cursor));
  shape.render(cursor);
  cursor.flush().eraseScreen();
};

const nextShape = shape => {
  renderedShapes.push(shape);
  currentShapeIndex++;
  playAnimation(currentShapeIndex);
};

const playAnimation = index => {
  animation.animate(shapes[index], cursor).then(nextShape);
};

const animation = new Slide({duration: 2000}).whenTicks(onTick);
playAnimation(currentShapeIndex);

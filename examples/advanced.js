"use strict";

const cursor = require('kittik-cursor').default.create().resetTTY();
const Rectangle = require('kittik-shape-rectangle').default;
const Animation = require('../lib/Animation').default;
const shapes = [
  Rectangle.create({background: 'dark_blue', x: 'left', y: 'top', text: 'Shape 1'}),
  Rectangle.create({background: 'dark_blue', x: 'center', y: 'top', text: 'Shape 2'}),
  Rectangle.create({background: 'dark_blue', x: 'right', y: 'top', text: 'Shape 3'}),
  Rectangle.create({background: 'navy_blue', x: 'left', y: 'middle', text: 'Shape 4'}),
  Rectangle.create({background: 'navy_blue', x: 'center', y: 'middle', text: 'Shape 5'}),
  Rectangle.create({background: 'navy_blue', x: 'right', y: 'middle', text: 'Shape 6'}),
  Rectangle.create({background: 'yellow_1', x: 'left', y: 'bottom', text: 'Shape 7'}),
  Rectangle.create({background: 'yellow_1', x: 'center', y: 'bottom', text: 'Shape 8'}),
  Rectangle.create({background: 'yellow_1', x: 'right', y: 'bottom', text: 'Shape 9'})
];

// Your animation
class Slide extends Animation {
  animate(shape, cursor) {
    return Promise.all([
      this.animateProperty({shape: shape, property: 'x', startValue: Math.random() * 100 + 1, endValue: shape.getX()}),
      this.animateProperty({shape: shape, property: 'y', startValue: Math.random() * 30 + 1, endValue: shape.getY()})
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

const animation = new Slide({duration: 2000}).on('tick', onTick);
playAnimation(currentShapeIndex);

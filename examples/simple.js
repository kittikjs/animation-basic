"use strict";

const cursor = require('kittik-cursor').Cursor.create().resetTTY();
const shape = require('kittik-shape-rectangle').default.create({background: 'white', x: 'center'});
const Animation = require('../lib/Animation').default;

class Slide extends Animation {
  animate(shape, cursor) {
    return this.animateProperty({shape: shape, property: 'x', startValue: 1, endValue: shape.getX()});
  }
}

new Slide({duration: 2000}).on('tick', shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape);

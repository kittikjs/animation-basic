"use strict";

const cursor = require('kittik-cursor').Cursor.create().resetTTY();
const shape = require('kittik-shape-rectangle').default.create({background: cursor.COLORS.WHITE});
const Animation = require('../lib/Basic').default;

class Slide extends Animation {
  animate(shape, cursor) {
    return this.animateProperty({shape: shape, property: 'x', endValue: 50});
  }
}

new Slide({duration: 2000}).whenTicks(shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape);

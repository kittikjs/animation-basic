"use strict";

const cursor = require('kittik-cursor').Cursor.create().resetTTY();
const shape = require('kittik-shape-rectangle').default.create({background: cursor.COLORS.GREEN});
const Animation = require('../lib/Basic').default;

class Slide extends Animation {
  animate(shape, cursor) {
    this.setDuration(4000);
    this.animateProperty({shape: shape, property: 'x', endValue: 50});
    return this;
  }
}

new Slide().animate(shape, cursor).on('tick', () => {
  shape.render(cursor);
  cursor.flush().eraseScreen();
});


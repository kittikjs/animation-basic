"use strict";

const cursor = require('kittik-cursor').create().resetTTY().hideCursor();
const shape = require('kittik-shape-rectangle').create({background: 'white', x: 'center'});
const Animation = require('../lib/Animation');

class Slide extends Animation {
  animate(shape, cursor) {
    return new Promise(resolve => {
      this
        .animateProperty({shape: shape, property: 'x', startValue: -shape.getWidth(), endValue: shape.getX()})
        .then(shape => resolve(shape));
    });
  }
}

new Slide({duration: 2000}).on('tick', shape => shape.render(cursor) && cursor.flush().eraseScreen()).animate(shape).then(() => cursor.showCursor().flush());

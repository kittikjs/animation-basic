"use strict";

const cursor = require('kittik-cursor').create().reset().hideCursor();
const shape = require('kittik-shape-rectangle').create(cursor, {background: 'white', x: 'center'});
const Animation = require('../lib/Animation');

class Slide extends Animation {
  animate(shape) {
    return new Promise(resolve => {
      this
        .animateProperty({shape: shape, property: 'x', startValue: -shape.getWidth(), endValue: shape.getX()})
        .then(shape => resolve(shape));
    });
  }
}

new Slide({duration: 2000}).on('tick', shape => shape.render() && cursor.flush().eraseScreen()).animate(shape).then(() => cursor.showCursor().flush());

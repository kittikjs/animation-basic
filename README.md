# kittik-animation-basic

![Build Status](https://img.shields.io/travis/kittikjs/animation-basic.svg)
![Coverage](https://img.shields.io/coveralls/kittikjs/animation-basic.svg)

![Downloads](https://img.shields.io/npm/dm/kittik-animation-basic.svg)
![Downloads](https://img.shields.io/npm/dt/kittik-animation-basic.svg)
![npm version](https://img.shields.io/npm/v/kittik-animation-basic.svg)
![License](https://img.shields.io/npm/l/kittik-animation-basic.svg)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![dependencies](https://img.shields.io/david/kittikjs/animation-basic.svg)
![dev dependencies](https://img.shields.io/david/dev/kittikjs/animation-basic.svg)

Basic animation which is needed for creating other animation

## Getting Started

Install it via npm:

```shell
npm install kittik-animation-basic
```

Extend and export your animation:

```javascript
import Animation from 'kittik-animation-basic';

export default class Slide extends Animation {
  animate(shape) {
    // shape is an instance of the Shape that need to animate
    // cursor is a Cursor instance that you can use for your own purposes
    // animate() method must return Promise that fullfils when animation is done
    return new Promise(resolve => {
      Promise.all([
        this.animateProperty({shape: shape, property: 'x', startValue: 1, endValue: shape.getX()});
        this.animateProperty({shape: shape, property: 'y', startValue: 1, endValue: shape.getY()});
      ]).then(() => resolve(shape));
    });
  }
}
```

## License

The MIT License (MIT)

Copyright (c) 2015-2016 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

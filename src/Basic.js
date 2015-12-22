import { EASING } from './easing';

/**
 * Base class for creating other animations.
 * Each custom animation must extends from this class.
 *
 * @since 1.0.0
 */
export default class Basic {
  /**
   * Creates animation class that has {@link animate} method for animating properties in the shape.
   *
   * @constructor
   * @param {Object} [options]
   * @param {Number} [options.duration=1000]
   * @param {String} [options.easing='outQuad']
   */
  constructor(options = {}) {
    this._options = options;
    this._onTickCallbacks = [];

    this.setDuration(options.duration);
    this.setEasing(options.easing);
  }

  /**
   * Get option value.
   *
   * @param {String} path Path can be set with dot-notation
   * @returns {*}
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], this._options);
  }

  /**
   * Set new option value.
   *
   * @param {String} path Path can be set with dot-notation
   * @param {*} value Value that need to be written to the options object
   * @returns {Basic}
   */
  set(path, value) {
    let obj = this._options;
    let tags = path.split('.');
    let len = tags.length - 1;

    for (let i = 0; i < len; i++) {
      if (typeof obj[tags[i]] === 'undefined') obj[tags[i]] = {};
      obj = obj[tags[i]];
    }

    obj[tags[len]] = value;

    return this;
  }

  /**
   * Get animation duration in ms.
   *
   * @returns {Number}
   */
  getDuration() {
    return this.get('duration');
  }

  /**
   * Set new animation duration in ms.
   *
   * @param {Number} [duration=1000]
   * @returns {Basic}
   */
  setDuration(duration = 1000) {
    return this.set('duration', duration);
  }

  /**
   * Get easing name.
   *
   * @returns {String}
   */
  getEasing() {
    return this.get('easing');
  }

  /**
   * Set new easing for animation.
   *
   * @param {String} [easing='outQuad']
   * @returns {Basic}
   */
  setEasing(easing = 'outQuad') {
    if (typeof EASING[easing] !== 'function') throw new Error(`Unknown easing: ${easing}`);
    return this.set('easing', easing);
  }

  /**
   * Makes delay.
   *
   * @param {Number} ms
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calls each time when animation ticked.
   *
   * @param {Basic|Function} shape
   * @param {String} property
   * @param {Number} value
   * @returns {Basic}
   */
  onTick(shape, property, value) {
    if (typeof shape === 'function') this._onTickCallbacks.push(shape);

    if (typeof shape === 'object') {
      shape.set(property, value);
      this._onTickCallbacks.forEach(fn => fn(shape, property, value))
    }

    return this;
  }

  /**
   * Method accepts shape and cursor instances.
   *
   * @abstract
   * @param {Basic} shape Shape instance that need to be animated
   * @param {Cursor} cursor Cursor instance that you can use for rendering other stuff
   */
  animate(shape, cursor) {
    return Promise.reject(new Error('You must implement animate() method'));
  }

  /**
   * Helper method that animates property in object.
   * On each animation tick it calls {@link onTick} method with shape, property and newValue arguments.
   *
   * @param {Object} options
   * @param {Object} options.shape Shape where property is need to be animated
   * @param {String} options.property Property name that need to be animated
   * @param {Number} [options.startValue] Start value for animation, by default it takes from shape[property]
   * @param {Number} [options.endValue] End value for animation, by default it takes from shape[property]
   * @param {Number} [options.byValue] Step value for easing
   * @param {Number} [options.duration] Duration of the animation in ms, by default it takes from Animation options
   * @param {String} [options.easing] Easing that need to apply to animation, by default it takes from Animation options
   * @returns {Promise} Returns Promise, that fulfills with shape instance that has been animated
   */
  animateProperty(options) {
    const shape = options.shape;
    const property = options.property;
    const startValue = options.startValue || shape.get(property);
    const endValue = options.endValue || shape.get(property);
    const byValue = options.byValue || (endValue - startValue);
    const duration = options.duration || this.getDuration();
    const easing = options.easing || this.getEasing();
    const delay = duration / (endValue - startValue);
    const start = Date.now();
    const end = start + duration;
    const tick = resolve => {
      let currentTime = Date.now();

      if (currentTime > end) {
        resolve(shape);
      } else {
        this.onTick(shape, property, Math.round(EASING[easing](currentTime - start, startValue, byValue, duration)));
        this.delay(delay).then(() => tick(resolve));
      }
    };

    return new Promise(resolve => tick(resolve));
  }
}

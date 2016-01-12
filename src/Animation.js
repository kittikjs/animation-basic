import EventEmitter from 'events';
import { EASING } from './easing';

/**
 * Base class for creating other animations.
 * Each custom animation must extends from this class.
 *
 * @since 1.0.0
 */
export default class Animation extends EventEmitter {
  /**
   * Creates animation class that has {@link animate} method for animating properties in the shape.
   *
   * @constructor
   * @param {Object} [options]
   * @param {Number} [options.duration=1000]
   * @param {String} [options.easing='outQuad']
   */
  constructor(options = {}) {
    super();

    this.setDuration(options.duration);
    this.setEasing(options.easing);
    this.on('tick', this.onTick);
  }

  /**
   * Get option value.
   *
   * @param {String} path Path can be set with dot-notation
   * @returns {*}
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], this);
  }

  /**
   * Set new option value.
   *
   * @param {String} path Path can be set with dot-notation
   * @param {*} value Value that need to be written to the options object
   * @returns {Animation}
   */
  set(path, value) {
    let obj = this;
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
   * @returns {Animation}
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
   * @returns {Animation}
   */
  setEasing(easing = 'outQuad') {
    if (typeof EASING[easing] !== 'function') throw new Error(`Unknown easing: ${easing}`);
    return this.set('easing', easing);
  }

  /**
   * Makes delay before executing function.
   *
   * @param {Number} ms Timeout in ms
   * @returns {Promise} Returns Promise that fulfills when delay is over
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calls each time when animation ticks.
   *
   * @param {Shape} shape Shape instance
   * @param {String} property Property name of the shape
   * @param {Number} value New value of the specified property
   * @returns {Animation}
   */
  onTick(shape, property, value) {
    shape.set(property, value);
    return this;
  }

  /**
   * Triggers each time when easing calculates new value in time.
   *
   * @param {String} easing Easing name
   * @param {Number} time Current time
   * @param {Number} startValue Start value
   * @param {Number} byValue Change in value
   * @param {Number} duration Duration
   * @returns {Number}
   */
  onEasing(easing, time, startValue, byValue, duration) {
    return Math.round(EASING[easing](time, startValue, byValue, duration));
  }

  /**
   * Main method that calls every time when shape needs to be animated.
   * This method must return Promise that fulfills with shape instance that has been animated.
   *
   * @abstract
   * @param {Shape} shape Shape instance that need to be animated
   * @param {Cursor} cursor Cursor instance that you can use for rendering other stuff
   * @returns {Promise} Returns Promise that fulfills with shape instance when animation is done
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
   * @param {Number} [options.byValue] Step value for easing, by default it calculates automatically
   * @param {Number} [options.duration] Duration of the animation in ms, by default it takes from Animation options
   * @param {String} [options.easing] Easing that need to apply to animation, by default it takes from Animation options
   * @returns {Promise} Returns Promise, that fulfills with shape instance which has been animated
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
        this.emit('tick', shape, property, this.onEasing(easing, currentTime - start, startValue, byValue, duration));
        this.delay(delay).then(() => tick(resolve));
      }
    };

    return new Promise(tick);
  }
}

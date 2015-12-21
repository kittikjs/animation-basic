import EventEmitter from 'events';
import { EASING } from './easing';

/**
 * Base class for creating other animations.
 * Each custom animation must extends from this class.
 *
 * @since 1.0.0
 */
export default class Basic extends EventEmitter {
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

    this.EASING = EASING;
    this._options = options;

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
    if (typeof this.EASING[easing] !== 'function') throw new Error(`Unknown easing: ${easing}`);
    return this.set('easing', easing);
  }

  /**
   * Method accepts shape and cursor instances.
   *
   * @abstract
   * @param {Shape} shape Shape instance that need to be animated
   * @param {Cursor} cursor Cursor instance that you can use for rendering other stuff
   */
  animate(shape, cursor) {
    throw new Error('You must implement animate() method');
  }

  /**
   * Animates property in object.
   * Each time when property animates, it emits tick event.
   *
   * @param {Object} options
   * @param {Object} options.shape Target object where property is need to be animated
   * @param {String} options.property Property name that need to be animated
   * @param {Number} [options.startValue] Start value for animation, by default it takes from obj[property]
   * @param {Number} [options.endValue] End value for animation, by default it 100
   * @param {Number} [options.byValue] Step value for easing
   * @param {Number} [options.duration] Duration of the animation in ms, by default it takes from Animation options
   * @param {String} [options.easing] Easing that need to apply to animation, by default easing from Animation options
   */
  animateProperty(options) {
    const shape = options.shape;
    const property = options.property;
    const startValue = options.startValue || shape.get(property);
    const endValue = options.endValue || 100;
    const byValue = options.byValue || (endValue - startValue);
    const duration = options.duration || this.getDuration();
    const easing = options.easing || this.getEasing();
    const delay = duration / (endValue - startValue);
    const start = Date.now();
    const end = start + duration;

    setTimeout(function tick() {
      let time = Date.now();
      let currentTime = time > end ? duration : (time - start);

      if (time > end) {
        this.emit('end', shape, property);
      } else {
        let newValue = Math.round(this.EASING[easing](currentTime, startValue, byValue, duration));
        shape.set(property, newValue);
        this.emit('tick', shape, property, newValue);
        setTimeout(tick.bind(this), delay);
      }
    }.bind(this), delay);

    return this;
  }
}

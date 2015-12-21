import { EASING } from './easing';

export * from './easing';

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
   * @param {Object} [options]
   * @param {Number} [options.duration=500]
   * @param {String} [options.easing='inQuad']
   * @constructor
   */
  constructor(options = {}) {
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
   * @param {Number} [duration=500]
   * @returns {Basic}
   */
  setDuration(duration = 500) {
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
   * @param {String} [easing='inQuad']
   * @returns {Basic}
   */
  setEasing(easing = 'inQuad') {
    return this.set('easing', easing);
  }

  /**
   * Triggers before animation starts.
   *
   * @returns {Basic}
   */
  onStart() {
    return this;
  }

  /**
   * Triggers each time when some property is animated.
   *
   * @param {Object} obj Object where property was animated
   * @param {String} property Which property of this object was animated
   * @param {Number} value New value of this property after animation
   * @returns {Basic}
   */
  onTick(obj, property, value) {
    return this;
  }

  /**
   * Triggers when animation is end.
   *
   * @returns {Basic}
   */
  onEnd() {
    return this;
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
   * Each time when property animates, it triggers {@link onTick} method.
   *
   * @param {Object} options
   * @param {Object} options.obj Target object where property is need to be animated
   * @param {String} options.property Property name that need to be animated
   * @param {Number} [options.startValue] Start value for animation, by default it takes from obj[property]
   * @param {Number} [options.endValue] End value for animation, by default it 100
   * @param {Number} [options.byValue] Step value for easing
   * @param {Number} [options.duration] Duration of the animation in ms, by default it takes from Animation options
   * @param {String} [options.easing] Easing that need to apply to animation, by default easing from Animation options
   */
  animateProperty(options = {}) {
    let obj = options.obj;
    let property = options.property;
    let startValue = options.startValue || obj.get ? obj.get(property) : obj[property];
    let endValue = options.endValue || 100;
    let byValue = options.byValue || (endValue - startValue);
    let duration = options.duration || this.getDuration();
    let easing = options.easing || this.getEasing();
    let delay = duration / (endValue - startValue);
    let start = Date.now();
    let end = start + duration;

    this.onStart();

    let interval = setInterval(() => {
      let time = Date.now();
      let currentTime = time > end ? duration : (time - start);

      if (time > end) {
        clearInterval(interval);
        this.onEnd();
      } else {
        this.onTick(obj, property, Math.round(this.EASING[easing](currentTime, startValue, byValue, duration)));
      }
    }, delay);

    return this;
  }
}

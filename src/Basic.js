/**
 * Base class for creating other animations.
 * Each custom animation must extends from this class.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @example
 * import Animation from 'kittik-animation-basic';
 *
 * export default class Print extends Animation {
 *   animate(chunk, cb) {
 *     // Do your logic here for animate the shape rendering and call cb
 *     cb(chunk);
 *   }
 * };
 */
export default class Basic {
  /**
   * Initializes animation.
   * Make sure that animation is disabled when instantiating.
   *
   * @constructor
   */
  constructor(options) {
    this._options = options;

    this.disable();
  }

  /**
   * Get option value.
   *
   * @param {String} path Path can be set with dot-notation
   * @returns {*}
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj[key], this._options);
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
   * Enable animation.
   *
   * @returns {Basic}
   */
  enable() {
    this.set('enabled', true);
    return this;
  }

  /**
   * Disable animation.
   *
   * @returns {Basic}
   */
  disable() {
    this.set('enabled', false);
    return this;
  }

  /**
   * Check if animation is enabled.
   *
   * @returns {Boolean}
   */
  isEnabled() {
    return !!this.get('enabled');
  }

  /**
   * Check if animation is disabled.
   *
   * @returns {Boolean}
   */
  isDisabled() {
    return !this.get('enabled');
  }

  /**
   * Main method where need to write animation logic.
   *
   * @abstract
   * @param {Buffer|String} chunk One portion of control codes that is going to render in terminal
   * @param {Function} cb Callback that accepts control codes piped to next item in the chain as an argument
   * @example
   * animate(chunk, cb) {
   *   setTimeout(cb, 100, chunk); // Simple animation
   * }
   */
  animate(chunk, cb) {
    throw new Error('animate() method must be implemented');
  }

  /**
   * Process each chunk of control symbols before piping into next item in the animations chain.
   *
   * @param {Buffer|String} chunk
   * @param {String} encoding
   * @param {Function} cb
   * @private
   */
  _transform(chunk, encoding, cb) {
    if (this.isEnabled()) return this.animate(chunk, cb.bind(this, null));

    cb(null, chunk);
  }
}

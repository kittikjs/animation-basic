import { Transform } from 'stream';

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
 *   constructor(...args) {
 *     super(...args);
 *   }
 *
 *   animate(chunk, cb) {
 *     // Do your logic here for animate the shape rendering and call cb
 *     cb(chunk);
 *   }
 * };
 */
export default class Basic extends Transform {
  _enabled = false;

  /**
   * Constructor is responsible for initializing base properties.
   * Don't forgot to call `super(...args)` when extending from this class.
   *
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Enable animation.
   *
   * @returns {Basic}
   */
  enable() {
    this._enabled = true;
    return this;
  }

  /**
   * Disable animation.
   *
   * @returns {Basic}
   */
  disable() {
    this._enabled = false;
    return this;
  }

  /**
   * Check if animation is enabled.
   *
   * @returns {Boolean}
   */
  isEnabled() {
    return !!this._enabled;
  }

  /**
   * Check if animation is disabled.
   *
   * @returns {Boolean}
   */
  isDisabled() {
    return !this._enabled;
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
   * @param chunk
   * @param encoding
   * @param cb
   * @private
   */
  _transform(chunk, encoding, cb) {
    if (this.isEnabled()) return this.animate(chunk, cb.bind(this, null));

    cb(null, chunk);
  }
}

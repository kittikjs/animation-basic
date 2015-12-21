import { assert } from 'chai';
import sinon from 'sinon';
import Rectangle from 'kittik-shape-rectangle';
import Animation from '../../src/Basic';

describe('Animation::Basic', () => {
  it('Should properly export easing', () => {
    let animation = new Animation();
    assert.isNumber(animation.EASING.inQuad(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outQuad(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutQuad(0, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutQuad(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inCubic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outCubic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutCubic(0, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutCubic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inQuart(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outQuart(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutQuart(0, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutQuart(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inQuint(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outQuint(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutQuint(0, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutQuint(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inSine(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outSine(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutSine(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inExpo(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inExpo(5, 0, 0, 0));
    assert.isNumber(animation.EASING.outExpo(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outExpo(5, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutExpo(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutExpo(2, 0, 0, 2));
    assert.isNumber(animation.EASING.inOutExpo(1, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutExpo(100, 0, 0, 0));
    assert.isNumber(animation.EASING.inCirc(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outCirc(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutCirc(0, 0, 0, 100));
    assert.isNumber(animation.EASING.inOutCirc(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inElastic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inElastic(5, 0, 0, 5));
    assert.isNumber(animation.EASING.inElastic(5, 0, -2, 2));
    assert.isNumber(animation.EASING.inElastic(5, 0, 2, 2));
    assert.isNumber(animation.EASING.outElastic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outElastic(5, 0, 0, 5));
    assert.isNumber(animation.EASING.outElastic(5, 0, -2, 2));
    assert.isNumber(animation.EASING.outElastic(5, 0, 2, 2));
    assert.isNumber(animation.EASING.inOutElastic(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutElastic(8, 0, 0, 8));
    assert.isNumber(animation.EASING.inOutElastic(8, 0, -2, 2));
    assert.isNumber(animation.EASING.inOutElastic(8, 0, 2, 2));
    assert.isNumber(animation.EASING.inOutElastic(0.5, 0, 2, 2));
    assert.isNumber(animation.EASING.inBack(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outBack(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutBack(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutBack(1, 0, 0, 5));
    assert.isNumber(animation.EASING.inBounce(0, 0, 0, 0));
    assert.isNumber(animation.EASING.outBounce(1, 0, 0, 5));
    assert.isNumber(animation.EASING.outBounce(0.7, 0, 0, 0));
    assert.isNumber(animation.EASING.outBounce(0.8, 0, 0, 0.001));
    assert.isNumber(animation.EASING.inOutBounce(0, 0, 0, 0));
    assert.isNumber(animation.EASING.inOutBounce(1, 0, 0, 5));
  });

  it('Should properly create animation with custom options', () => {
    let animation = new Animation({duration: 2000, easing: 'outExpo'});
    assert.equal(animation.getDuration(), 2000);
    assert.equal(animation.getEasing(), 'outExpo');
  });

  it('Should properly get/set from options object', () => {
    let animation = new Animation();
    assert.notOk(animation.get('enabled'));
    assert.instanceOf(animation.set('foo.bar', true), Animation);
    assert.ok(animation.get('foo.bar'));
    assert.instanceOf(animation.set('foo.bar', false), Animation);
    assert.notOk(animation.get('foo.bar'), false);
  });

  it('Should properly get/set duration of the animation', () => {
    let animation = new Animation();
    assert.equal(animation.getDuration(), 1000);
    assert.instanceOf(animation.setDuration(2000), Animation);
    assert.equal(animation.getDuration(), 2000);
  });

  it('Should properly get/set easing of the animation', () => {
    let animation = new Animation();
    assert.equal(animation.getEasing(), 'outQuad');
    assert.instanceOf(animation.setEasing('inQuad'), Animation);
    assert.equal(animation.getEasing(), 'inQuad');
  });

  it('Should properly throw error if not supported easing', () => {
    let animation = new Animation();
    assert.throws(() => animation.setEasing('wrong'), Error, 'Unknown easing: wrong');
  });

  it('Should properly throw error when animate is not implemented', () => {
    let animation = new Animation();
    assert.throws(() => animation.animate(), Error, 'You must implement animate() method');
  });

  it('Should properly animate property in shape', done => {
    let animation = new Animation();
    let shape = new Rectangle();
    let mock = sinon.mock(shape);

    mock.expects('set').atLeast(60);

    animation.animateProperty({shape: shape, property: 'x'}).on('end', () => {
      mock.verify();
      done();
    });
  });
});

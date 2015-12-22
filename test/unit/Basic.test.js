import { assert } from 'chai';
import sinon from 'sinon';
import Rectangle from 'kittik-shape-rectangle';
import Animation from '../../src/Basic';

describe('Animation::Basic', () => {
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

  it('Should properly throw error when animate is not implemented', done => {
    let animation = new Animation();
    animation.animate().then(() => true).catch(error => {
      assert.instanceOf(error, Error);
      assert.equal(error.message, 'You must implement animate() method');
      done();
    });
  });

  it('Should properly animate property in shape', done => {
    let animation = new Animation();
    let shape = new Rectangle();
    let mock = sinon.mock(shape);

    mock.expects('set').atLeast(60);

    animation.animateProperty({shape: shape, property: 'x'}).then(() => {
      mock.verify();
      done();
    });
  });
});

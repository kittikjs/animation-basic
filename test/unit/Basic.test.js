import { assert } from 'chai';
import sinon from 'sinon';
import Animation from '../../src/Basic';

describe('Animation::Basic', () => {
  it('Should properly get/set from options object', () => {
    let animation = new Animation();
    assert.notOk(animation.get('enabled'));
    assert.instanceOf(animation.set('foo.bar', true), Animation);
    assert.ok(animation.get('foo.bar'));
    assert.instanceOf(animation.set('foo.bar', false), Animation);
    assert.notOk(animation.get('foo.bar'), false);
  });

  it('Should properly enable animation', () => {
    let animation = new Animation();
    assert.instanceOf(animation.enable(), Animation);
    assert.ok(animation.get('enabled'));
  });

  it('Should properly disable animation', () => {
    let animation = new Animation();
    assert.instanceOf(animation.disable(), Animation);
    assert.notOk(animation.get('enabled'));
  });

  it('Should properly check if animation is enabled', () => {
    let animation = new Animation();
    assert.notOk(animation.isEnabled());
    assert.instanceOf(animation.enable(), Animation);
    assert.ok(animation.isEnabled());
  });

  it('Should properly check if animation is disabled', () => {
    let animation = new Animation();
    assert.ok(animation.isDisabled());
    assert.instanceOf(animation.enable(), Animation);
    assert.notOk(animation.isDisabled());
  });

  it('Should properly throw error when animate is not implemented', () => {
    let animation = new Animation();
    assert.throws(() => animation.animate(), Error, 'animate() method must be implemented');
  });

  it('Should properly pipe chunk to the next one item in the chain when animation is disabled', () => {
    let animation = new Animation();
    let cb = sinon.spy();

    animation._transform('test', null, cb);

    assert.ok(animation.isDisabled());
    assert.isNull(cb.getCall(0).args[0]);
    assert.equal(cb.getCall(0).args[1], 'test');
  });

  it('Should properly call animate method when animation is enabled', () => {
    let animation = new Animation();
    let mock = sinon.mock(animation);
    let cb = sinon.spy();

    mock.expects('animate').once();

    assert.instanceOf(animation.enable(), Animation);
    assert.ok(animation.isEnabled());
    animation._transform('test', null, cb);

    mock.verify();
  });
});

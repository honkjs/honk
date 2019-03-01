import 'jest';
import Honk from '../src';

test('honks', () => {
  console.log = jest.fn();

  const honk = new Honk().honk;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalledWith('HONK 🚚 HONK');
});

test('passes arguments to middleware', () => {
  console.log = jest.fn();

  const honk = new Honk().use((app, next) => (args) => {
    expect(args.length).toBe(2);
    expect(args[0]).toBe(1);
    expect(args[1]).toBe('hello');
  }).honk as any;

  expect(honk(1, 'hello')).toBeUndefined();
  expect(console.log).not.toBeCalled();
});

test('passes app services to middlewares', () => {
  console.log = jest.fn();

  const honk = new Honk()
    .use((app, next) => {
      expect(typeof app).toBe('object');
      // check honk is available
      app.custom = 'custom';
      return next;
    })
    .use((app, next) => {
      expect(app.custom).toBe('custom');
      return next;
    }).honk as any;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalledWith('HONK 🚚 HONK');
});

test('returns value from middleware', () => {
  console.log = jest.fn();

  const honk = new Honk().use((app, next) => (args) => {
    return 'test';
  }).honk as any;

  expect(honk()).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('uses multiple middlewares', () => {
  console.log = jest.fn();

  const honk = new Honk()
    .use((app, next) => (args) => {
      if (args[0] == 1) {
        return 'first';
      }
      return next(args);
    })
    .use((app, next) => (args) => {
      if (args[0] == 2) {
        return 'second';
      }
      return next(args);
    }).honk as any;

  expect(honk(1)).toBe('first');
  expect(console.log).not.toBeCalled();

  expect(honk(2)).toBe('second');
  expect(console.log).not.toBeCalled();

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalledWith('HONK 🚚 HONK');
});

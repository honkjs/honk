import 'jest';
import Honk from '@honkjs/honk';
import injector from '../src';

test('still honks', () => {
  console.log = jest.fn();

  const honk = new Honk().use(injector()).honk;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalledWith('HONK 🚚 HONK');
});

test('calls function', () => {
  console.log = jest.fn();

  let value = 0;
  function test() {
    value++;
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBeUndefined();
  expect(value).toBe(1);
  expect(console.log).not.toBeCalled();
});

test('returns function results', () => {
  console.log = jest.fn();

  function test() {
    return 'test';
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('injects services', () => {
  console.log = jest.fn();

  function test(services: any) {
    expect(typeof services.honk).toBe('function');
    return 'test';
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

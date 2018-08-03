import 'jest';
import Honk from '@honkjs/honk';
import silence from '../src';

test('no longer honks', () => {
  console.log = jest.fn();

  const honk = new Honk().use(silence()).honk;

  expect(honk()).toBeUndefined();
  expect(console.log).not.toBeCalled();
});

import 'jest';
import Honk from '@honkjs/honk';
import components from '../src';

test('still honks', () => {
  console.log = jest.fn();

  const honk = new Honk().use(components()).honk;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalled();
});

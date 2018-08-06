import 'jest';
import Honk from '@honkjs/honk';
import components, { IComponent, createCache, createHonkComponent } from '../src';

test('still honks', () => {
  console.log = jest.fn();

  const honk = new Honk().use(components()).honk;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalled();
});

test('adds to cache', () => {
  const cache = createCache();
  const fakeComponent: IComponent = {
    render: jest.fn(),
  };

  expect(cache.get('test')).toBeUndefined();

  cache.set('test', fakeComponent);
  expect(cache.get('test')).toBe(fakeComponent);
});

test('removes from cache', () => {
  const cache = createCache();
  const fakeComponent: IComponent = {
    render: jest.fn(),
  };

  cache.set('test', fakeComponent);
  expect(cache.get('test')).toBe(fakeComponent);

  cache.remove('test');
  expect(cache.get('test')).toBeUndefined();
});

test('overrides existing in cache', () => {
  const cache = createCache();
  const fakeComponent: IComponent = {
    render: jest.fn(),
  };
  const anotherFakeComponent: IComponent = {
    render: jest.fn(),
  };

  cache.set('test', fakeComponent);
  expect(cache.get('test')).toBe(fakeComponent);

  cache.set('test', anotherFakeComponent);
  expect(cache.get('test')).toBe(anotherFakeComponent);
});

test('creates component with mapped id', () => {
  console.log = jest.fn();

  const honk = new Honk().use(components()).honk;

  const props = { data: 'data', itemId: 'itemId' };

  const map = (props: any) => props.itemId;

  const comp = {
    render: jest.fn((props) => {
      expect(props).toBe(props);
      return 'results';
    }),
  };

  const create = jest.fn((services, id, props) => {
    expect(services).not.toBeUndefined();
    expect(id).toBe('name:itemId');
    expect(props).toBe(props);
    return comp;
  });

  const honkComp = createHonkComponent('name', create, map);

  const results = honk(honkComp, props);

  expect(results).toBe('results');
  expect(comp.render).toBeCalledWith(props);

  expect(console.log).not.toBeCalled();
});

test('creates component, loads cached component', () => {
  console.log = jest.fn();

  const cache = createCache();
  cache.get = jest.fn(cache.get);
  cache.set = jest.fn(cache.set);
  cache.remove = jest.fn(cache.remove);

  const honk = new Honk().use(components(cache)).honk;

  const props = { id: 'id', data: 'data' };

  const comp = {
    render: jest.fn((props) => {
      expect(props).toBe(props);
      return 'results';
    }),
  };

  const create = jest.fn((services, id, props) => {
    expect(services).not.toBeUndefined();
    expect(id).toBe('name:id');
    expect(props).toBe(props);
    return comp;
  });

  const honkComp = createHonkComponent('name', create);

  const results = honk(honkComp, props);
  const results2 = honk(honkComp, props);

  expect(results).toBe('results');
  expect(results2).toBe('results');

  expect(create).toHaveBeenCalledTimes(1);
  expect(cache.set).toHaveBeenCalledTimes(1);

  expect(cache.get).toHaveBeenCalledTimes(2);
  expect(comp.render).toHaveBeenCalledTimes(2);

  expect(console.log).not.toBeCalled();
});

test('uncaches on unload', () => {
  console.log = jest.fn();

  const cache = createCache();
  cache.get = jest.fn(cache.get);
  cache.set = jest.fn(cache.set);
  cache.remove = jest.fn(cache.remove);

  const honk = new Honk().use(components(cache)).honk;

  const props = { id: 'id' };

  const unload = jest.fn();
  const comp = {
    render: jest.fn(() => 'results'),
    unload: unload,
  };

  const create = jest.fn(() => comp);

  const honkComp = createHonkComponent('name', create);

  const results = honk(honkComp, props);

  expect(results).toBe('results');

  expect(create).toHaveBeenCalledTimes(1);
  expect(cache.set).toHaveBeenCalledTimes(1);

  expect(cache.get).toHaveBeenCalledTimes(1);
  expect(comp.render).toHaveBeenCalledTimes(1);

  comp.unload();

  expect(unload).toHaveBeenCalledTimes(1);

  expect(cache.remove).toHaveBeenCalledWith('name:id');

  expect(console.log).not.toBeCalled();
});

test('errors if no id', () => {
  console.log = jest.fn();

  const honk = new Honk().use(components()).honk;

  const props = { data: 'data' };

  const unload = jest.fn();
  const comp = {
    render: jest.fn(() => 'results'),
    unload: unload,
  };

  const map = () => null;

  const create = jest.fn(() => comp);

  const honkComp = createHonkComponent('name', create, map);

  expect(() => honk(honkComp, props)).toThrowError();

  expect(create).not.toBeCalled();
  expect(comp.render).not.toBeCalled();

  expect(console.log).not.toBeCalled();
});

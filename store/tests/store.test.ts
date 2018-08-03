import 'jest';
import { createStore } from '../src';

test('creates store', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);
  expect(typeof store).toBe('object');
  expect(store).toHaveProperty('getState');
  expect(store).toHaveProperty('setState');
  expect(store).toHaveProperty('subscribe');
});

test('gets state', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);
  expect(store.getState().count).toBe(0);
});

test('mutates state', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);
  store.setState((s) => {
    s.count++;
    return s;
  });
  expect(state.count).toBe(1);
  expect(store.getState().count).toBe(1);
});

test('sets state immutable', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);
  store.setState((s) => ({
    count: 5,
  }));
  expect(state.count).toBe(0);
  expect(store.getState().count).toBe(5);
});

test('subscribes to state changes', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);

  let test = 0;
  const unsub = store.subscribe((s) => {
    test++;
  });

  store.setState((s) => ({
    count: 5,
  }));

  expect(store.getState().count).toBe(5);
  expect(test).toBe(1);
});

test('unsubscribes from state changes', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);

  let test = 0;
  const unsub = store.subscribe((s) => {
    test++;
  });

  store.setState((s) => ({
    count: 5,
  }));

  expect(store.getState().count).toBe(5);
  expect(test).toBe(1);

  unsub();

  store.setState((s) => ({
    count: 10,
  }));

  expect(store.getState().count).toBe(10);
  expect(test).toBe(1); // didn't call the sub
});

test('can call unsubscribes multiple times', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);

  let test = 0;
  const unsub = store.subscribe((s) => {
    test++;
  });

  store.setState((s) => ({
    count: 5,
  }));

  expect(store.getState().count).toBe(5);
  expect(test).toBe(1);

  unsub();
  expect(() => unsub()).not.toThrow();

  store.setState((s) => ({
    count: 10,
  }));

  expect(store.getState().count).toBe(10);
  expect(test).toBe(1); // didn't call the sub
});

test('can add listeners within a subscription', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);

  let test1 = 0;
  let test2 = 0;
  const unsub1 = store.subscribe((s) => {
    test1++;
    const unsub2 = store.subscribe((s) => {
      test2++;
    });
  });

  store.setState((s) => ({
    count: 5,
  }));

  expect(store.getState().count).toBe(5);
  expect(test1).toBe(1);
  expect(test2).toBe(0);

  store.setState((s) => ({
    count: 10,
  }));

  expect(store.getState().count).toBe(10);
  expect(test1).toBe(2);
  expect(test2).toBe(1);
});

test('can remove listeners within a subscription', () => {
  const state = {
    count: 0,
  };
  const store = createStore(state);

  let test = 0;
  const unsub = store.subscribe((s) => {
    test++;
    unsub();
  });

  store.setState((s) => ({
    count: 5,
  }));

  expect(store.getState().count).toBe(5);
  expect(test).toBe(1);

  store.setState((s) => ({
    count: 10,
  }));

  expect(store.getState().count).toBe(10);
  expect(test).toBe(1); // didn't call the sub
});

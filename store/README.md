# honkjs/store

A very simple state store with update subscriptions. For when [redux](https://redux.js.org/) is just a little too much.

# Example

```ts
import { createStore } from '@honkjs/store';

const initState = {
  count: 0,
};

const store = createStore(initState);

const unsubscribe = store.subscribe((state) => {
  console.log('updated', state);
});

store.setState((state) => {
  // can be updated using immutable patterns.
  return {
    ...state,
    count: 1,
  };
});
// output: 'updated', { count: 1 }

store.setState((state) => {
  // or mutated directly
  state.count = 100;
  // but still must return the state
  return state;
});
// output: 'updated', { count: 100 }

// use getState to retrieve the current value.
const count = store.getState().count;

// call the unsubscribe function to stop listening.
// any mutations after this will be ignored.
unsubscribe();
```

# Type safety

```ts
import { IHonkStore } from '@honkjs/store';

interface IMyState = {
  count: number,
};

type MyHonkAppServices = {
  store: IHonkStore<IMyState>;
} & IHonkServices;
```

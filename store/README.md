# honkjs/store

A very simple state store with update subscriptions. For when [redux](https://redux.js.org/) is just too much.

# Example

```ts
import Honk from '@honkjs/honk';
import store from '@honkjs/store';
import injector from '@honkjs/injector';

const initState = {
  count: 0,
};

const honk = new Honk()
  // add the store with our initial state
  .use(store(initState))
  .use(injector())
  .use((app, next) => {
    // we can access and subscribe to the store in a middleware
    // calling unsubscribe() will remove the listener
    const unsubscribe = app.services.store.subscribe((state) => {
      console.log('state updated', state);
    });
    return next;
  }).honk;

function increment(num) {
  return function({ store }) {
    // we can get the current state from getState();
    const oldState = store.getState();

    // store.subscribe is also available,
    // but is an advanced use case outside of the middleware

    store.setState((state) => {
      // setState takes a function returns the new state
      // note:  store doesn't force immutability
      // you can mutate the state and just return it too.
      return {
        count: state.count + num,
      };
    });
  };
}

honk(increment(2)); //output: state updated, { count: 2 }
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

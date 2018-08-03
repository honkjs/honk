# honkjs/store

A very simple state store with update subscriptions. For when [redux](https://redux.js.org/) is just a little too much.

Store doesn't have any dependencies on honk, and can be used more as a utility library.

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

// state can be updated using immutable patterns.
store.setState((state) => {
  return {
    ...state,
    count: 1,
  };
});
// output: 'updated', { count: 1 }

// or alternatively, mutated directly.
store.setState((state) => {
  state.count = 100;
  return state;
});
// output: 'updated', { count: 100 }

// use getState to retrieve the current value.
const count = store.getState().count;

// call the unsubscribe function to stop listening.
// any mutations after this will be ignored.
unsubscribe();
```

# Using with nanocomponents

Store doesn't currently have the equivalent of a 'redux-connect' helper, but it can be wired up manually to a component quite simply.

Here is an example of a choo component that will re-render when the store changes.

```ts
import html from 'nanohtml';
import Component from 'nanocomponent';
import { IHonkStore, IUnsubscribe } from '@honkjs/store';

type MyState = { count: number };

export class CountContainer extends Component {
  private unsub?: IUnsubscribe;
  private count: number;

  constructor(public id: string, private store: IHonkStore<MyState>) {
    super(id);
    this.count = store.getState().count;
  }

  createElement() {
    return html`<span>Count: ${this.count}</span>`;
  }

  update() {
    return false;
  }

  load() {
    this.unsub = this.store.subscribe((state) => {
      this.count = state.count;
      this.rerender();
    });
  }

  unload() {
    this.unsub && this.unsub();
  }
}
```

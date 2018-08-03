# Honk

A simple, yet flexible, middleware builder.

# Concepts

Honk's API is heavily inspired by redux + redux-thunk dispatch. At its heart, it's an extremely naive dependency injector with middleware.

Built with typescript in mind, the core 'honk' function can be overloaded by middlewares to add new functionality, similar to the way redux-thunk adds completely new functionality to redux's dispatch.

By default, honk does nothing but honk.

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().honk;

honk(); // output: "HONK 🚚 HONK"
```

A middleware wraps the previous functionality of honk in another function.

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().use(function(app, next) {
  // 'app' is the honk context used to pass data between middlewares.
  // by default, it has one property, services, that contains honk
  // app.services.honk()
  // other properties can be added here

  // 'next' is the previous middleware function.
  // since we haven't added any middlewares before this one,
  // right now it's the base honk();
  // next(); // output: "HONK 🚚 HONK"

  return function(args) {
    // the middleware creator returns a function that takes the argument array passed into honk.

    if (args.length > 0) {
      // do something cool
    } else {
      // note:  some honk middlewares return values
      // so it's important to always return the results of next
      return next(args);
    }
  };
}).honk;

honk('Hello World'); // will "do something cool" rather than honk.
```

It's common for libraries that use middlewares to invert the order in which they're applied, but honk does not. Honk likes to keep things simple.

```ts
const honk = new Honk()
  .use(middlewareOne)
  .use(middlewareTwo)
  .use(middlewareThree).honk;

// middleware three will be called first, then two, then one
// then the base honk() function if none of them handle it.
honk();
```

# Typescript

If you're using typescript, you likely noticed that the honk method has a type signature that takes no arguments and returns no results.

```ts
export interface IHonk {
  (): void;
}
```

When you add new behaviors to honk, you can add new method overloads using declaration merging.

```ts
declare module '@honkjs/honk' {
  interface IHonk {
    // or whatever signature you need
    (name: string, num: number): Promise<any>;
  }
}
```

Typescript will merge any of these together when type checking your use of honk().

# Recipe examples

Here are some examples of middlewares you can add to honk.

## Exception catcher

Wrap all the middlewares in a try/catch.

```ts
const honk = new Honk()
  .use(middlewareOne)
  .use(middlewareTwo)
  .use(middlewareThree)
  .use(function(app, next) {
    return function(args) {
      try {
        return next(args);
      } catch (ex) {
        console.error('oh noes!', ex);
      }
    };
  }).honk;

honk(somethingThatCausesAnError);
```

## Logger

Log information about honk calls.

```ts
const honk = new Honk()
  .use(middlewareOne)
  .use(middlewareTwo)
  .use(middlewareThree)
  .use(function(app, next) {
    return function(args) {
      console.log('begin honk', args);
      const results = next(args);
      console.log('end honk', args, results);
      return results;
    };
  }).honk;

honk(doSomething);
```

## Reducer

Let's build [redux](https://redux.js.org/) with the help of [@honkjs/store](../store).

```ts
import Honk from '@honkjs/honk';
import { createStore } from '@honkjs/store';

const store = createStore({ count: 0 });

const unsubscribe = store.subscribe((state) => {
  console.log('state', state);
});

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + action.data,
      };
    case 'decrement':
      return {
        ...state,
        count: state.count - action.data,
      };
    default:
      return state;
  }
}

function reducerMiddleware(store, reducer) {
  return (app, next) => (args) => {
    // has one object argument with a type property
    if (args.length === 1 && typeof args[0] === 'object' && args[0].type) {
      const curState = store.getState();
      const newState = reducer(curState, args[0]);
      store.setState(newState);
    } else {
      return next(args);
    }
  };
}

const honk = new Honk().use(reducerMiddleware(store, reducer)).honk;

honk.honk({ type: 'increment', data: 7 });
// output: state, { count: 7 }

honk.honk({ type: 'decrement', data: 5 });
// output: state, { count: 2 }
```

## Injector

Let's build [redux-thunk](https://github.com/reduxjs/redux-thunk).

```ts
import Honk from '@honkjs/honk';
import api from 'mycoolapi';

const honk = new Honk()
  .use(function(app, next) {
    return function(args) {
      if (args.length === 0 && typeof args[0] === 'function') {
        // if there is one argument, and it's a function
        // we call that function and inject the services
        // returning the results
        return args[0](app.services);
      } else {
        // otherwise, we pass it to the other middlewares
        return next(args);
      }
    };
  })
  .use(function(app, next) {
    // we're adding our new api service
    app.services.api = api;
    // but not adding anything to the middleware function
    // so we can just return it
    return next;
  }).honk;

function dispatchMe({ api }) {
  return api.fetchSomething(); // returns a Promise
}

// dispatchMe is called directly by honk and returns the Promise
// this Promise can then be awaited
honk(dispatchMe).then((results) => console.log(results));

function dispatchMeWithParam(name) {
  return function({ api }) {
    return api.fetchSomethingElse(name);
  };
}

// dispatchMeWithName takes a parameter and returns a function
// that function is then called by honk, returning the Promise
honk(dispatchMeWithParam('bob')).then((results) => console.log(results));
```

This functionality is available pre-built as [@honkjs/injector](../injector).

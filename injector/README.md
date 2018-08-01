# honkjs/injector

Injects services into functions passed to honk. Very similar functionality to [redux-thunk](https://github.com/reduxjs/redux-thunk).

```js
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';
import api from 'mycoolapi';

const honk = new Honk()
  // add the injector to the middleware pipeline
  .use(injector())
  // add a custom service
  .use((app, next) => {
    app.services.api = api;
    return next;
  }).honk;

function getSomething(name) {
  return function({ api }) {
    // returns a promise
    return api.fetchSomething(name);
  };
}

honk(getSomething('bob')).then((results) => console.log(results));
```

Injector always returns the results of the function passed in.

Dependency injection is handled using js object deconstruction.

```js
// no deconstruction
function boringThunk(name) {
  return function(services) {
    return services.api.getSomething(name);
  };
}

// deconstructed
function coolThunk(name) {
  return function({ api }) {
    return api.getSomething(name);
  };
}

honk(boringThunk('Bob'));
honk(coolThunk('George'));
```

There is no dependency resolution, or anything fancy like that. Injector is built with the simple goal of allowing you to easily access application services from anywhere honk is available.

# Type safety

If you're using typescript, you likely want some type safety on the services object. There are a couple ways to achieve this. Which way you use is totally a matter of preference.

## Union type

```ts
type MyHonkAppServices = {
  api: MyApi;
} & IHonkServices;

// this creates a new type combining the IHonkServices with your own
// { api: MyApi, honk: IHonk }

function coolThunk(name) {
  return function({ api }: MyHonkAppServices) {
    return api.getSomething(name);
  };
}
```

## Declaration merging

Similar to how IHonk can be overloaded, you can use declaration merging.

```ts
declare module '@honkjs/honk' {
  interface IHonkServices {
    api: MyApi;
  }
}

// The standard IHonkServices type will now be:
// { api: MyApi, honk: IHonk }

function coolThunk(name) {
  return function({ api }: IHonkServices) {
    return api.getSomething(name);
  };
}
```

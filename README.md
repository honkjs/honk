<h1 align="center">Honk</h1>

Honk, pronounced "HONK 🚚 HONK" shouted as loudly as possible while making a truck horn pulling motion, is inspired by, an addon for, and a louder alternative to, [choo](https://github.com/choojs/choo) 🚂🚋, the sturdy frontend framework that could.

Honk, because, by default, that is all that it does.

<div align="center">
  <sub>Built with 🤣 by
    <a href="https://github.com/decoy">Kellen Piffner</a> and
    <a href="https://github.com/honkjs/honk/graphs/contributors">
      contributors
    </a>
  </sub>
</div>

# Getting started

```
npm install @honkjs/honk
```

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().honk;

honk(); // output: "HONK 🚚 HONK"
```

# With service injection

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';

const honk = new Honk().use(injector).honk;

honk(); // output: "HONK 🚚 HONK"

function honkOne({ honk }: IHonkServices) {
  setTimeout(() => honk(), 100);
}

console.log(honk(honkOne)); // output after 100ms: "HONK 🚚 HONK"

function honkTwo(butWhyTho: string) {
  return function({ honk }: IHonkServices) {
    setTimeout(() => honk(), 100);
  };
}

console.log(honk(honkTwo('honk'))); // output after 100ms: "HONK 🚚 HONK"
```

# With components

```ts
import Honk from '@honkjs/honk'
import component from '@honkjs/components'
import html from 'nanohtml'

const honk = new Honk().use(component).honk

honk() // output: "HONK 🚚 HONK"

type HonkButtonProps = { honk :IHonk }

class HonkButton : Component<HonkButtonProps> {
  constructor(private id, private honk) {
    honk()
  }

  honk = () => this.honk()

  create(honk, props: HonkButtonProps) {
    honk()
    props.honk()
    return html`<button onclick=this.honk>${this.id}</button>`
  }
}

function createHonkButton({ honk }, id) {
  honk()
  return new HonkButton(id, honk)
}

const button = honk(createHonkButton, 'honk', { honker: honk })
// output: "HONK 🚚 HONK", "HONK 🚚 HONK", "HONK 🚚 HONK"

const honker = html`<div>Honk: ${button}</div>`
//  *CLICK*  output: "HONK 🚚 HONK"
```

# With custom services

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';

const honk = new Honk().use(injector).use((app, next) => {
  app.services = {
    anotherHonk: app.services.honk,
    ...app.services,
  };
  return next;
}).honk;

honk(); // output: "HONK 🚚 HONK"

function honkOne({ anotherHonk }) {
  setTimeout(() => anotherHonk(), 100);
}

console.log(honk(honkOne)); // output after 100ms: "HONK 🚚 HONK"
```

# With custom middleware

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().use((app, next) => {
  function honkReducer(honkAction: { type: string }) {
    switch (honkAction.type) {
      case 'honkOne':
        app.services.honk();
        break;
      case 'honkTwo':
        app.services.honk();
        break;
    }
  }
  return (args) => {
    if (args.length === 1 && typeof args[0] === 'object' && args[0].type) {
      return honkReducer(args[0]);
    } else {
      return next(args);
    }
  };
}).honk;

declare module '@honkjs/honk' {
  export interface IHonk {
    ({ type: string }): void;
  }
}

honk(); // output: "HONK 🚚 HONK"

honk.honk({ type: 'honkOne' }); // output: "HONK 🚚 HONK"

honk.honk({ type: 'honkTwo' }); // output: "HONK 🚚 HONK"
```

# With store

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';
import store from '@honkjs/store';

const honk = new Honk().use(store(state)).use(injector).honk;

function honkAgain({ store, honk }: MyHonkAppServices) {
  honk();
  store.setState((state) => ({
    ...state,
    honks: state.honks + 1,
  }));
}

function subscribeNowToHonks({ store, honk }: MyHonkAppServices) {
  const unsubscribe = store.subscribe((state) => {
    if (state.honks >= 2) {
      unsubscribe();
    } else {
      honk();
    }
  });
}

honk(subscribeNowToHonks);

honk(honkAgain); // output: "HONK 🚚 HONK", "HONK 🚚 HONK"

honk(honkAgain); // output: "HONK 🚚 HONK"

function honkABunch({ store, honk }: MyHonkAppServices) {
  const honks = store.getState().honks;
  for (let x = 0; x < honks; x++) {
    honk();
  }
}

honk(honkABunch); // output: "HONK 🚚 HONK", "HONK 🚚 HONK"
```

# With routing

TODO

# With DOM

TODO

# With silence

```ts
import Honk from '@honkjs/honk';
import silence from '@honkjs/silence';

const honk = new Honk().use(silence()).honk;

honk(); // output: Nothing. Just the silence of your cold, dead heart.
```

# FAQ

## Honk?

HONK 🚚 HONK

## No, really, what?

Honk's API is heavily inspired by redux + redux-thunk dispatch. At its heart, it's an extremely naive dependency injector with middleware.

Built with typescript in mind, the core 'honk' function can be overloaded by middlewares to add new functionality, similar to the way redux-thunk adds completely new functionality to redux's dispatch. Typings can be added by adding to the module definition of the IHonk interface.

```ts
declare module '@honkjs/honk' {
  // this declaration will be merged with other IHonk declarations
  export interface IHonk {
    ({ type: string }): void;
  }
}
```

Dependency injection is handled using js object deconstruction.

```js
function normalFunction(services) {
  services.whatever();
}

function honkFunction({ whatever }) {
  whatever();
}

function honkThunk(num) {
  return function({ whatever }) {
    whatever(num);
  };
}
```

There is no dependency resolution, or anything fancy like that. Honk is built with the simple goal of allowing you to easily access application services from anywhere honk is available.

Until you add a middleware, however, all honk does is, well, honk. If you're using honk, you almost certainly want the injector middleware. It's not used by default because that's not as fun.

For frontend component support, honk uses the choo ecosystem libraries. Choo is a wonderful framework and you should probably be using it.

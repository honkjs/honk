<h1 align="center">Honk</h1>

Honk, pronounced "HONK 🚚 HONK" shouted as loudly as possible while making a truck horn pulling motion, is inspired by, and a loud collection of addons for, [choo](https://github.com/choojs/choo) 🚂🚋, the sturdy frontend framework that could.

Honk, because, by default, that is all that it does.

---

<div align="center">
  <sub>Built with 🤣 by
    <a href="https://github.com/decoy">Kellen Piffner</a> and
    <a href="https://github.com/honkjs/honk/graphs/contributors">
      contributors
    </a>
  </sub>
</div>

---

# Getting started

```
npm install @honkjs/honk
```

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().honk;

honk(); // output: "HONK 🚚 HONK"
```

[Would you like to know more?](honk/)

# With service injection

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';

const honk = new Honk().use(injector()).honk;

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

[Would you like to know more?](injector/)

# With components

```ts
import Honk from '@honkjs/honk';
import components from '@honkjs/components';
import html from 'nanohtml';

const honk = new Honk().use(components()).honk;

honk(); // output: "HONK 🚚 HONK"

type HonkButtonProps = { honker :IHonk }

class HonkButton : Component<HonkButtonProps> {
  constructor(private id, private honk) {
    super(id);
    honk();
  }

  honk = () => this.honk();

  create(honk, { honker }: HonkButtonProps) {
    honk();
    honker();
    return html`<button onclick=this.honk>${this.id}</button>`;
  }
}

function createHonkButton({ honk }, id) {
  honk();
  return new HonkButton(id, honk);
}

const button = honk(createHonkButton, 'honk', { honker: honk });
// output: "HONK 🚚 HONK", "HONK 🚚 HONK", "HONK 🚚 HONK"

const honker = html`<div>Honk: ${button}</div>`;
//  *CLICK*  output: "HONK 🚚 HONK"
```

[Would you like to know more?](components/)

# With store

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';
import store from '@honkjs/store';

const initHonkState = {
  honks: 0,
};

const honk = new Honk().use(store(initHonkState)).use(injector).honk;

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

[Would you like to know more?](store/)

# With custom services

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';

const honk = new Honk().use(injector).use((app, next) => {
  app.services.anotherHonk = app.services.honk;
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

# With routing

[still in transit 🚚]

# With DOM

[still in transit 🚚]

# With silence

```ts
import Honk from '@honkjs/honk';
import silence from '@honkjs/silence';

const honk = new Honk().use(silence()).honk;

honk(); // output: Nothing. Just the silence of your cold, dead heart.
```

[Would you like to know more?](silence/)

# FAQ

## Honk?

HONK 🚚 HONK

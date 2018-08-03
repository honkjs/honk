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

function delayedHonk(delay: number) {
  return function({ honk }: IHonkServices) {
    setTimeout(() => honk(), delay);
  };
}

honk(delayedHonk(1000)); // output after 1000ms: "HONK 🚚 HONK"
```

[Would you like to know more?](injector/)

# With components

```ts
import Honk, { IHonk, IHonkServices } from '@honkjs/honk';
import components from '@honkjs/components';
import html from 'nanohtml';
import Component from 'nanocomponent';

const honk = new Honk().use(components()).honk;

honk(); // output: "HONK 🚚 HONK"

type HonkProps = { id: string; onHonk: () => void };

class HonkButton extends Component {
  private props: HonkProps;

  constructor(private honk: IHonk, id: string) {
    super(id);
  }

  createElement(props: HonkProps) {
    this.props = props;
    return html`<button onclick=${this.onclick}>Honk</honk>`;
  }

  onclick = () => this.props.onHonk();

  update() {
    return false;
  }
}

const button = createHonkComponent('HonkButton', ({ honk }: IHonkServices, id: string) => {
  return new HonkButton(honk, id);
});

const honker = html`<div>Honk: ${honk(button, { id: 'honk', onHonk: () => honk() })}</div>`;
//  *CLICK*  output: "HONK 🚚 HONK"
```

[Would you like to know more?](components/)

# With store

```ts
import Honk from '@honkjs/honk';
import { createStore } from '@honkjs/store';

const honk = new Honk().honk;

honk(); // output: "HONK 🚚 HONK"

const initState = {
  honks: 0,
};

const store = createStore(initState);

const unsubscribe = store.subscribe((state) => {
  for (let x = 0; x < state.honks; x++) {
    honk();
  }
});

store.setState((state) => ({ honks: 1 });
// output: "HONK 🚚 HONK"

store.setState((state) => ({ honks: 2 });
// output: "HONK 🚚 HONK", "HONK 🚚 HONK"

unsubscribe();

store.setState((state) => ({ honks: 1000 });
// output: nothing
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

[Would you like to know more?](honk/)

# With custom middleware

```ts
import Honk from '@honkjs/honk';

const honk = new Honk().use((app, next) => (args) => {
    if (args.length === 1 && typeof args[0] === 'object' && args[0].type) {

    } else {
      return next(args);
    }
  };
}).honk;

honk(); // output: "HONK 🚚 HONK"

honk.honk({ type: 'honkOne' }); // output: "HONK 🚚 HONK"

honk.honk({ type: 'honkTwo' }); // output: "HONK 🚚 HONK"
```

[Would you like to know more?](honk/)

# With silence

```ts
import Honk from '@honkjs/honk';
import silence from '@honkjs/silence';

const honk = new Honk().use(silence()).honk;

honk(); // output: Nothing. Just the silence of your cold, dead heart.
```

[Would you like to know more?](silence/)

# FAQ

### Honk?

HONK 🚚 HONK

<div align="center">

  <!--  dependencies -->
  <a href="https://david-dm.org/honkjs/honk">
    <img src="https://david-dm.org/honkjs/honk.svg?style=flat-square" alt="dependency status" />
  </a>
  <!-- dev dependencies  -->
  <a href="https://david-dm.org/honkjs/honk&type=dev">
    <img src="https://david-dm.org/honkjs/honk/dev-status.svg?style=flat-square" alt="dev dependency status" />
  </a>
  <!-- greenkeeper -->
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/honkjs/honk.svg" alt="greenkeeper status" />
  </a>
  <!-- coverage -->
  <a href="https://codecov.io/github/honkjs/honk">
    <img src="https://img.shields.io/codecov/c/github/honkjs/honk/master.svg?style=flat-square" alt="test coverage" />
  </a>
  <!-- build -->
  <a href="https://travis-ci.org/honkjs/honk">
    <img src="https://img.shields.io/travis/honkjs/honk/master.svg?style=flat-square" alt="build status" />
  </a>
</div>

<h1 align="center">Honk</h1>

Honk, pronounced "HONK 🚚 HONK" shouted as loudly as possible while making a truck horn pulling motion, is inspired by, and a loud collection of addons for, [choo](https://github.com/choojs/choo) 🚂🚋, the sturdy frontend framework that could.

"Honk", because, by default, that is all that it does.

<table>
  <tr>
    <th>Package</th>
    <th>Version</th>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/honkjs/honk">@honkjs/honk</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@honkjs/honk">
        <img src="https://img.shields.io/npm/v/@honkjs/honk.svg?style=flat-square" alt="npm version" />
      </a>
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/honkjs/injector">@honkjs/injector</a></td>
    <td>
      <a href="https://www.npmjs.com/package/@honkjs/injector">
        <img src="https://img.shields.io/npm/v/@honkjs/injector.svg?style=flat-square" alt="npm version" />
      </a>
    </td>
  </tr>
  <tr>
    <td><a href="https://github.com/honkjs/store">@honkjs/store</a></td>
    <td>
      <a href="https://www.npmjs.com/package/@honkjs/store">
        <img src="https://img.shields.io/npm/v/@honkjs/store.svg?style=flat-square" alt="npm version" />
      </a>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/honkjs/silence">@honkjs/silence</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@honkjs/silence">
        <img src="https://img.shields.io/npm/v/@honkjs/silence.svg?style=flat-square" alt="npm version" />
      </a>
    </td>
  </tr>
</table>

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

[Would you like to know more?](HONK_HONK.md)

# With service injection (thunks)

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

[Would you like to know more?](https://github.com/honkjs/injector)

# With custom services

```ts
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';

function moreHonkMiddleware(app, next) {
    app.services.anotherHonk = app.services.honk;
    return next;
  }
}

const honk = new Honk()
  .use(injector())
  .use(moreHonkMiddleware).honk;

honk(); // output: "HONK 🚚 HONK"

function honkOne({ anotherHonk }) {
  setTimeout(() => anotherHonk(), 100);
}

honk(honkOne); // output after 100ms: "HONK 🚚 HONK"
```

[Would you like to know more?](HONK_HONK.md)

# With custom middleware

```ts
import Honk from '@honkjs/honk';

function honkingMiddleware(app, next) {
  return function(args) {
    if (args.length === 1 && args[0].type) {
      const honkType = args[0].type;
      if (honkType === 'quiet') {
        return 'honk 🚚 honk';
      } else {
        return 'HONK 🚚 HONK';
      }
    }
    return next(args);
  };
}

const honk = new Honk().use(honkingMiddleware).honk;

honk(); // output: "HONK 🚚 HONK"

const quiet = honk.honk({ type: 'quiet' }); // output: nothing.
// quiet = "honk 🚚 honk"

const loud = honk.honk({ type: 'loud' }); // output: nothing.
// loud = "HONK 🚚 HONK"
```

[Would you like to know more?](HONK_HONK.md)

# With silence

```ts
import Honk from '@honkjs/honk';
import silence from '@honkjs/silence';

const honk = new Honk().use(silence()).honk;

honk(); // output: Nothing. Just the silence of your cold, dead heart.
```

[Would you like to know more?](https://github.com/honkjs/silence)

# FAQ

### Honk?

HONK 🚚 HONK

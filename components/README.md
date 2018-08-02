# honkjs/components

A wrapper for choo [nanocomponents](https://github.com/choojs/nanocomponent).

This is probably the most opinionated of the basic honk middlewares.

# Basics

```ts
import Honk from '@honkjs/honk';
import components from '@honkjs/components';
import html from 'nanohtml';

const honk = new Honk().use(components()).honk;

type HonkButtonProps = { name: string, onClick: () => void }

// Unlike nanocomponent, honk components have a single property type
class HonkButton : Component<HonkButtonProps> {
  constructor(private id) {
    super(id);
  }

create(honk, { name, onClick }: HonkButtonProps) {
    // honk is passed as the first argument to the create function
    // this makes it easy to create sub components
    return html`<button onclick=${onClick}>${name}</button>`;
  }
}

// To use honk to create a component, you need a creator function.
// The function takes honk services as the first parameter, id as the second,
// and returns the new component
function createHonkButton({ honk }: IHonkServices, id: string) {
  return new HonkButton(id);
}

// The third argument type will be inferred by typescript to be HonkButtonProps
// If you try to put in invalid properties for the component creator function, it will throw an error
const honker = html`<div>Click this: ${honk(createHonkButton, 'HONK', { onClick: honk })}</div>`;
//  *CLICK*  output: "HONK 🚚 HONK"
```

Id must be unique throughout the application.

# Using with choo

[still in transit 🚚]

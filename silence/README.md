# honkjs/silence

Because you hate honking.

```ts
import Honk from '@honkjs/honk';
import silence from '@honkjs/silence';

const honk = new Honk().use(silence()).honk;

honk(); // output: Nothing. Just the silence of your cold, dead heart.
```

# Concepts

This repo can be used as quick example of how to build a 'catch all' middleware. Chances are in a production app you don't want missed dispatches to randomly output "HONK 🚚 HONK" to the console, so you should create a new 'default' middleware that's first in the pipeline to catch these with whatever default behavior you want.

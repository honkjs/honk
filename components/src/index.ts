import NanoComponent from 'nanocomponent';
import { IHonk, IHonkMiddlewareCreator } from '@honkjs/honk';
import { shallowEqual } from './util';

declare module '@honkjs/honk' {
  interface IHonk {
    <P, C extends Component<P>>(creator: IComponentCreator<P, C>, id: string, props?: P): HTMLElement;
  }
}

export interface IComponentCache {
  get: (id: string) => NanoComponent;
  set: (id: string, component: NanoComponent) => void;
  remove: (id: string) => void;
}

export interface IComponentCreator<P, C extends Component<P>> {
  (services: any, id: string): C;
}

export abstract class Component<P> extends NanoComponent {
  prev!: P;

  createElement(honk: IHonk, props: P): HTMLElement {
    this.prev = props;
    return this.create(honk, props);
  }

  abstract create(honk: IHonk, props: P): HTMLElement;

  update(props: P) {
    return !shallowEqual(this.prev, props);
  }
}

export function createCache(): IComponentCache {
  // stupid simple default cache lookup
  const cache: any = {};

  function get(id: string) {
    return cache[id];
  }

  function set(id: string, component: any) {
    cache[id] = component;
  }
  function remove(id: string) {
    delete cache[id];
  }

  return {
    get,
    set,
    remove,
  };
}

export default function createMiddleware(cache: IComponentCache = createCache()): IHonkMiddlewareCreator {
  return (app, next) => {
    function createComponent<P, C extends Component<P>>(creator: IComponentCreator<P, C>, id: string, props?: P) {
      // retrieve or add the component
      let comp = cache.get(id);
      if (!comp) {
        comp = creator(app.services, id);
        cache.set(id, comp);
      }

      if (!comp.unload) {
        // if not overriden, will unload automatically
        comp.unload = () => cache.remove(id);
      }

      return comp.render(app.services.honk, props);
    }

    return (args) => {
      if ((args.length === 3 || args.length === 2) && typeof args[0] === 'function' && typeof args[1] === 'string') {
        return createComponent(args[0], args[1], args[2]);
      }
      return next(args);
    };
  };
}

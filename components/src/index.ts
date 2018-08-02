import { IHonkMiddlewareCreator } from '@honkjs/honk';

declare module '@honkjs/honk' {
  interface IHonk {
    <P>(creator: IHonkComponentCreator<P>, props?: P): HTMLElement;
  }
}

export interface IComponentCache {
  get: (id: string) => IComponent;
  set: (id: string, component: IComponent) => void;
  remove: (id: string) => void;
}

export interface IComponent {
  unload?: (el: HTMLElement) => void;
  render: (args: any) => HTMLElement;
}

export interface IComponentCreator<P> {
  (services: any, id: string, props: P): IComponent;
}

export interface IMapComponentPropsToId<P> {
  (props: P): string;
}

export interface IHonkComponentCreator<P> {
  (cache: IComponentCache, services: any, props: P): HTMLElement;
  component: string;
}

export function createCache(): IComponentCache {
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

// can pull the id from props
export function createHonkComponent<P extends { id: string }>(
  name: string,
  creator: IComponentCreator<P>
): IHonkComponentCreator<P>;

// has to pull from the creator function
export function createHonkComponent<P>(
  name: string,
  creator: IComponentCreator<P>,
  mapPropsToId: IMapComponentPropsToId<P>
): IHonkComponentCreator<P>;

export function createHonkComponent<P>(
  name: string,
  creator: IComponentCreator<P>,
  mapPropsToId: IMapComponentPropsToId<P> = getDefaultId
): IHonkComponentCreator<P> {
  const honkCompCreator = <IHonkComponentCreator<P>>function(cache: IComponentCache, services: any, props: P) {
    const id = mapPropsToId(props);

    if (!id) {
      throw new Error('An ID must be specified to create component ' + name);
    }

    // id's are "name:id", so components don't have to be globally unique
    const uid = name + ':' + id;

    let comp = cache.get(uid);
    if (!comp) {
      comp = creator(services, uid, props);

      // override unload behavior to remove from cache
      // but still call any other behaviors as appropriate
      let unload = comp.unload;
      comp.unload = (el) => {
        unload && unload.apply(comp, el);
        cache.remove(uid);
      };
      cache.set(uid, comp);
    }
    return comp.render(props);
  };

  // add a property flag to the creator function
  // this allows it to be more accurately id'd by the middleare
  honkCompCreator.component = name;

  return honkCompCreator;
}

function getDefaultId(props: any) {
  return props.id;
}

export default function createMiddleware(cache: IComponentCache = createCache()): IHonkMiddlewareCreator {
  return (app, next) => {
    return (args) => {
      if (args.length === 2 && typeof args[0] === 'function' && args[0].component && typeof args[1] === 'object') {
        const creator: IHonkComponentCreator<any> = args[0];
        return creator(cache, app.services, args[1]);
      }
      return next(args);
    };
  };
}

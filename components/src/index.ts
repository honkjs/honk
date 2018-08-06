import { IHonkMiddlewareCreator } from '@honkjs/honk';

declare module '@honkjs/honk' {
  interface IHonk {
    /**
     * Gets a component from cache or creates it.
     *
     * @template P The type of component props
     * @param {IHonkComponentCreator<P>} creator A function that creates the new component
     * @param {P} props The props required to initialize the component.
     * @returns {HTMLElement} The resulting html element after being rendered.
     */
    <P, C extends IComponent>(creator: IHonkComponentCreator<P, C>, props: P): HTMLElement;
  }
}

/**
 * Describes a simple cache
 */
export interface IComponentCache {
  get: (id: string) => IComponent;
  set: (id: string, component: IComponent) => void;
  remove: (id: string) => void;
}

/**
 * The required interface of the component.
 * Note: unload will be overwritten to also handle unloading from cache.
 */
export interface IComponent {
  unload?: (el: HTMLElement) => void;
  render: (args: any) => HTMLElement;
}

/**
 * Describes a function that creates a component.
 *
 * @export
 * @interface IComponentCreator
 * @template P
 */
export interface IComponentCreator<P, C extends IComponent> {
  /**
   * A function that creates components.
   *
   * @template P Type of component props
   * @param {any} services The honk services
   * @param {string} id The prefixed id used to cache this component
   * @param {P} props The initial props object
   * @returns {IComponent}
   */
  (services: any, id: string, props: P): C;
}

/**
 * A function that maps the component props to an ID string.
 *
 * @export
 * @interface IMapComponentPropsToId
 * @template P The type of props
 */
export interface IMapComponentPropsToId<P> {
  (props: P): string;
}

/**
 * A function that can be used by honk to get or create the component.
 *
 * @export
 * @interface IHonkComponentCreator
 * @template P
 */
export interface IHonkComponentCreator<P, C extends IComponent> {
  (cache: IComponentCache, services: any, props: P): C;

  /**
   * The name of this component.
   */
  component: string;
}

/**
 * Creates a simple component cache.
 *
 * @export
 * @returns {IComponentCache}
 */
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

/**
 * Creates a {IHonkComponentCreator} used to initialize a component.
 *
 * @export
 * @template P The prop type for this component.  Must include an 'id: string' field.
 * @param {string} name The name of this component.  Will be prefixed to IDs when caching.
 * @param {IComponentCreator<P>} creator The creator function to generate the component.
 * @returns {IHonkComponentCreator<P>}
 */
export function createHonkComponent<P extends { id: string }, C extends IComponent>(
  name: string,
  creator: IComponentCreator<P, C>
): IHonkComponentCreator<P, C>;

/**
 * Creates a {IHonkComponentCreator} used to initialize a component.
 *
 * @export
 * @template P The prop type for this component.
 * @param {string} name The name of this component.  Will be prefixed to IDs when caching.
 * @param {IComponentCreator<P>} creator The creator function to generate the component.
 * @param {IMapComponentPropsToId<P>} mapPropsToId A function to map the props to a string Id
 * @returns {IHonkComponentCreator<P>}
 */
export function createHonkComponent<P, C extends IComponent>(
  name: string,
  creator: IComponentCreator<P, C>,
  mapPropsToId: IMapComponentPropsToId<P>
): IHonkComponentCreator<P, C>;

export function createHonkComponent<P, C extends IComponent>(
  name: string,
  creator: IComponentCreator<P, C>,
  mapPropsToId: IMapComponentPropsToId<P> = getDefaultId
): IHonkComponentCreator<P, C> {
  const honkCompCreator = <IHonkComponentCreator<P, C>>function(cache: IComponentCache, services: any, props: P) {
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
    return comp;
  };

  // add a property flag to the creator function
  // this allows it to be more accurately identified by the middleare
  honkCompCreator.component = name;

  return honkCompCreator;
}

function getDefaultId(props: any) {
  return props.id;
}

/**
 * Creates a component caching middleware to be used with honk.
 *
 * @export
 * @param {IComponentCache} [cache=createCache()] Optional cache to be used by the middleware.
 * @returns {IHonkMiddlewareCreator}
 */
export default function createMiddleware(cache: IComponentCache = createCache()): IHonkMiddlewareCreator {
  return (app, next) => {
    return (args) => {
      if (args.length === 2 && typeof args[0] === 'function' && args[0].component) {
        const creator: IHonkComponentCreator<any, IComponent> = args[0];
        const props = args[1];
        return creator(cache, app.services, props).render(props);
      }
      return next(args);
    };
  };
}

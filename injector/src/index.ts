import { IHonkMiddlewareCreator } from '@honkjs/honk';

declare module '@honkjs/honk' {
  interface IHonk {
    /**
     * Runs the specified action, injecting any honk services into it,
     * and returning the results.
     *
     * @template T The return value type.  May be void.
     * @param {(services: any) => T} action A function that accepts services.
     * @returns {T} Any results from the action function.
     */
    <T>(action: (services: any) => T): T;
  }
}

/**
 * Creates a middleware to add injector to honk.
 */
export default function createMiddleware(): IHonkMiddlewareCreator {
  return (app, next) => (args) => {
    // one argument of type function = call it, passing in services
    if (args.length === 1 && typeof args[0] === 'function') {
      return args[0](app.services);
    }
    return next(args);
  };
}

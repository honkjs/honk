import { IHonkMiddlewareCreator } from '@honkjs/honk';

/**
 * Creates a middleware that can be used to silence honk output.
 */
export default function createMiddleware(): IHonkMiddlewareCreator {
  return (app, next) => (args) => {
    // *sad honk*
  };
}

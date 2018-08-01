import { IHonkMiddlewareCreator } from '@honkjs/honk';

export default function createMiddleware(): IHonkMiddlewareCreator {
  return (app, next) => (args) => {
    // *sad honk*
  };
}

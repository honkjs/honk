import { IHonkMiddlewareCreator } from '@honkjs/honk';

declare module '@honkjs/honk' {
  interface IHonk {
    (services: any): void;
    <T>(services: any): T;
  }
}

export default function createMiddleware(): IHonkMiddlewareCreator {
  return (app, next) => (args) => {
    // one argument of type function = call it, passing in services
    if (args.length === 1 && typeof args[0] === 'function') {
      return args[0](app.services);
    }
    return next(args);
  };
}

export interface IHonk {
  (): void;
}

export interface IHonkServices {
  honk: IHonk;
}

export interface IHonkApp {
  services: any;
}

export interface IHonkMiddleware {
  (args: IArguments): any;
}

export interface IHonkMiddlewareCreator {
  (app: IHonkApp, next: IHonkMiddleware): IHonkMiddleware;
}

export default class Honk {
  private next: IHonkMiddleware;

  private app: IHonkApp;

  public honk: IHonk;

  constructor() {
    this.next = () => console.log('HONK 🚚 HONK');

    const self = this;
    this.honk = function() {
      return self.next(arguments);
    };

    this.app = {
      services: {
        honk: this.honk,
      },
    };
  }

  use(middleware: IHonkMiddlewareCreator) {
    this.next = middleware(this.app, this.next);
    return this;
  }
}

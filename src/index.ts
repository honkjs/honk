/**
 * Honk, because by default, that is all that it does.
 */
export interface IHonk {
  /**
   * 'HONK 🚚 HONK'
   */
  (): void;
}

/**
 * The shared honk application context.
 * Used to share information between middlewares.
 */
export interface IHonkContext {
  honk: IHonk;
  [key: string]: any;
}

/**
 * A honk function middleware.  Adds new functionality to {IHonk}.
 */
export interface IHonkMiddleware {
  /**
   * A function that parses the function arguments passed in
   * and returns the results.
   *
   * @param {IArguments} args The function arguments passed into honk.
   */
  (args: IArguments): any;
}

/**
 * A middleware creator function.
 */
export interface IHonkMiddlewareCreator {
  /**
   * A function that adds functionality to honk.
   *
   * @param {IHonkContext} app The shared honk context.
   * @param {IHonkMiddleware} next The next middleware in the chain.
   * @returns {IHonkMiddleware} The new base middleware function.
   */
  (app: IHonkContext, next: IHonkMiddleware): IHonkMiddleware;
}

/**
 * Honk!
 */
export default class Honk {
  private next: IHonkMiddleware;

  private app: IHonkContext;

  /**
   * The honk function that can be called to send arguments through the middlewares.
   *
   * @type {IHonk}
   * @memberof Honk
   */
  public honk: IHonk;

  /**
   * Creates an instance of Honk.
   * @memberof Honk
   */
  constructor() {
    this.next = () => console.log('HONK 🚚 HONK'); // because by default that's all that it does.

    const self = this;

    this.honk = function() {
      return self.next(arguments);
    };

    this.app = { honk: self.honk };
  }

  /**
   * Adds a middleware to the honk pipeline.
   * Wraps previous middlewares.
   *
   * @param {IHonkMiddlewareCreator} middleware The new middleware creator.
   * @returns This honk instance, allowing use() to be chained.
   * @memberof Honk
   */
  use(middleware: IHonkMiddlewareCreator) {
    this.next = middleware(this.app, this.next);
    return this;
  }
}

import { IHonkMiddlewareCreator } from '@honkjs/honk';

export default function createStoreMiddleware<S>(state: S): IHonkMiddlewareCreator {
  const store = createStore(state);
  return (app, next) => {
    app.services = {
      store,
      ...app.services,
    };
    return next;
  };
}

export interface ISubscribe<S> {
  (state: S): void;
}

export interface IUnsubscribe {
  (): void;
}

export interface IHonkStore<S> {
  setState(action: (state: S) => S): S;
  getState(): Readonly<S>;
  subscribe(listener: ISubscribe<S>): IUnsubscribe;
}

export function createStore<S>(initialState: S): IHonkStore<S> {
  let state = initialState;
  let currentListeners: ISubscribe<S>[] = [];
  let nextListeners: ISubscribe<S>[] = [];

  function prepNextListeners() {
    // keep two copies so things can subscribe/unsubscribe during
    // the subscription events.
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function setState(action: (State: S) => S) {
    state = action(state);
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](state);
    }
    return state;
  }

  function getState() {
    return state;
  }

  function subscribe(listener: ISubscribe<S>): IUnsubscribe {
    prepNextListeners();

    nextListeners.push(listener);

    let isSubscribed = true;
    return function usubscribe() {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      const i = nextListeners.indexOf(listener);
      nextListeners.splice(i, 1);
    };
  }

  return {
    setState,
    getState,
    subscribe,
  };
}

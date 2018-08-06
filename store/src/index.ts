/**
 * A listener function to call whenever the state changes.
 */
export interface ISubscribe<S> {
  (state: S): void;
}

/**
 * A function that will unsubscribe the listener
 */
export interface IUnsubscribe {
  (): void;
}

/**
 * A subscribable store.
 *
 * @export
 * @interface IHonkStore
 * @template S The type state object
 */
export interface IHonkStore<S> {
  /**
   * Updates the state and alerts all listeners.
   *
   * @param {(state: S) => S} action The state update action.
   * @returns {S} The current state as Readonly<S>
   * @memberof IHonkStore
   */
  setState(action: (state: S) => S): Readonly<S>;

  /**
   * Retrieves the current state from the store.
   *
   * @returns {Readonly<S>} The current state, flagged "Readonly" in typescript.
   * @memberof IHonkStore
   */
  getState(): Readonly<S>;

  /**
   * Subscribes to the store
   *
   * @param {ISubscribe<S>} listener The listening action callback for when the state is set.
   * @returns {IUnsubscribe} The unsubscribe function to stop listening for changes.
   * @memberof IHonkStore
   */
  subscribe(listener: ISubscribe<S>): IUnsubscribe;
}

/**
 * Creates a store from a default state.
 *
 * @export
 * @template S The state type
 * @param {S} initialState The initial state data
 * @returns {IHonkStore<S>}
 */
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

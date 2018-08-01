declare module 'nanocomponent' {
  export default interface Component {
    beforerender?(el: HTMLElement): void;
    load?(el: HTMLElement): void;
    unload?(el: HTMLElement): void;
    afterupdate?(el: HTMLElement): void;
    afterreorder?(el: HTMLElement): void;
  }

  export default abstract class Component {
    constructor(id?: string);
    render(...args: any[]): HTMLElement;
    rerender(): void;
    element: HTMLElement;
    id: string;
    abstract createElement(...args: any[]): HTMLElement;
    abstract update(...args: any[]): boolean;
  }
}

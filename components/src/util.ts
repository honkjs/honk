export function shallowEqual(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(b, keysA[i]) || !(a[keysA[i]] === b[keysA[i]])) {
      return false;
    }
  }
  return true;
}

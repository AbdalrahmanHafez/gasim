export const assert = (condition, message) => {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
};

export function deepFreeze(object) {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

export function isNumber(Object) {
  if (typeof Object === "number") {
    return true;
  }

  if (typeof Object === "string") {
    return !isNaN(+Object);
  }

  return false;
}

export function capitalizeFirst(stringInput) {
  return (
    stringInput.charAt(0).toUpperCase() + stringInput.slice(1).toLowerCase()
  );
}

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

export function setCookie(cName, cValue, expDays) {
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split("; ");
  let res;
  cArr.forEach((val) => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}

export function localSetItem(itemKey, itemValue) {
  localStorage.setItem(itemKey, JSON.stringify(itemValue));
}

export function localGetItem(itemKey) {
  return JSON.parse(localStorage.getItem(itemKey));
}

function determineEnviroment() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    // dev code
    return "development";
  } else {
    // production code
    return "production";
  }
}

export const isProduction = () => {
  return determineEnviroment() === "production";
};

export const isDevelopement = () => {
  return determineEnviroment() === "development";
};

export const assert = (condition, message) => {
  if (!condition) {
    if (message) throw new Error(message);
    else throw new Error("Assertion failed");
  }
};

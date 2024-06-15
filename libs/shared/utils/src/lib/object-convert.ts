/**
 * The `convertToNestedObject` function takes an object with dot-separated keys and converts it into a nested object structure.
 * @param {any} obj - The `obj` parameter is an object that you want to convert into a nested object. It can contain keys with dot notation, indicating nested properties. For example:
 * @returns The function `convertToNestedObject` returns a nested object.
 */
export const convertToNestedObject = (obj: any) => {
  const result = {};

  for (const key in obj) {
    const parts = key.split('.');
    let currentObj: any = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        // Last part of the key, assign the value
        if (part.includes('[') && part.includes(']')) {
          const [prop, index] = part.split(/[[\]]/).filter(Boolean);
          currentObj[prop] = currentObj[prop] || [];
          currentObj = currentObj[prop];
          currentObj[index] = parseInt(obj[key]); // Convert value to number if needed
        } else {
          currentObj[part] = parseInt(obj[key]); // Convert value to number if needed
        }
      } else {
        if (part.includes('[') && part.includes(']')) {
          const [prop, index] = part.split(/[[\]]/).filter(Boolean);
          currentObj[prop] = currentObj[prop] || [];
          currentObj = currentObj[prop];
          currentObj[index] = currentObj[index] || {};
          currentObj = currentObj[index];
        } else {
          currentObj[part] = currentObj[part] || {};
          currentObj = currentObj[part];
        }
      }
    }
  }

  return result;
};

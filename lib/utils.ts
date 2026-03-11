type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassArray = ClassValue[];
type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassDictionary
  | ClassArray;

function toClassNames(value: ClassValue, classes: string[]) {
  if (!value) return;

  if (typeof value === "string" || typeof value === "number") {
    classes.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => toClassNames(item, classes));
    return;
  }

  Object.entries(value).forEach(([key, enabled]) => {
    if (enabled) classes.push(key);
  });
}

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  inputs.forEach((input) => toClassNames(input, classes));
  return classes.join(" ");
}

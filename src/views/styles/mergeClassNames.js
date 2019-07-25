import cn from 'classnames';

export default function mergeClassNames(target, ...sources) {
  for (const source of sources) {
    const keys = Object.keys(source);
    for (const key of keys) {
      target[key] = cn(target[key], source[key]);
    }
  }

  return target;
}
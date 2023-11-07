import { type HTMLElement, parse } from 'node-html-parser';

export default function parseAttributes(
  element: string,
): Record<string, string> {
  if (!element) {
    return {};
  }

  const root = parse(element.replace(/[\r\n]+/g, ' '));
  if (!root?.firstChild) {
    return {};
  }

  const node = root.firstChild as HTMLElement;
  if (!node?.attributes) {
    return {};
  }

  return Object.entries(node.attributes).reduce<Record<string, string>>(
    (rv, [attr, val]) => {
      rv[attr] = val === '' ? attr : val; // so empty value attributes can be truthy
      return rv;
    },
    {},
  );
}

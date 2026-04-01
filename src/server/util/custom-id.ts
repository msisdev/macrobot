const prefixes = {
  accept_button: 'accept_button',
  decline_button: 'decline_button',
} as const;

export function parse(str: string): PrefixKey | null {
  const [prefix] = str.split('::')

  Object.entries(prefixes).forEach(([key, value]) => {
    if (prefix === value) {
      return key as PrefixKey;
    }
  })

  return null;
}

export function create(prefix: PrefixKey, id: string): string {
  return `${prefix}::${id}`
}

export type PrefixKey = keyof typeof prefixes;

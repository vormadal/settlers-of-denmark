export function generate<T>(count: number, create: (i: number) => T) {
  return Array.from({ length: count }, (_, i) => i).map(create)
}

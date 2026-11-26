/** "14 tools", "1 suite": a count and its unit, pluralised. */
export function countLabel(count: number, unit: string): string {
  return `${count} ${unit}${count === 1 ? '' : 's'}`
}

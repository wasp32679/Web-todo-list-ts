export function getCurrentDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function getFutureDateString(daysAhead: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysAhead)
  return date.toISOString().slice(0, 10)
}

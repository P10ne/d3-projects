export function getDateFromSimple(simpleString: string): Date {
  const [year, month, day] = simpleString.split('-').map(item => Number.parseInt(item));
  const date = new Date(year, month - 1, day);
  return date;
}

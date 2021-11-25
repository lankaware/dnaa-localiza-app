export const DaysOfWeek = [
  {
    value: 1,
    label: 'domingo'
  },
  {
    value: 2,
    label: 'segunda-feira'
  },
  {
    value: 3,
    label: 'terça-feira'
  },
  {
    value: 4,
    label: 'quarta-feira'
  },
  {
    value: 5,
    label: 'quinta-feira'
  },
  {
    value: 6,
    label: 'sexta-feira'
  },
  {
    value: 7,
    label: 'sábado'
  },
]

export function dayOfWeekLabel (dayNumber) {
  return DaysOfWeek[(dayNumber - 1)].label
}

export function dayOfWeekIndex (weekName) {
  const indWeek = DaysOfWeek.findIndex((item) => { return item.label === weekName })
  return DaysOfWeek[(indWeek || 0)].value
}


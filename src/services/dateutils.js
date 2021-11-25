
export function dateBr(argDate) {
  if (!argDate) return ''
  const tempDate = new Date(argDate)
  // return tempDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  return tempDate.toLocaleDateString()
}

export function timeBr(argTime) {
  if (!argTime) return ''
  const tempDate = new Date(argTime)
  // return tempDate.toLocaleTimeString('pt-BR', { timeZone: 'UTC' })
  return tempDate.toLocaleTimeString()
}

export function defaultDateBr() {
  const dateDefault = new Date()
  const tempDate = dateDefault.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const stringDate = tempDate.substr(6,4)+'-'+tempDate.substr(3,2)+'-'+tempDate.substr(0,2)
  return stringDate
}

export function dateISO(parmDate) {
  const stringDate = parmDate.substr(6,4)+'-'+parmDate.substr(3,2)+'-'+parmDate.substr(0,2)
  return stringDate
}

export function prettyDate(parmDate) {
  if (!parmDate) return null
  const stringDate = parmDate.substr(8,2) + '/' + parmDate.substr(5,2) + '/' + parmDate.substr(0,4)
  return stringDate
}



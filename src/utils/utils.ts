export function isEmpty(obj: object): boolean {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false
  }

  return true
}

export function isEmail(mail: string): boolean {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}

export function formatedDate(date: string): string {
  const formated = new Date(date)

  return formated.toLocaleDateString()
}

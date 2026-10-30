export interface User {
  email: string
  name: string
}

const capitalize = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1)

export function userFromEmail(email: string): User {
  const name = email.split('@')[0].split(/[._-]/).filter(Boolean).map(capitalize).join(' ')
  return { email, name: name || email }
}

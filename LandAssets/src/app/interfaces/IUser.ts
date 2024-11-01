export default interface IUser{
  userId?: number
  nome: string
  email: string
  password: string
  type: 'client' | 'admin' | 'guest'
  // type?: 'guest' | 'client'
}

export interface IUserGuest{
  type: 'guest'
  // admin: boolean
  // type?: 'guest' | 'client'
}

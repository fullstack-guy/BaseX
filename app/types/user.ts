export interface UserInterface {
  id: string
  name?: string
  username?: string
  email: string
  bio?: string
  avatar_url?: string
}

export const INITIAL_USER_DATA = {
  id: "",
  email: ""
}

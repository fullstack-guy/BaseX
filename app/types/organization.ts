export interface OrgInterface {
  id: string
  name: string
  creator: string
  description?: string
  handle?: string
  logo_url?: string
  meta?: string
}

export const INITIAL_ORG_DATA = {
  id: "",
  name: "",
  creator: ""
}

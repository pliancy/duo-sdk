export interface Account {
    account_id: string
    api_hostname: string
    name: string
}

export interface CreateAccount {
    name: string
}

export type AccountEdition = 'PERSONAL' | 'ENTERPRISE' | 'BUSINESS' | 'PLATFORM' | 'BEYOND'

export interface AccountEditionResponse {
    edition: AccountEdition
}

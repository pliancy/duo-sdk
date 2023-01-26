import { AxiosInstance } from 'axios'
import { Accounts } from './accounts/accounts'
import { DuoConfig } from './duo.types'
import { createHttpAgent } from './utils/create-http-agent'

export class Duo {
    private readonly httpAgent: AxiosInstance
    accounts: Accounts

    constructor(config: DuoConfig) {
        this.httpAgent = createHttpAgent(config)
        this.accounts = new Accounts(this.httpAgent)
    }
}

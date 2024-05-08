import { AxiosInstance } from 'axios'
import { Accounts } from './accounts/accounts'
import { DuoConfig } from './duo.types'
import { createHttpAgent } from './utils/create-http-agent'
import { Users } from './users/users'
import { Devices } from './devices/devices'

export class Duo {
    private readonly httpAgent: AxiosInstance

    accounts: Accounts

    devices: Devices

    users: Users

    constructor(config: DuoConfig) {
        this.httpAgent = createHttpAgent(config)
        this.accounts = new Accounts(this.httpAgent)
        this.devices = new Devices(this.httpAgent)
        this.users = new Users(this.httpAgent)
    }
}

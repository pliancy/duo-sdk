import { AxiosInstance } from 'axios'
import { Account } from './accounts.types'

export class Accounts {
    constructor(private readonly httpAgent: AxiosInstance) {}

    async getAll(): Promise<Account[]> {
        const { data: res } = await this.httpAgent.post('/accounts/v1/account/list')

        return res.response
    }

    async create(name: string): Promise<Account> {
        const { data: res } = await this.httpAgent.post(
            '/accounts/v1/account/create',
            {},
            {
                params: {
                    name,
                },
            },
        )
        return res.response
    }

    async delete(accountId: string): Promise<void> {
        await this.httpAgent.post(
            '/accounts/v1/account/delete',
            {},
            { params: { account_id: accountId } },
        )
    }
}

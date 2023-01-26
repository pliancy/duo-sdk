import { AxiosInstance } from 'axios'
import { Account, AccountEdition, CreateAccount } from './accounts.types'

export class Accounts {
    constructor(private readonly httpAgent: AxiosInstance) {}

    async getAll(): Promise<Account[]> {
        const { data: res } = await this.httpAgent.post('/accounts/v1/account/list')
        return res.response
    }

    async getById(accountId: string) {
        const accounts = await this.getAll()
        return accounts.find((account) => account.account_id === accountId)
    }

    async getByName(name: string) {
        const accounts = await this.getAll()
        return accounts.find((account) => account.name === name)
    }

    async getAccountEdition(accountId: string) {
        const { data: res } = await this.httpAgent.get('/admin/v1/billing/edition', {
            params: { account_id: accountId },
        })
        return res.response
    }

    async setAccountEdition(accountId: string, edition: AccountEdition) {
        await this.httpAgent.post(
            '/admin/v1/billing/edition',
            {},
            {
                params: {
                    account_id: accountId,
                    edition,
                },
            },
        )
    }

    async create(account: CreateAccount): Promise<Account> {
        const { data: res } = await this.httpAgent.post(
            '/accounts/v1/account/create',
            {},
            {
                params: {
                    ...account,
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

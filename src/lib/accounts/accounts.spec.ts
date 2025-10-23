import { Accounts } from './accounts'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'

describe('Accounts', () => {
    let accounts: Accounts
    const account = {
        account_id: '1',
        api_hostname: 'api.duo.com',
        name: 'Account',
    }

    beforeEach(() => {
        mockAxios.reset()
        accounts = new Accounts(mockAxios as never as AxiosInstance)
    })

    it('to be defined', () => expect(accounts).toBeTruthy())

    it('gets all accounts', async () => {
        const data = {
            response: [account],
        }

        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.getAll()
        expect(res).toEqual([account])
        expect(mockAxios.post).toHaveBeenCalledWith('/accounts/v1/account/list')
    })

    it('gets an account by id', async () => {
        const data = {
            response: [account],
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.getById('1')
        expect(res).toEqual(account)
        expect(mockAxios.post).toHaveBeenCalledWith('/accounts/v1/account/list')
    })

    it('gets an account by name', async () => {
        const data = {
            response: [account],
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.getByName('Account')
        expect(res).toEqual(account)
        expect(mockAxios.post).toHaveBeenCalledWith('/accounts/v1/account/list')
    })

    it('creates an account', async () => {
        const data = {
            response: account,
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.create({ name: 'Account' })
        expect(res).toEqual(account)
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/accounts/v1/account/create',
            {},
            { params: { name: 'Account' } },
        )
    })

    it('updates an account name', async () => {
        const data = {
            response: account,
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.updateName('New Account')
        expect(res).toEqual(account)
        expect(mockAxios.post).toHaveBeenCalledWith(
            `/admin/v1/settings`,
            {},
            { params: { name: 'New Account' } },
        )
    })

    it('deletes an account', async () => {
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: {} })
        await accounts.delete('1')
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/accounts/v1/account/delete',
            {},
            {
                params: { account_id: '1' },
            },
        )
    })

    it('gets an account edition', async () => {
        const data = {
            response: 'PERSONAL',
        }
        jest.spyOn(mockAxios, 'get').mockResolvedValue({ data })
        const res = await accounts.getAccountEdition('1')
        expect(res).toEqual('PERSONAL')
        expect(mockAxios.get).toHaveBeenCalledWith('/admin/v1/billing/edition', {
            params: { account_id: '1' },
        })
    })

    it('sets an account edition', async () => {
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data: {} })
        await accounts.setAccountEdition('1', 'ENTERPRISE')
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/admin/v1/billing/edition',
            {},
            {
                params: {
                    account_id: '1',
                    edition: 'ENTERPRISE',
                },
            },
        )
    })
})

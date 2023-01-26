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

    it('creates an account', async () => {
        const data = {
            response: account,
        }
        jest.spyOn(mockAxios, 'post').mockResolvedValue({ data })
        const res = await accounts.create('Account')
        expect(res).toEqual(account)
        expect(mockAxios.post).toHaveBeenCalledWith(
            '/accounts/v1/account/create',
            {},
            { params: { name: 'Account' } },
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
})

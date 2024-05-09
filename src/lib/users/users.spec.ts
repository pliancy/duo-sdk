import { Users } from './users'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import { DuoUser } from './users.types'

describe('Users', () => {
    let users: Users
    const duoUsers = [{ user_id: '1' }, { user_id: '2' }, { user_id: '3' }] as never as DuoUser[]

    beforeEach(() => {
        mockAxios.reset()
        users = new Users(mockAxios as never as AxiosInstance)
    })

    it('creates the instance', () => expect(users).toBeTruthy())

    describe('getAll', () => {
        assertFailure('getAll', 'get')

        it('gets all users', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { response: duoUsers },
            })
            await expect(users.getAll()).resolves.toEqual(duoUsers)
        })
    })

    describe('getByUsername', () => {
        assertFailure('getByUsername', 'get', 'user')

        it('gets a user by username', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { response: [duoUsers[0]] },
            })
            await expect(users.getByUsername('user')).resolves.toEqual(duoUsers[0])
        })
    })

    describe('updateByUsername', () => {
        assertFailure('updateByUsername', 'post', 'user')

        it('updates a user by username', async () => {
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { response: duoUsers[0] },
            })
            await expect(users.updateByUsername('user', {} as never)).resolves.toEqual(duoUsers[0])
        })
    })

    describe('create', () => {
        assertFailure('create', 'post', 'user')

        it('creates a user', async () => {
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { response: duoUsers[0] },
            })
            await expect(users.create({} as never)).resolves.toEqual(duoUsers[0])
        })
    })

    describe('removeByUsername', () => {
        assertFailure('removeByUsername', 'delete', 'user')

        it('deletes a user', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { stat: 'OK', response: [duoUsers[0]] },
            })
            jest.spyOn(mockAxios, 'delete').mockResolvedValue({
                data: { response: '' },
            })
            await expect(users.removeByUsername('user')).resolves.toEqual('')
            expect(mockAxios.get).toHaveBeenCalledWith('/admin/v1/users', {
                params: { username: 'user' },
            })
        })
    })

    describe('associateDevice', () => {
        assertFailure('associateDevice', 'post', '1', '2')

        it('associates the user with the device', async () => {
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { stat: 'OK' },
            })
            await expect(users.associateDevice('1', '1')).resolves.toEqual('OK')
        })
    })

    describe('createBypassCodes', () => {
        assertFailure('createBypassCodes', 'post', 'user', 1, 1, 1)

        it('associates the user with the device', async () => {
            const response = ['code', 'code']
            const count = 1
            const valid_for = 1
            const reuse_count = 1
            const username = 'user'

            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { response },
            })
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { stat: 'OK', response: [duoUsers[0]] },
            })

            await expect(
                users.createBypassCodes(username, count, valid_for, reuse_count),
            ).resolves.toEqual(response)

            expect(mockAxios.get).toHaveBeenCalledWith('/admin/v1/users', { params: { username } })
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/admin/v1/users/1/bypass_codes',
                {},
                { params: { count, reuse_count, valid_for } },
            )
        })
    })

    describe('sync', () => {
        assertFailure('sync', 'post', 'user', 'key')

        it('syncs the user', async () => {
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { stat: 'OK', response: { user: duoUsers[0] } },
            })
            await expect(users.sync('user', 'key')).resolves.toEqual(duoUsers[0])
        })
    })

    function assertFailure(classMethod: keyof Users, requestMethod: any, ...args: any[]) {
        it('fails given stat === "FAIL"', async () => {
            const errorResponse = { stat: 'FAIL', message: 'fail', message_detail: 'it failed' }

            jest.spyOn(mockAxios, requestMethod).mockRejectedValue({
                data: errorResponse,
            } as never)
            try {
                // @ts-ignore
                await users[classMethod](args)
                expect(true).toBe(true)
            } catch (e) {
                expect(e).toEqual({ data: errorResponse })
            }
        })
    }
})

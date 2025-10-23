import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import { Groups } from './groups'
import { DuoGroup } from './groups.types'

describe('Groups', () => {
    let groups: Groups

    const duoGroups = [
        { group_id: '1', name: 'Admins' },
        { group_id: '2', name: 'Engineering' },
        { group_id: '3', name: 'Support' },
    ] as never as DuoGroup[]

    beforeEach(() => {
        mockAxios.reset()
        groups = new Groups(mockAxios as never as AxiosInstance)
    })

    it('creates the instance', () => expect(groups).toBeTruthy())

    describe('getByName', () => {
        assertFailure('getByName', 'get', 'Admins')

        it('returns null when no group is found', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { stat: 'OK', response: duoGroups },
            })
            await expect(groups.getByName('NonExistent')).resolves.toBeNull()
            expect(mockAxios.get).toHaveBeenCalledWith('/admin/v1/groups')
        })

        it('returns a group by name', async () => {
            jest.spyOn(mockAxios, 'get').mockResolvedValue({
                data: { stat: 'OK', response: duoGroups },
            })
            await expect(groups.getByName('Engineering')).resolves.toEqual(duoGroups[1])
            expect(mockAxios.get).toHaveBeenCalledWith('/admin/v1/groups')
        })
    })

    describe('create', () => {
        assertFailure('create', 'post', { name: 'New Group' })

        it('creates a group', async () => {
            const created = { group_id: '10', name: 'New Group' } as DuoGroup
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { stat: 'OK', response: created },
            })
            await expect(groups.create({ name: 'New Group' })).resolves.toEqual(created)
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/admin/v1/groups',
                {},
                { params: { name: 'New Group' } },
            )
        })
    })

    describe('updateByName', () => {
        it('fails given no group is found', async () => {
            jest.spyOn(groups, 'getByName').mockResolvedValue(null)
            await expect(groups.updateByName('Old Name', { name: 'New Group' })).rejects.toThrow(
                'No group with name "Old Name" found',
            )
        })

        it('updates a group', async () => {
            const group = { group_id: '10', name: 'Old Name' } as DuoGroup
            const updated = { group_id: '10', name: 'New Group' } as DuoGroup
            jest.spyOn(groups, 'getByName').mockResolvedValue(group)
            jest.spyOn(mockAxios, 'post').mockResolvedValue({
                data: { stat: 'OK', response: updated },
            })
            await expect(groups.updateByName('Old Name', { name: 'New Group' })).resolves.toEqual(
                updated,
            )
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/admin/v1/groups/10',
                {},
                { params: { name: 'New Group' } },
            )
        })
    })

    function assertFailure(classMethod: keyof Groups, requestMethod: any, ...args: any[]) {
        it('fails given stat === "FAIL"', async () => {
            const errorResponse = { stat: 'FAIL', message: 'fail', message_detail: 'it failed' }

            jest.spyOn(mockAxios, requestMethod).mockRejectedValue({
                data: errorResponse,
            } as never)
            try {
                // @ts-ignore
                await groups[classMethod](...args)
                expect(true).toBe(true)
            } catch (e) {
                expect(e).toEqual({ data: errorResponse })
            }
        })
    }
})

import { AxiosInstance } from 'axios'
import { Policies } from './policies'
import { CreateDuoPolicyPayload, DuoPolicy, UpdateDuoPolicyPayload } from './policies.types'

const mockHttp = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}

describe('Policies', () => {
    let policies: Policies

    const policy: DuoPolicy = {
        policy_key: 'DPXXXXXXXXXXXXXXXXXX',
        policy_name: 'Test Policy',
        is_global_policy: false,
        sections: {
            auth_methods: { allow_primary_duo_factor: true },
        },
    }

    const createPayload: CreateDuoPolicyPayload = {
        policy_name: 'Test Policy',
        sections: {
            auth_methods: { allow_primary_duo_factor: true },
        },
    }

    const updatePayload: UpdateDuoPolicyPayload = {
        sections: { auth_methods: { allow_primary_duo_factor: false } },
        sections_to_delete: ['authorized_networks'],
    }

    beforeEach(() => {
        jest.clearAllMocks()
        policies = new Policies(mockHttp as unknown as AxiosInstance)
    })

    it('creates the instance', () => expect(policies).toBeTruthy())

    it('gets all policies', async () => {
        jest.spyOn(mockHttp, 'get').mockResolvedValue({
            data: { stat: 'OK', response: [policy] },
        })

        await expect(policies.getAll()).resolves.toEqual([policy])
        expect(mockHttp.get).toHaveBeenCalledWith('/admin/v2/policies', undefined)
    })

    it('gets all policies with paging params', async () => {
        jest.spyOn(mockHttp, 'get').mockResolvedValue({
            data: { stat: 'OK', response: [policy] },
        })

        await expect(policies.getAll({ limit: 10, offset: 20 })).resolves.toEqual([policy])
        expect(mockHttp.get).toHaveBeenCalledWith('/admin/v2/policies', {
            params: { limit: 10, offset: 20 },
        })
    })

    it('gets a policy by key', async () => {
        jest.spyOn(mockHttp, 'get').mockResolvedValue({
            data: { stat: 'OK', response: policy },
        })

        await expect(policies.getById(policy.policy_key)).resolves.toEqual(policy)
        expect(mockHttp.get).toHaveBeenCalledWith(`/admin/v2/policies/${policy.policy_key}`)
    })

    it('creates a policy', async () => {
        jest.spyOn(mockHttp, 'post').mockResolvedValue({
            data: { stat: 'OK', response: policy },
        })

        await expect(policies.create(createPayload)).resolves.toEqual(policy)
        expect(mockHttp.post).toHaveBeenCalledWith('/admin/v2/policies', createPayload)
    })

    it('updates a policy', async () => {
        jest.spyOn(mockHttp, 'put').mockResolvedValue({
            data: { stat: 'OK', response: policy },
        })

        await expect(policies.update(policy.policy_key, updatePayload)).resolves.toEqual(policy)
        expect(mockHttp.put).toHaveBeenCalledWith(
            `/admin/v2/policies/${policy.policy_key}`,
            updatePayload,
        )
    })

    it('deletes a policy', async () => {
        jest.spyOn(mockHttp, 'delete').mockResolvedValue({
            data: { stat: 'OK', response: {} },
        })

        await expect(policies.delete(policy.policy_key)).resolves.toEqual({})
        expect(mockHttp.delete).toHaveBeenCalledWith(`/admin/v2/policies/${policy.policy_key}`)
    })

    it('throws when Duo returns a failure response', async () => {
        jest.spyOn(mockHttp, 'get').mockResolvedValue({
            data: { stat: 'FAIL', message: 'fail', message_detail: 'it failed' },
        })

        await expect(policies.getAll()).rejects.toThrow('fail: it failed')
    })
})

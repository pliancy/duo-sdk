import { AxiosInstance } from 'axios'
import mockAxios from 'jest-mock-axios'
import { Integrations } from './integrations'
import {
    CreateDuoIntegrationPayload,
    DuoIntegration,
    DuoIntegrationClientSecret,
    UpdateDuoIntegrationPayload,
} from './integrations.types'

describe('Integrations', () => {
    let integrations: Integrations

    const integration = {
        adminapi_admins: 1,
        adminapi_admins_read: 1,
        adminapi_allow_to_set_permissions: 0,
        adminapi_info: 1,
        adminapi_integrations: 0,
        adminapi_read_log: 1,
        adminapi_read_resource: 1,
        adminapi_settings: 0,
        adminapi_write_resource: 0,
        enroll_policy: '',
        groups_allowed: [],
        integration_key: 'DIXXXXXXXXXXXXXXXXXX',
        name: 'Admin API',
        notes: 'Integration notes',
        secret_key: '************************************1234',
        type: 'adminapi',
        user_access: 'ALL_USERS',
        username_normalization_policy: 'None',
    } as DuoIntegration

    const createPayload: CreateDuoIntegrationPayload = {
        name: 'Admin API',
        notes: 'Integration notes',
        type: 'adminapi',
        user_access: 'ALL_USERS',
        adminapi_info: 1,
        adminapi_read_resource: 1,
    }

    const updatePayload: UpdateDuoIntegrationPayload = {
        greeting: 'Welcome to Duo.',
        notes: 'Updated notes',
        user_access: 'NO_USERS',
    }

    const clientSecret: DuoIntegrationClientSecret = {
        client_secret: 'super-secret',
    }

    beforeEach(() => {
        mockAxios.reset()
        integrations = new Integrations(mockAxios as never as AxiosInstance)
    })

    it('creates the instance', () => expect(integrations).toBeTruthy())

    it('gets integrations with paging params', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: { stat: 'OK', response: [integration] },
        })

        await expect(integrations.getAll({ limit: 10, offset: 20 })).resolves.toEqual([integration])
        expect(mockAxios.get).toHaveBeenCalledWith('/admin/v3/integrations', {
            params: { limit: 10, offset: 20 },
        })
    })

    it('gets an integration by key', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: { stat: 'OK', response: integration },
        })

        await expect(integrations.getById(integration.integration_key)).resolves.toEqual(
            integration,
        )
        expect(mockAxios.get).toHaveBeenCalledWith(
            `/admin/v3/integrations/${integration.integration_key}`,
        )
    })

    it('creates an integration', async () => {
        jest.spyOn(mockAxios, 'post').mockResolvedValue({
            data: { stat: 'OK', response: integration },
        })

        await expect(integrations.create(createPayload)).resolves.toEqual(integration)
        expect(mockAxios.post).toHaveBeenCalledWith('/admin/v3/integrations', createPayload)
    })

    it('updates an integration', async () => {
        jest.spyOn(mockAxios, 'post').mockResolvedValue({
            data: { stat: 'OK', response: integration },
        })

        await expect(
            integrations.update(integration.integration_key, updatePayload),
        ).resolves.toEqual(integration)
        expect(mockAxios.post).toHaveBeenCalledWith(
            `/admin/v3/integrations/${integration.integration_key}`,
            updatePayload,
        )
    })

    it('deletes an integration', async () => {
        jest.spyOn(mockAxios, 'delete').mockResolvedValue({
            data: { stat: 'OK', response: {} },
        })

        await expect(integrations.delete(integration.integration_key)).resolves.toEqual({})
        expect(mockAxios.delete).toHaveBeenCalledWith(
            `/admin/v3/integrations/${integration.integration_key}`,
        )
    })

    it('retrieves an OAuth client secret', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: { stat: 'OK', response: clientSecret },
        })

        await expect(integrations.getOAuthClientSecret('DI123', 'client-123')).resolves.toEqual(
            clientSecret,
        )
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/admin/v3/integrations/oauth_cc/DI123/client_secret/client-123',
        )
    })

    it('retrieves an OIDC client secret', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: { stat: 'OK', response: clientSecret },
        })

        await expect(integrations.getOidcClientSecret('DI123')).resolves.toEqual(clientSecret)
        expect(mockAxios.get).toHaveBeenCalledWith(
            '/admin/v3/integrations/oidc/DI123/client_secret',
        )
    })

    it('throws when Duo returns a failure response', async () => {
        jest.spyOn(mockAxios, 'get').mockResolvedValue({
            data: { stat: 'FAIL', message: 'fail', message_detail: 'it failed' },
        })

        await expect(integrations.getAll()).rejects.toThrow('fail: it failed')
    })
})

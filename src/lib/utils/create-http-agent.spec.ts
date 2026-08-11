import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'
import * as hmac from './hmac'
import { createHttpAgent } from './create-http-agent'

describe('HttpAgent', () => {
    let instance: AxiosInstance
    let signV5Spy: jest.SpyInstance

    const conf = { apiHost: 'foo.bar', integrationKey: 'integrationKey', secretKey: 'secretKey' }
    type MockRequest = {
        method: string
        url: string
        params?: Record<string, unknown>
        data?: unknown
        headers: Record<string, string>
    }

    const getRequestInterceptor = () => {
        const interceptor = mockAxios.interceptors.request.use.mock.calls[0]?.[0]
        expect(interceptor).toBeDefined()
        return interceptor as (request: MockRequest) => MockRequest
    }

    beforeEach(() => {
        mockAxios.reset()
        mockAxios.interceptors.request.clear()
        jest.spyOn(mockAxios, 'create')
        signV5Spy = jest.spyOn(hmac, 'signV5').mockReturnValue('Basic v5-signature')
        instance = createHttpAgent(conf)
    })

    afterEach(() => {
        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: `https://${conf.apiHost}`,
        })
        jest.restoreAllMocks()
    })

    it('creates an axios instance', () => {
        expect(instance).toBeTruthy()
    })

    it('uses v5 signing for all endpoints', () => {
        const interceptor = getRequestInterceptor()
        const request = interceptor({
            method: 'get',
            url: '/admin/v1/users',
            params: { username: 'alice', ignored: undefined },
            headers: {},
        })

        expect(signV5Spy).toHaveBeenCalledWith(
            conf.integrationKey,
            conf.secretKey,
            'GET',
            conf.apiHost,
            '/admin/v1/users',
            { username: 'alice' },
            expect.any(String),
            '',
        )
        expect(request.headers.Authorization).toBe('Basic v5-signature')
        expect(request.headers.Date).toEqual(expect.any(String))
    })

    it('uses v5 signing for integrations list requests', () => {
        const interceptor = getRequestInterceptor()
        const request = interceptor({
            method: 'get',
            url: '/admin/v3/integrations',
            params: { account_id: 'DA123', limit: 10, offset: undefined },
            headers: {},
        })

        expect(signV5Spy).toHaveBeenCalledWith(
            conf.integrationKey,
            conf.secretKey,
            'GET',
            conf.apiHost,
            '/admin/v3/integrations',
            { account_id: 'DA123', limit: 10 },
            expect.any(String),
            '',
        )
        expect(request.headers.Authorization).toBe('Basic v5-signature')
        expect(request.headers.Date).toEqual(expect.any(String))
    })

    it('uses v5 signing for legacy integrations secret requests', () => {
        const interceptor = getRequestInterceptor()
        const request = interceptor({
            method: 'get',
            url: '/admin/v1/integrations/DI123/skey',
            headers: {},
        })

        expect(signV5Spy).toHaveBeenCalledWith(
            conf.integrationKey,
            conf.secretKey,
            'GET',
            conf.apiHost,
            '/admin/v1/integrations/DI123/skey',
            {},
            expect.any(String),
            '',
        )
        expect(request.headers.Authorization).toBe('Basic v5-signature')
        expect(request.headers.Date).toEqual(expect.any(String))
    })

    it('uses v5 signing with the serialized JSON body for POST requests', () => {
        const interceptor = getRequestInterceptor()
        const payload = { name: 'Admin API', type: 'adminapi' }
        const request = interceptor({
            method: 'post',
            url: '/admin/v3/integrations',
            params: { account_id: 'DA123' },
            data: payload,
            headers: {},
        })

        expect(signV5Spy).toHaveBeenCalledWith(
            conf.integrationKey,
            conf.secretKey,
            'POST',
            conf.apiHost,
            '/admin/v3/integrations',
            { account_id: 'DA123' },
            expect.any(String),
            JSON.stringify(payload),
        )
        expect(request.headers.Authorization).toBe('Basic v5-signature')
    })

    it('uses v5 signing for bypass code generation', () => {
        const interceptor = getRequestInterceptor()
        const request = interceptor({
            method: 'post',
            url: '/admin/v1/users/DUABC123/bypass_codes',
            params: { count: 1, valid_secs: 3600, reuse_count: 1, preserve_existing: false },
            data: {},
            headers: {},
        })

        expect(signV5Spy).toHaveBeenCalledWith(
            conf.integrationKey,
            conf.secretKey,
            'POST',
            conf.apiHost,
            '/admin/v1/users/DUABC123/bypass_codes',
            { count: 1, valid_secs: 3600, reuse_count: 1, preserve_existing: false },
            expect.any(String),
            '{}',
        )
        expect(request.headers.Authorization).toBe('Basic v5-signature')
    })
})

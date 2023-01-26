import { createHttpAgent } from './create-http-agent'
import mockAxios from 'jest-mock-axios'
import { AxiosInstance } from 'axios'

describe('HttpAgent', () => {
    let instance: AxiosInstance

    const conf = { apiHost: 'foo.bar', integrationKey: 'integrationKey', secretKey: 'secretKey' }

    beforeEach(() => {
        instance = createHttpAgent(conf)
        jest.spyOn(mockAxios, 'create')
    })

    afterEach(() => {
        expect(mockAxios.create).toHaveBeenCalledWith({
            baseURL: `https://${conf.apiHost}`,
        })
    })

    it('creates an axios instance', () => {
        expect(instance).toBeTruthy()
    })
})

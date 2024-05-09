import axios, { AxiosInstance } from 'axios'
import { DuoConfig } from '../duo.types'
import { sign } from './hmac'

export function createHttpAgent(config: DuoConfig): AxiosInstance {
    const baseURL = `https://${config.apiHost}`
    const agent = axios.create({ baseURL })

    if (config.accountId) {
        agent.defaults.params = { account_id: config.accountId }
    }

    agent.interceptors.request.use((req) => {
        const method = req.method?.toUpperCase() || 'GET'
        const path = req.url?.replace(baseURL, '') || '/'
        const date = new Date().toUTCString()
        req.headers['Authorization'] = sign(
            config.integrationKey,
            config.secretKey,
            method,
            config.apiHost,
            path,
            req.params || {},
            date,
        )
        req.headers['Date'] = date
        return req
    })
    return agent
}

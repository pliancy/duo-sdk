import axios, { AxiosInstance } from 'axios'
import { DuoConfig } from '../duo.types'
import { sign } from './hmac'

export function createHttpAgent(config: DuoConfig): AxiosInstance {
    const baseURL = `https://${config.apiHost}`
    const agent = axios.create({ baseURL })

    agent.interceptors.request.use((req) => {
        const method = req.method?.toUpperCase() || 'GET'
        const path = req.url?.replace(baseURL, '') || '/'
        const date = new Date().toUTCString()
        const signature = sign(
            config.integrationKey,
            config.secretKey,
            method,
            config.apiHost,
            path,
            req.params || {},
            date,
        )
        req.headers['Authorization'] = signature
        req.headers['Date'] = date
        return req
    })
    return agent
}

import axios, { AxiosInstance } from 'axios'
import { DuoConfig } from '../duo.types'
import { sign, signV5 } from './hmac'

function isV5SignaturePath(path: string) {
    return (
        path.startsWith('/admin/v3/integrations') ||
        path.startsWith('/admin/v2/integrations') ||
        path.startsWith('/admin/v1/integrations')
    )
}

function stripUndefinedValues(value: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined))
}

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
        const params = stripUndefinedValues((req.params as Record<string, unknown>) ?? {})
        const body =
            typeof req.data === 'string'
                ? req.data
                : typeof req.data === 'object' && req.data !== null
                ? JSON.stringify(req.data)
                : ''

        req.headers['Authorization'] = isV5SignaturePath(path)
            ? signV5(
                  config.integrationKey,
                  config.secretKey,
                  method,
                  config.apiHost,
                  path,
                  params,
                  date,
                  body,
              )
            : sign(
                  config.integrationKey,
                  config.secretKey,
                  method,
                  config.apiHost,
                  path,
                  params,
                  date,
              )
        req.headers['Date'] = date
        return req
    })
    return agent
}

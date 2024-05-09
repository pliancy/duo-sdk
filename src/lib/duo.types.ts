export interface DuoConfig {
    apiHost: string
    integrationKey: string
    secretKey: string
    accountId?: string
}

export interface BaseResponse<T> {
    stat: 'OK' | 'FAIL'
    response: T
    message?: string
    message_detail?: string
}

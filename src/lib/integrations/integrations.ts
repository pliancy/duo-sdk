import { AxiosInstance } from 'axios'
import { BaseResponse } from '../duo.types'
import {
    CreateDuoIntegrationPayload,
    DuoIntegration,
    DuoIntegrationClientSecret,
    DuoIntegrationSecretKeyV1,
    DuoIntegrationsListParams,
    UpdateDuoIntegrationPayload,
} from './integrations.types'

export class Integrations {
    private readonly baseUrl = '/admin/v3/integrations'

    constructor(private readonly httpAgent: AxiosInstance) {}

    async getAll(params?: DuoIntegrationsListParams): Promise<DuoIntegration[]> {
        const { data } = await this.httpAgent.get(this.baseUrl, params ? { params } : undefined)
        return this.unwrapResponse(data)
    }

    async getById(integrationKey: string): Promise<DuoIntegration> {
        const { data } = await this.httpAgent.get(`${this.baseUrl}/${integrationKey}`)
        return this.unwrapResponse(data)
    }

    async create(payload: CreateDuoIntegrationPayload): Promise<DuoIntegration> {
        const { data } = await this.httpAgent.post(this.baseUrl, payload)
        return this.unwrapResponse(data)
    }

    async update(
        integrationKey: string,
        payload: UpdateDuoIntegrationPayload,
    ): Promise<DuoIntegration> {
        const { data } = await this.httpAgent.post(`${this.baseUrl}/${integrationKey}`, payload)
        return this.unwrapResponse(data)
    }

    async delete(integrationKey: string): Promise<Record<string, never>> {
        const { data } = await this.httpAgent.delete(`${this.baseUrl}/${integrationKey}`)
        return this.unwrapResponse(data)
    }

    /**
     *  Legacy method for retrieving the secret key for an integration.
     * @param integrationKey
     * @returns
     */
    async getSecret(integrationKey: string): Promise<DuoIntegrationSecretKeyV1> {
        const { data } = await this.httpAgent.get(`/admin/v1/integrations/${integrationKey}/skey`)
        return this.unwrapResponse(data)
    }

    async getOAuthClientSecret(
        integrationKey: string,
        clientId: string,
    ): Promise<DuoIntegrationClientSecret> {
        const { data } = await this.httpAgent.get(
            `${this.baseUrl}/oauth_cc/${integrationKey}/client_secret/${clientId}`,
        )
        return this.unwrapResponse(data)
    }

    async getOidcClientSecret(integrationKey: string): Promise<DuoIntegrationClientSecret> {
        const { data } = await this.httpAgent.get(
            `${this.baseUrl}/oidc/${integrationKey}/client_secret`,
        )
        return this.unwrapResponse(data)
    }

    private unwrapResponse<T>(data: BaseResponse<T>): T {
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }
}

import { AxiosInstance } from 'axios'
import { BaseResponse } from '../duo.types'
import {
    CreateDuoPolicyPayload,
    DuoPolicy,
    DuoPoliciesListParams,
    UpdateDuoPolicyPayload,
} from './policies.types'

export class Policies {
    private readonly baseUrl = '/admin/v2/policies'

    constructor(private readonly httpAgent: AxiosInstance) {}

    async getAll(params?: DuoPoliciesListParams): Promise<DuoPolicy[]> {
        const { data } = await this.httpAgent.get(this.baseUrl, params ? { params } : undefined)
        return this.unwrapResponse(data)
    }

    async getById(policyKey: string): Promise<DuoPolicy> {
        const { data } = await this.httpAgent.get(`${this.baseUrl}/${policyKey}`)
        return this.unwrapResponse(data)
    }

    async create(payload: CreateDuoPolicyPayload): Promise<DuoPolicy> {
        const { data } = await this.httpAgent.post(this.baseUrl, payload)
        return this.unwrapResponse(data)
    }

    async update(policyKey: string, payload: UpdateDuoPolicyPayload): Promise<DuoPolicy> {
        const { data } = await this.httpAgent.put(`${this.baseUrl}/${policyKey}`, payload)
        return this.unwrapResponse(data)
    }

    async delete(policyKey: string): Promise<Record<string, never>> {
        const { data } = await this.httpAgent.delete(`${this.baseUrl}/${policyKey}`)
        return this.unwrapResponse(data)
    }

    private unwrapResponse<T>(data: BaseResponse<T>): T {
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }
}

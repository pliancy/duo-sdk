import { AxiosInstance } from 'axios'
import { DuoUser, PushResponse } from './users.types'

export class Users {
    private baseUrl = '/admin/v1/users'

    constructor(private readonly httpAgent: AxiosInstance) {}

    async getAll(): Promise<DuoUser[]> {
        const { data } = await this.httpAgent.get(this.baseUrl)
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async getByUsername(username: string): Promise<DuoUser> {
        const { data } = await this.httpAgent.get(this.baseUrl, { params: { username } })
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response[0] ?? null
    }

    async create(user: Partial<DuoUser>): Promise<DuoUser> {
        const { data } = await this.httpAgent.post(this.baseUrl, {}, { params: user })
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async updateByUsername(username: string, params: Partial<DuoUser>): Promise<DuoUser> {
        const user = (await this.getByUsername(username)) as any
        if (!user) throw new Error(`No user with username ${username} found`)
        const { data } = await this.httpAgent.post(
            `${this.baseUrl}/${user.user_id}`,
            {},
            { params },
        )

        if (data.stat === 'FAIL')
            throw new Error(
                `Unable to update user with username ${username}: ${data.message}: ${data.message_detail}`,
            )
        return data.response
    }

    async removeByUsername(username: string) {
        const user = (await this.getByUsername(username)) as any
        if (!user) throw new Error(`No user with username ${username} found`)
        const { data } = await this.httpAgent.delete(`${this.baseUrl}/${user.user_id}`)
        if (data.stat === 'FAIL')
            throw new Error(
                `Unable to update user with username ${username}: ${data.message}: ${data.message_detail}`,
            )
        return data.response
    }

    async sendVerificationPush(userId: string, phoneId: string) {
        try {
            const { data } = await this.httpAgent.post(
                `${this.baseUrl}/${userId}/send_verification_push`,
                null,
                {
                    params: { phone_id: phoneId },
                },
            )
            return { pushId: data.response.push_id }
        } catch (e: any) {
            if (e.status === 400) {
                return {
                    success: false,
                    message:
                        'Either a required parameter is missing or the device has not been activated',
                }
            }
            return { success: false, error: e.data }
        }
    }

    async getPushResponse(userId: string, pushId: string): Promise<PushResponse> {
        try {
            const { data } = await this.httpAgent.get(
                `${this.baseUrl}/${userId}/verification_push_response`,
                {
                    params: { push_id: pushId },
                },
            )
            return { result: data.response.result }
        } catch (e: any) {
            if (e.status === 404) {
                return { result: 'timeout' }
            }

            return { result: 'failed', message: e.message }
        }
    }

    async associateDevice(user_id: string, phone_id: string): Promise<'OK'> {
        const { data } = await this.httpAgent.post(
            `${this.baseUrl}/${user_id}/phones`,
            {},
            { params: { phone_id } },
        )
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.stat
    }

    async createBypassCodes(
        username: string,
        count: number,
        valid_for: number,
        reuse_count: number,
    ): Promise<string[]> {
        const user = await this.getByUsername(username)
        const { data } = await this.httpAgent.post(
            `${this.baseUrl}/${user.user_id}/bypass_codes`,
            {},
            { params: { count, valid_for, reuse_count } },
        )

        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)

        return data.response
    }

    async sync(username: string, directory_key: string): Promise<DuoUser> {
        const { data } = await this.httpAgent.post(
            `${this.baseUrl}/directorysync/${directory_key}/syncuser`,
            {},
            { params: { username } },
        )

        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response.user
    }
}

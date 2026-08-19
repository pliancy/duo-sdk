import { AxiosInstance } from 'axios'
import { DeviceActivationResponse, DuoActivation, DuoPhone } from './devices.types'
import { BaseResponse } from '../duo.types'
import { DuoStatus } from '../users/users.types'

export class Devices {
    private readonly baseUrl = '/admin/v1/phones'

    constructor(private readonly http: AxiosInstance) {}

    async getByNumber(number: string): Promise<DuoPhone> {
        const { data } = await this.http.get(this.baseUrl, { params: { number } })
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response[0] ?? null
    }

    async create(phone: Partial<DuoPhone>): Promise<DuoPhone> {
        const { data } = await this.http.post(this.baseUrl, phone)
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async remove(phone_id: string): Promise<{ status: DuoStatus }> {
        const { data } = await this.http.delete(`${this.baseUrl}/${phone_id}`)
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return { status: data.stat }
    }

    async sendSmsInstallation(phoneId: string) {
        const { data } = await this.http.post(`${this.baseUrl}/${phoneId}/send_sms_installation`)
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async sendActivationSms(
        phoneId: string,
        valid_secs?: number,
        install?: 0 | 1,
        installation_msg?: string,
        activation_msg?: string,
    ): Promise<{ installation_msg: string }> {
        const body: any = {}
        const args: any = { valid_secs, install, installation_msg, activation_msg }
        for (const key in args) {
            // install param is a falsy value, so check for null or undefined values
            if (args[key] !== undefined && args[key] !== null) body[key] = args[key]
        }
        const { data } = await this.http.post(
            `${this.baseUrl}/${phoneId}/send_sms_activation`,
            body,
        )
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async activate(phoneId: string): Promise<DeviceActivationResponse> {
        const { data } = await this.http.post<BaseResponse<DuoActivation>>(
            `${this.baseUrl}/${phoneId}/activation_url`,
            { install: '1' },
        )

        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)

        const { activation_barcode, activation_url, valid_secs, installation_url } = data.response

        return {
            barcode: activation_barcode,
            url: activation_url,
            validSeconds: valid_secs,
            installationUrl: installation_url,
        }
    }
}

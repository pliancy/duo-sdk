import { AxiosInstance } from 'axios'
import { DuoGroup } from './groups.types'

export class Groups {
    private readonly baseUrl = '/admin/v1/groups'

    constructor(private readonly http: AxiosInstance) {}

    async getByName(name: string): Promise<DuoGroup | null> {
        const { data } = await this.http.get(this.baseUrl)
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        const groups: DuoGroup[] = data.response
        return groups.find((g) => g.name === name) ?? null
    }

    async create(group: Partial<DuoGroup>): Promise<DuoGroup> {
        const { data } = await this.http.post(this.baseUrl, {}, { params: group })
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }

    async updateByName(groupName: string, update: Partial<DuoGroup>): Promise<DuoGroup> {
        const group = await this.getByName(groupName)
        if (!group) throw new Error(`No group with name "${groupName}" found`)

        const { data } = await this.http.post(
            `${this.baseUrl}/${group.group_id}`,
            {},
            { params: update },
        )
        if (data.stat === 'FAIL') throw new Error(`${data.message}: ${data.message_detail}`)
        return data.response
    }
}

import { DuoPhone } from '../devices/devices.types'

export interface DuoUser {
    alias1: string
    alias2: string
    alias3: string
    alias4: string
    aliases: {}
    created: number
    desktoptokens: string[]
    email: string
    enable_auto_prompt: boolean
    firstname: string
    groups: DuoGroup[]
    is_enrolled: boolean
    last_directory_sync: 1715065505
    last_login: 1705947198
    lastname: string
    lockout_reason: string
    notes: string
    phones: DuoPhone[]
    realname: string
    status: DuoStatus
    tokens: string[]
    u2ftokens: string[]
    user_id: string
    username: string
    webauthncredentials: DuoWebAuthNCredential[]
}

export type DuoStatus = 'Active' | 'Bypass' | 'Disabled'

export interface DuoGroup {
    desc: string
    group_id: string
    mobile_otp_enabled: boolean
    name: string
    push_enabled: boolean
    sms_enabled: boolean
    status: DuoStatus
    voice_enabled: boolean
}

export interface DuoWebAuthNCredential {
    credential_name: string
    date_added: number
    label: string
    webauthnkey: string
}

export type PushResponse = { result: PushResult; message?: string }
export type PushResult = 'approve' | 'deny' | 'fraud' | 'waiting' | 'timeout' | 'failed'

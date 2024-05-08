import { BaseResponse } from '../duo.types'

export interface DuoPhone {
    activated: true
    capabilities: DuoPhoneCapability[]
    encrypted: DuoPhoneEncrypted
    extension: string
    fingerprint: DuoPhoneFingerprint
    last_seen: Date
    model: string
    name: string
    number: string
    phone_id: string
    platform: DuoPhonePlatform
    postdelay: number
    predelay: number
    screenlock: DuoPhoneScreenLock
    sms_passcodes_sent: boolean
    tampered: DuoPhoneTampered
    type: DuoPhoneType
}

export type DuoPhonePlatform =
    | 'unknown'
    | 'google android'
    | 'apple ios'
    | 'windows phone 7'
    | 'rim blackberry'
    | 'java j2me'
    | 'palm webos'
    | 'symbian os'
    | 'windows mobile'
    | 'generic smartphone'
export type DuoPhoneCapability = 'auto' | 'push' | 'sms' | 'phone' | 'mobile_otp'
export type DuoPhoneEncrypted = 'Encrypted' | 'Unencrypted' | 'Unknown'
export type DuoPhoneScreenLock = 'Locked' | 'Unlocked'
export type DuoPhoneType = 'unknown' | 'mobile' | 'landline'
export type DuoPhoneTampered = 'Tampered' | 'Not Tampered'
export type DuoPhoneFingerprint = 'Configured' | 'Disabled' | 'Unknown'

export interface DuoActivation {
    /**
     * URL of a QR code. Scan the code with Duo Mobile to complete activation. This QR code uses the same activation code as activation_url.
     */
    activation_barcode: string

    /**
     *    Opening this URL with the Duo Mobile app will complete activation.
     */
    activation_url: string

    /**
     * The number of seconds for which the activation URL is valid.
     */
    valid_secs: number

    /**
     * Opening this URL on the phone will prompt the user to install Duo Mobile. Only present if install was 1.
     */
    installation_url?: string
}

export interface DeviceActivationResponse {
    barcode: string
    url: string
    validSeconds: number
    installationUrl?: string
}

export interface DuoSmsInstallationResponse extends BaseResponse<{ installation_msg: string }> {}

import { AxiosInstance } from 'axios'
import { Devices } from './devices'
import { DuoPhone } from './devices.types'

const mockHttp = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}

describe('Devices', () => {
    let devices: Devices

    const duoDevices = [
        { phone_id: '1' },
        { phone_id: '2' },
        { phone_id: '3' },
    ] as never as DuoPhone[]

    const phoneId = duoDevices[0]!.phone_id

    beforeEach(() => {
        jest.clearAllMocks()
        devices = new Devices(mockHttp as unknown as AxiosInstance)
    })

    it('creates the instance', () => expect(devices).toBeTruthy())

    describe('getByNumber', () => {
        assertFailure('getByNumber', 'get', '123')

        it('returns null given no device found', async () => {
            jest.spyOn(mockHttp, 'get').mockResolvedValue({
                data: { stat: 'OK', response: [] },
            })
            await expect(devices.getByNumber('1231231233')).resolves.toBeNull()
        })

        it('gets a device by phone number', async () => {
            jest.spyOn(mockHttp, 'get').mockResolvedValue({
                data: { stat: 'OK', response: [duoDevices[0]] },
            })
            await expect(devices.getByNumber('1231231233')).resolves.toEqual(duoDevices[0])
        })
    })

    describe('create', () => {
        assertFailure('create', 'post', { number: '123' })

        it('creates a device', async () => {
            jest.spyOn(mockHttp, 'post').mockResolvedValue({
                data: { response: duoDevices[0] },
            })
            await expect(devices.create({} as never)).resolves.toEqual(duoDevices[0])
        })
    })

    describe('sendSmsInstallation', () => {
        assertFailure('sendSmsInstallation', 'post', '1')

        it('serializes args and sends activation sms', async () => {
            const data = { stat: 'OK', response: { installation_msg: 'sweet' } }
            const activation_msg = 'activation'
            const installation_msg = 'installation'
            const install = 1
            const valid_secs = 1

            jest.spyOn(mockHttp, 'post').mockResolvedValue({
                data,
            })

            await expect(
                devices.sendActivationSms(
                    phoneId,
                    valid_secs,
                    install,
                    installation_msg,
                    activation_msg,
                ),
            ).resolves.toEqual(data.response)

            expect(mockHttp.post).toHaveBeenCalledWith('/admin/v1/phones/1/send_sms_activation', {
                activation_msg,
                install,
                installation_msg,
                valid_secs,
            })
        })
    })

    describe('activate', () => {
        assertFailure('activate', 'post', '1')

        it('returns device activation links', async () => {
            const data = {
                stat: 'OK',
                response: {
                    activation_barcode: 'barcode',
                    activation_url: 'url',
                    valid_secs: 'seconds',
                    installation_url: 'url',
                },
            }
            jest.spyOn(mockHttp, 'post').mockResolvedValue({
                data,
            })
            await expect(devices.activate(phoneId)).resolves.toEqual({
                barcode: data.response.activation_barcode,
                url: data.response.activation_url,
                validSeconds: data.response.valid_secs,
                installationUrl: data.response.installation_url,
            })
        })
    })

    function assertFailure(classMethod: keyof Devices, requestMethod: any, ...args: any[]) {
        it('fails given stat === "FAIL"', async () => {
            const errorResponse = { stat: 'FAIL', message: 'fail', message_detail: 'it failed' }

            jest.spyOn(mockHttp, requestMethod).mockRejectedValue({
                data: errorResponse,
            } as never)
            try {
                // @ts-ignore
                await devices[classMethod](args)
                expect(true).toBe(true)
            } catch (e) {
                expect(e).toEqual({ data: errorResponse })
            }
        })
    }
})

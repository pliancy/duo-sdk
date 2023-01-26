// This file is taken from the Duo Node.js SDK: https://github.com/duosecurity/duo_api_nodejs/blob/master/lib/duo_sig.js

import crypto from 'crypto'

// Compare two strings based on character unicode values.
//
// If a string is a subset of another, it should sort before.
// i.e. 'foo' < 'foo_bar'
function compare(a: string, b: string) {
    let aChar, bChar

    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        aChar = a.charCodeAt(i)
        bChar = b.charCodeAt(i)

        if (aChar < bChar) {
            return -1
        } else if (aChar > bChar) {
            return 1
        }
    }

    if (a.length < b.length) {
        return -1
    } else if (a.length > b.length) {
        return 1
    }

    return 0
}

// Given an Object mapping from parameter name to its value as either
// a single string or an Array of strings, return the
// application/x-www-form-urlencoded parameters string.
function canonParams(params: any) {
    const ks = Object.keys(params).sort(compare)

    // Build application/x-www-form-urlencoded string.
    const qs = ks
        .map(function (k) {
            const keq = encodeURIComponent(k) + '='
            if (Array.isArray(params[k])) {
                return params[k]
                    .map(function (v: any) {
                        return keq + encodeURIComponent(v)
                    })
                    .join('&')
            } else {
                return keq + encodeURIComponent(params[k])
            }
        })
        .join('&')

    // encodeURIComponent doesn't escape all needed characters.
    // We need to use global regexps to handle the remaining cases.

    const exclamationRegexp = /!/g
    const singleQuoteRegexp = /'/g
    const lparenRegexp = /\(/g
    const rparenRegexp = /\)/g
    const starRegexp = /\*/g
    return qs
        .replace(exclamationRegexp, '%21')
        .replace(singleQuoteRegexp, '%27')
        .replace(lparenRegexp, '%28')
        .replace(rparenRegexp, '%29')
        .replace(starRegexp, '%2A')
}

// Return a request's canonical representation as a string to sign.
function canonicalize(
    method: string,
    host: string,
    path: string,
    params: Record<string, unknown>,
    date: string,
) {
    return [date, method.toUpperCase(), host.toLowerCase(), path, canonParams(params)].join('\n')
}

// Return the Authorization header for an HMAC signed request.
export function sign(
    ikey: string,
    skey: string,
    method: string,
    host: string,
    path: string,
    params: Record<string, unknown>,
    date: string,
) {
    const canon = canonicalize(method, host, path, params, date)
    const sig = crypto.createHmac('sha512', skey).update(canon).digest('hex')

    const auth = Buffer.from([ikey, sig].join(':')).toString('base64')
    return 'Basic ' + auth
}

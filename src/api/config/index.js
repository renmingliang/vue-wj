
export const ERR_OK = 10000

export const ERR_LOGIN = 10007

export const DEV = process.env.NODE_ENV === 'development'

export const HOST = DEV ? '/dev-url' : ''

export const InterFaceUrl = (url) => (HOST + url)

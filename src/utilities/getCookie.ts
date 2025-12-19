export function getCookie(cookiename: string): string {
    const cookieString = RegExp(cookiename + '=[^;]+').exec(document.cookie)
    return decodeURIComponent(cookieString ? cookieString.toString().replace(/^[^=]+./, '') : '')
}
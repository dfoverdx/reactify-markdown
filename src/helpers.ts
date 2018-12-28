import { Token } from './types';

/**
 * Converts a `Token`'s attribute tuples into an object.
 * 
 * @param token The `Token` from which to retrieve attributes.
 */
export function getAttrs(token: Token): { [key: string]: string } {
    if (!token.attrs) {
        return {};
    }

    let obj: { [key: string]: string } = {};
    for (let [attr, val] of token.attrs) {
        obj[attr] = val;
    }

    return obj;
}
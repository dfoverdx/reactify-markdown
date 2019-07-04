import { Token } from './types';
/**
 * Converts a `Token`'s attribute tuples into an object.
 *
 * @param token The `Token` from which to retrieve attributes.
 */
export declare function getAttrs(token: Token): {
    [key: string]: string;
};

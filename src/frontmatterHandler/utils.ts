import { FrontMatterResult } from 'front-matter';
// eslint-disable-next-line no-var, @typescript-eslint/no-var-requires
var fm = require('front-matter');

export function extractFrontMatter(file: string): FrontMatterResult<unknown> {
    const frontmatter: FrontMatterResult<unknown> = fm(file);
    return frontmatter;
}

/**
 * 
 * @param v1
 * @param v2 
 * @returns If either item is null, returns the non-null value (or null if both are null).
 *          Otherwise, returns an array with the items in @param v1 and @param v2
 */
function merge(v1: unknown, v2: unknown) {
    if (v1 == null) {
        return v2;
    } else if (v2 == null) {
        return v1;
    } else {
        return Array.isArray(v1) ? v1.concat(v2).sort() : [v1].concat(v2).sort();
    }
}

/**
 * Creates a new key value pair
 * Does not allow duplicates
 * 
 * @param frontmatter
 * @param keyValuesToCreate
 * @returns updated frontmatter
 */
export function create(frontmatter: Record<string, unknown>, keyValuesToCreate: Record<string, unknown>) {
    for (const k in keyValuesToCreate) {
        frontmatter[k] = merge(frontmatter[k], keyValuesToCreate[k]);
    }
    return frontmatter;
}

/**
 * Removes a value from a key
 * 
 * @param frontmatter
 * @param keyValueToRemove
 * @returns updated frontmatter
 */
export function removeValue(frontmatter: Record<string, unknown>, keyValuesToRemove: Record<string, unknown>) {
    for (const k of Object.keys(keyValuesToRemove)) {
        if (Array.isArray(frontmatter[k])) {
            frontmatter[k] = (frontmatter[k] as unknown[]).filter(v => Array.isArray(keyValuesToRemove[k]) ? !(keyValuesToRemove[k] as unknown[]).includes(v) : keyValuesToRemove[k] !== v);
        } else if (frontmatter[k] === keyValuesToRemove[k]) {
            frontmatter[k] = null;
        }
    }
    return frontmatter;
}

/**
 * Removes a key
 * 
 * @param frontmatter
 * @param keyToRemove
 * @returns updated frontmatter
 */
export function removeKey(frontmatter: Record<string, unknown>, keyToRemove: string) {
    delete frontmatter[keyToRemove];
    return frontmatter;
}

/**
 * 
 * @param obj 
 * @param keyValues 
 * @returns if @param keyValues are present in @param obj
 */
function areKeyValuesPresent(obj: Record<string, unknown>, keyValues: Record<string, unknown>): boolean {
    for (const k in keyValues) {
        if (obj[k] === undefined) {
            return false;
        }
        const keyValueAsArray: unknown[] = (Array.isArray(keyValues[k]) ? keyValues[k] : [keyValues[k]]) as unknown[];
        const objValueAsArray: unknown[] = (Array.isArray(obj[k]) ? obj[k] : [obj[k]]) as unknown[];
        for (const v of keyValueAsArray) {
            if (!objValueAsArray.includes(v)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Replaces a key value with new key(s) value(s)
 * 
 * Only replaces if all keyValuesToReplace are present
 * 
 * @param frontmatter 
 * @param keyValuesToReplace 
 * @param newKeyValues 
 * @returns updated frontmatter
 */
export function replace(frontmatter: Record<string, unknown>, keyValuesToReplace: Record<string, unknown>, newKeyValues: Record<string, unknown>) {
    if (areKeyValuesPresent(frontmatter, keyValuesToReplace)) {
        frontmatter = removeValue(frontmatter, keyValuesToReplace);
        frontmatter = create(frontmatter, newKeyValues);
    }
    return frontmatter;
}

/**
 * If a key(s) value(s) exists, updates the YAML with new key(s) value(s)
 * 
 * @param frontmatter 
 * @param flags key value pair(s) that let us know if we should update the frontmatter
 * @param newKeyValues 
 * @returns updated frontmatter
 */
export function createWhen(frontmatter: Record<string, unknown>, flags: Record<string, unknown>, newKeyValues: Record<string, unknown>) {
    return areKeyValuesPresent(frontmatter, flags) ? create(frontmatter, newKeyValues) : frontmatter;
}
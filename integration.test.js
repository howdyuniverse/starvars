import { jest, describe, test, expect } from '@jest/globals';
import { checkStarsVariability } from './index.js';

// Increase the timeout for this integration test
jest.setTimeout(30000);

describe('checkStarsVariability - Integration Test', () => {
    let results;

    beforeAll(async () => {
        results = await checkStarsVariability(['TIC 441734144', 'TIC 404', 'TIC 121489136']);
    });

    test('should return no matches for a non-variable star (TIC 121489136)', () => {
        const starResult = results['TIC 121489136'];
        expect(starResult).toHaveLength(0);
    });

    test('should return no matches for a star not in the database (TIC 404)', () => {
        const starResult = results['TIC 404'];
        expect(starResult).toHaveLength(0);
    });

    test('should identify TIC 441734144 as a variable star with otype EB*', () => {
        const starResult = results['TIC 441734144'];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'otype', match_text: 'EB*' })
        ]));
    });

    test('should find specific bibcode matches for TIC 441734144', () => {
        const starResult = results['TIC 441734144'];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'bibcode', match_text: '2022ApJS..258...16P' })
        ]));
    });
});


import {jest, describe, test, expect, beforeAll} from '@jest/globals';
import { checkStarsVariability } from './index.js';

const mockSimbadResponse = {
    "metadata": [
        { "name": "id" }, { "name": "otype" }, { "name": "other_types" }, { "name": "doi" }, { "name": "bibcode" }, { "name": "year" }, { "name": "Journal" }, { "name": "page" }, { "name": "Title" }, { "name": "keywords" }, { "name": "Abstract" }
    ],
    "data": [
        [
            "TEST_STAR_OTYPE", "EB*", "*|EB*|V*", null, "2023A&A...674A..16M", 2023, "A&A", 16, "A paper on binaries", "{\"binaries: eclipsing\"}", "Abstract about eclipsing binaries."
        ],
        [
            "TEST_STAR_BIBCODE", "Star", "*|Star", null, "2021ApJ...919..131H", 2021, "ApJ", 131, "A paper from a known catalog", "{}", "Abstract."
        ],
        [
            "TEST_STAR_TITLE_KW", "Star", "*|Star", null, "2022yCat...1.2025S", 2022, "yCat", 1, "A paper about a Variable star", "{}", "Abstract."
        ],
        [
            "TEST_STAR_ABSTRACT_KW", "Star", "*|Star", null, "2022yCat...1.2025S", 2022, "yCat", 1, "A paper about a star", "{}", "This abstract mentions a Pulsating star."
        ],
        [
            "TEST_STAR_KEYWORDS_KW", "Star", "*|Star", null, "2022yCat...1.2025S", 2022, "yCat", 1, "A paper about a star", "{\"variability\"}", "Abstract."
        ],
        [
            "TEST_STAR_NO_VARIABILITY", "Star", "*|Star", null, "2022yCat...1.2025S", 2022, "yCat", 1, "A normal paper", "{}", "A normal abstract."
        ]
    ]
};

const mockSimbadResponseWithDuplicates = {
    "metadata": [
        { "name": "id" }, { "name": "otype" }, { "name": "other_types" }, { "name": "doi" }, { "name": "bibcode" }, { "name": "year" }, { "name": "Journal" }, { "name": "page" }, { "name": "Title" }, { "name": "keywords" }, { "name": "Abstract" }
    ],
    "data": [
        [
            "TEST_STAR_DUPLICATE", "EB*", "*|EB*|V*", null, "2023A&A...674A..16M", 2023, "A&A", 16, "A paper on binaries", "{\"binaries: eclipsing\"}", "Abstract about eclipsing binaries."
        ],
        [
            "TEST_STAR_DUPLICATE", "EB*", "*|EB*|V*", null, "2022yCat...1.2025S", 2022, "yCat", 1, "Another paper on binaries", "{\"binaries: eclipsing\"}", "Another abstract about eclipsing binaries."
        ]
    ]
};

const mockResponseOtypeLowercase = {
    "metadata": [
        { "name": "id" }, { "name": "otype" }, { "name": "other_types" }, { "name": "doi" }, { "name": "bibcode" }, { "name": "year" }, { "name": "Journal" }, { "name": "page" }, { "name": "Title" }, { "name": "keywords" }, { "name": "Abstract" }
    ],
    "data": [
        [
            "TEST_STAR_OTYPE_LOWERCASE", "eb*", "*|eb*|v*", null, "2023A&A...674A..16M", 2023, "A&A", 16, "A paper on binaries", "{\"binaries: eclipsing\"}", "Abstract about eclipsing binaries."
        ]
    ]
};

const mockResponseBibcodeLowercase = {
    "metadata": [
        { "name": "id" }, { "name": "otype" }, { "name": "other_types" }, { "name": "doi" }, { "name": "bibcode" }, { "name": "year" }, { "name": "Journal" }, { "name": "page" }, { "name": "Title" }, { "name": "keywords" }, { "name": "Abstract" }
    ],
    "data": [
        [
            "TEST_STAR_BIBCODE_LOWERCASE", "Star", "*|Star", null, "2021apj...919..131h", 2021, "ApJ", 131, "A paper from a known catalog", "{}", "Abstract."
        ]
    ]
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockSimbadResponse),
  })
);

describe('checkStarsVariability', () => {
    let results;

    beforeAll(async () => {
        results = await checkStarsVariability(["TEST_STAR_OTYPE", "TEST_STAR_BIBCODE", "TEST_STAR_TITLE_KW", "TEST_STAR_ABSTRACT_KW", "TEST_STAR_KEYWORDS_KW", "TEST_STAR_NO_VARIABILITY", "NOT_FOUND_STAR"]);
    });

    test('should identify variability by otype', () => {
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'otype', match_text: 'EB*' })
        ]));
    });

    test('should identify variability by other_types', () => {
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'other_types', match_text: 'V*', priority: 2 })
        ]));
    });

    test('should identify variability by bibcode', () => {
        const starResult = results["TEST_STAR_BIBCODE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'bibcode', match_text: '2021ApJ...919..131H', priority: 3 })
        ]));
    });

    test('should identify variability by keyword in title', () => {
        const starResult = results["TEST_STAR_TITLE_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'title', match_text: 'Variable star', priority: 4 })
        ]));
    });

    test('should identify variability by keyword in abstract', () => {
        const starResult = results["TEST_STAR_ABSTRACT_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'abstract', match_text: 'Pulsating star', priority: 6 })
        ]));
    });

    test('should identify variability by keyword in keywords', () => {
        const starResult = results["TEST_STAR_KEYWORDS_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'keywords', match_text: 'Variability', priority: 5 })
        ]));
    });

    test('should not identify variability for a normal star', () => {
        const starResult = results["TEST_STAR_NO_VARIABILITY"];
        expect(starResult).toHaveLength(0);
    });

    test('should return results sorted by priority', () => {
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult[0].priority).toBe(1);
    });

    test('should return an empty array for a star not found in the response', () => {
        const starResult = results["NOT_FOUND_STAR"];
        expect(starResult).toEqual([]);
    });

    test('should use POST request', () => {
        expect(global.fetch).toHaveBeenCalledWith(
            'https://simbad.cds.unistra.fr/simbad/sim-tap/sync',
            expect.objectContaining({
                method: 'POST'
            })
        );
    });

    test('should not have duplicate otype matches for the same star', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockSimbadResponseWithDuplicates),
            })
        );
        const duplicateResults = await checkStarsVariability(["TEST_STAR_DUPLICATE"]);
        const starResult = duplicateResults["TEST_STAR_DUPLICATE"];
        const otypeMatches = starResult.filter(m => m.source === 'otype');
        expect(otypeMatches).toHaveLength(1);
    });

    test('should match otype case-insensitively', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponseOtypeLowercase),
            })
        );
        const caseResults = await checkStarsVariability(["TEST_STAR_OTYPE_LOWERCASE"]);
        const starResult = caseResults["TEST_STAR_OTYPE_LOWERCASE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'otype', match_text: 'eb*' })
        ]));
    });

    test('should not match bibcode case-insensitively', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponseBibcodeLowercase),
            })
        );
        const caseResults = await checkStarsVariability(["TEST_STAR_BIBCODE_LOWERCASE"]);
        const starResult = caseResults["TEST_STAR_BIBCODE_LOWERCASE"];
        const bibcodeMatches = starResult.filter(m => m.source === 'bibcode');
        expect(bibcodeMatches).toHaveLength(0);
    });
});

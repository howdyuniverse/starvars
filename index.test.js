import {jest, describe, test, expect} from '@jest/globals';
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
    ok: true,
  })
);

describe('checkStarsVariability', () => {
    test('should identify variability by otype', async () => {
        const results = await checkStarsVariability(["TEST_STAR_OTYPE"]);
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'otype', match_text: 'EB*' })
        ]));
    });

    test('should identify variability by other_types', async () => {
        const results = await checkStarsVariability(["TEST_STAR_OTYPE"]);
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'other_types', match_text: 'V*', priority: 2 })
        ]));
    });

    test('should identify variability by bibcode', async () => {
        const results = await checkStarsVariability(["TEST_STAR_BIBCODE"]);
        const starResult = results["TEST_STAR_BIBCODE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'bibcode', match_text: '2021ApJ...919..131H', priority: 3 })
        ]));
    });

    test('should identify variability by keyword in title', async () => {
        const results = await checkStarsVariability(["TEST_STAR_TITLE_KW"]);
        const starResult = results["TEST_STAR_TITLE_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'title', match_text: 'Variable star', priority: 4 })
        ]));
    });

    test('should identify variability by keyword in abstract', async () => {
        const results = await checkStarsVariability(["TEST_STAR_ABSTRACT_KW"]);
        const starResult = results["TEST_STAR_ABSTRACT_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'abstract', match_text: 'Pulsating star', priority: 6 })
        ]));
    });

    test('should identify variability by keyword in keywords', async () => {
        const results = await checkStarsVariability(["TEST_STAR_KEYWORDS_KW"]);
        const starResult = results["TEST_STAR_KEYWORDS_KW"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'keywords', match_text: 'Variability', priority: 5 })
        ]));
    });

    test('should not identify variability for a normal star', async () => {
        const results = await checkStarsVariability(["TEST_STAR_NO_VARIABILITY"]);
        const starResult = results["TEST_STAR_NO_VARIABILITY"];
        expect(starResult).toHaveLength(0);
    });

    test('should return results sorted by priority', async () => {
        const results = await checkStarsVariability(["TEST_STAR_OTYPE"]);
        const starResult = results["TEST_STAR_OTYPE"];
        expect(starResult[0].priority).toBe(1);
    });

    test('should return an empty array for a star not found in the response', async () => {
        const results = await checkStarsVariability(["NOT_FOUND_STAR"]);
        const starResult = results["NOT_FOUND_STAR"];
        expect(starResult).toEqual([]);
    });

    test('should use POST request', async () => {
        await checkStarsVariability(["ANY_STAR"]);
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
                ok: true,
            })
        );
        const results = await checkStarsVariability(["TEST_STAR_DUPLICATE"]);
        const starResult = results["TEST_STAR_DUPLICATE"];
        const otypeMatches = starResult.filter(m => m.source === 'otype');
        expect(otypeMatches).toHaveLength(1);
    });

    test('should match otype case-insensitively', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponseOtypeLowercase),
                ok: true,
            })
        );
        const results = await checkStarsVariability(["TEST_STAR_OTYPE_LOWERCASE"]);
        const starResult = results["TEST_STAR_OTYPE_LOWERCASE"];
        expect(starResult).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: 'otype', match_text: 'eb*' })
        ]));
    });

    test('should not match bibcode case-insensitively', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockResponseBibcodeLowercase),
                ok: true,
            })
        );
        const results = await checkStarsVariability(["TEST_STAR_BIBCODE_LOWERCASE"]);
        const starResult = results["TEST_STAR_BIBCODE_LOWERCASE"];
        const bibcodeMatches = starResult.filter(m => m.source === 'bibcode');
        expect(bibcodeMatches).toHaveLength(0);
    });

    test('should throw an error if the fetch call fails', async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));
        await expect(checkStarsVariability(["ANY_STAR"])).rejects.toThrow('Failed to fetch data from SIMBAD: Network error');
    });

    test('should throw an error if the response is not ok', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                text: () => Promise.resolve('Internal Server Error')
            })
        );
        await expect(checkStarsVariability(["ANY_STAR"])).rejects.toThrow('HTTP error! status: 500: Internal Server Error');
    });

    test('should throw an error for unexpected data format', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ some_unexpected_field: [] }),
            })
        );
        await expect(checkStarsVariability(["ANY_STAR"])).rejects.toThrow('Unexpected data format from SIMBAD: {"some_unexpected_field":[]}');
    });
});
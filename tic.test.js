import {jest, describe, test, expect, beforeAll} from '@jest/globals';
import { checkStarsVariability } from './index.js';

describe('checkStarsVariability for TIC 31381302', () => {
    let stellarFlaresMatches;

    beforeAll(async () => {
        const mockSimbadResponseForTic31381302 = {
            "metadata": [
                { "name": "id" }, { "name": "otype" }, { "name": "other_types" }, { "name": "doi" }, { "name": "bibcode" }, { "name": "year" }, { "name": "Journal" }, { "name": "page" }, { "name": "Title" }, { "name": "keywords" }, { "name": "Abstract" }
            ],
            "data": [
                [ "TIC 31381302", "PM*", "*|Er*|MIR|NIR|PM*|Ro*", "10.3847/1538-3881/ab5d3a", "2020AJ....159...60G", 2020, "AJ", 60, "Stellar flares from the first TESS data release: exploring a new sample of M dwarfs.", "{\"Habitable planets\",\"Pre-biotic astrochemistry\",Astrobiology,\"Extrasolar rocky planets\",\"Habitable zone\",\"Stellar activity\",\"Stellar flares\",\"Red dwarf flare stars\",\"Exoplanet atmospheres\",Exoplanets,\"Optical flares\"}", "We perform a study of stellar flares for the 24,809 stars." ],
                [ "TIC 31381302", "PM*", "*|Er*|MIR|NIR|PM*|Ro*", "10.3847/1538-4357/abc686", "2020ApJ...905..107M", 2020, "ApJ", 107, "Flare rates, rotation periods, and spectroscopic activity indicators of a volume-complete sample of mid- to late-M dwarfs within 15 pc.", "{\"Stellar flares\",\"Stellar rotation\",\"Stellar activity\"}", "We present a study of flare rates." ]
            ]
        };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockSimbadResponseForTic31381302),
                ok: true,
            })
        );
        const results = await checkStarsVariability(["TIC 31381302"]);
        stellarFlaresMatches = results["TIC 31381302"].filter(m => m.match_text === 'Stellar flares');
    });

    test('should find 4 matches for "Stellar flares"', () => {
        expect(stellarFlaresMatches).toHaveLength(4);
    });

    test('Match 1: title 2020AJ....159...60G', () => {
        const match = stellarFlaresMatches.find(m => m.bibcode === '2020AJ....159...60G' && m.source === 'title');
        expect(match).toBeDefined();
        expect(match.priority).toBe(4);
        expect(match.title).toBe('Stellar flares from the first TESS data release: exploring a new sample of M dwarfs.');
        expect(match.doi).toBe('10.3847/1538-3881/ab5d3a');
        expect(match.context.startsWith('...')).toBe(false);
        expect(match.context.endsWith('...')).toBe(true);
        expect(match.context.toLowerCase()).toContain('stellar flares');
    });

    test('Match 2: keywords 2020AJ....159...60G', () => {
        const match = stellarFlaresMatches.find(m => m.bibcode === '2020AJ....159...60G' && m.source === 'keywords');
        expect(match).toBeDefined();
        expect(match.priority).toBe(5);
        expect(match.title).toBe('Stellar flares from the first TESS data release: exploring a new sample of M dwarfs.');
        expect(match.doi).toBe('10.3847/1538-3881/ab5d3a');
        expect(match.context.startsWith('...')).toBe(true);
        expect(match.context.endsWith('...')).toBe(true);
        expect(match.context.toLowerCase()).toContain('stellar flares');
    });

    test('Match 3: abstract 2020AJ....159...60G', () => {
        const match = stellarFlaresMatches.find(m => m.bibcode === '2020AJ....159...60G' && m.source === 'abstract');
        expect(match).toBeDefined();
        expect(match.priority).toBe(6);
        expect(match.title).toBe('Stellar flares from the first TESS data release: exploring a new sample of M dwarfs.');
        expect(match.doi).toBe('10.3847/1538-3881/ab5d3a');
        expect(match.context.startsWith('...')).toBe(false);
        expect(match.context.endsWith('...')).toBe(false);
        expect(match.context.toLowerCase()).toContain('stellar flares');
    });

    test('Match 4: keywords 2020ApJ...905..107M', () => {
        const match = stellarFlaresMatches.find(m => m.bibcode === '2020ApJ...905..107M' && m.source === 'keywords');
        expect(match).toBeDefined();
        expect(match.priority).toBe(5);
        expect(match.title).toBe('Flare rates, rotation periods, and spectroscopic activity indicators of a volume-complete sample of mid- to late-M dwarfs within 15 pc.');
        expect(match.doi).toBe('10.3847/1538-4357/abc686');
        expect(match.context.startsWith('...')).toBe(false);
        expect(match.context.endsWith('...')).toBe(false);
        expect(match.context.toLowerCase()).toContain('stellar flares');
    });
});

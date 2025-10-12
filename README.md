# StarVars Library

A simple JavaScript library to check for known variability of stars by querying the SIMBAD astronomical database.

## Idea

The library provides a function, `checkStarsVariability`, that takes a list of star identifiers (e.g., TIC IDs) and returns information about their potential variability based on data from SIMBAD. This is useful for quickly assessing whether a star has been previously identified as a variable star in astronomical literature.

## Features

- **Multi-faceted Variability Checks:** The library checks for variability through multiple indicators:
  - **Object Type (`otype`):** Checks the star's primary and other listed object types against a list of known variable star types (e.g., `EB*`, `RRLyr`).
  - **Bibliography (`bibcode`):** Checks if the star is mentioned in key astronomical catalogs and surveys known for classifying variable stars.
  - **Keyword Matching:** Performs case-insensitive searches for variability-related keywords (e.g., "variability", "eclipsing binary", "pulsating star") within the titles, abstracts, and keyword lists of associated publications.
- **Prioritized Results:** Matches are prioritized to highlight the most direct evidence of variability first.

## Getting Started

Simply include the `index.js` file in your HTML page:

```html
<script src="index.js"></script>
```

Then you can use the `checkStarsVariability` function in your own scripts.

## Usage

The function is asynchronous and returns a promise that resolves to an object. The keys of the object are the star IDs you provided, and the values are arrays of match objects.

```javascript
// Example:
document.addEventListener('DOMContentLoaded', async () => {
    const starsToTest = ['TIC 441734144', 'TIC 121489136'];
    const variabilityResults = await checkStarsVariability(starsToTest);
    console.log(JSON.stringify(variabilityResults, null, 2));
});
```

### Example Match Object

```json
{
  "source": "otype",
  "match_text": "EB*",
  "description": "Подвійна затемнювана зоря",
  "priority": 1
}
```

## Running Tests

To run the tests, you first need to install the development dependencies:

```bash
npm install
```

### Unit Tests

Unit tests mock the API response and do not make real network requests.

```bash
npm test
```

### Integration Tests

Integration tests make live requests to the SIMBAD API to verify the logic against real data.

```bash
npm run test:integration
```

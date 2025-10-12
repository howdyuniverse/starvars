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
<script src="https://cdn.jsdelivr.net/gh/howdyuniverse/starvars@v1.0.0/index.js" integrity="sha512-qVT1dS7l6hgbmSe/5zWqIeG4WVA3/yEAMVwneOLpYwcDeBdL2fumQfGtgQZPNfSPqSJGdTsHHMpizAz5YwWvdg==" crossorigin="anonymous" referrerpolicy="no-referrer" type="module"></script>
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

### Returned Object Structure

The `checkStarsVariability` function returns an object where each key is a star ID from the input array. The value for each key is an array of "match" objects, sorted by priority. Each match object contains information about a potential variability indicator.

The structure of a match object varies depending on its `source`:

- **`source: "otype"`** or **`"other_types"`**:
  - `source`: `"otype"` or `"other_types"`
  - `match_text`: The matched object type (e.g., `"EB*"`).
  - `description`: A description of the object type.
  - `priority`: A numerical priority (1 for `otype`, 2 for `other_types`).

- **`source: "bibcode"`**:
  - `source`: `"bibcode"`
  - `match_text`: The bibliographic code of the reference.
  - `title`: The title of the reference.
  - `priority`: A numerical priority (3).

- **`source: "title"`, `"keywords"`, or `"abstract"`**:
  - `source`: `"title"`, `"keywords"`, or `"abstract"`
  - `match_text`: The keyword that was matched.
  - `context`: The surrounding text where the keyword was found.
  - `bibcode`: The bibcode of the reference.
  - `title`: The title of the reference.
  - `priority`: A numerical priority (4 for `title`, 5 for `keywords`, 6 for `abstract`).

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

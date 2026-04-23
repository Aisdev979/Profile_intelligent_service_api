import country_name from "../data/country_name.js";

/**
 * Detect gender keywords and assign gender filter
 */
const extractGenderFromQuery = (queryText, filterState) => {
  const containsMaleKeywords = /\b(male|males|man|men|boy|boys)\b/.test(queryText);
  const containsFemaleKeywords = /\b(female|females|woman|women|girl|girls)\b/.test(queryText);

  if (containsMaleKeywords && !containsFemaleKeywords) {
    filterState.gender = "male";
  }

  if (containsFemaleKeywords && !containsMaleKeywords) {
    filterState.gender = "female";
  }

  // If both genders appear → do not apply gender filter
};

/**
 * Extract age-related filters (age group + numeric constraints)
 */
const extractAgeConstraintsFromQuery = (queryText, filterState) => {
  // Keyword-based age grouping
  if (queryText.includes("young")) {
    filterState.min_age = 16;
    filterState.max_age = 24;
  }

  if (/\bchild/.test(queryText)) filterState.age_group = "child";
  if (/\bteen/.test(queryText)) filterState.age_group = "teenager";
  if (/\badult/.test(queryText)) filterState.age_group = "adult";
  if (/\b(senior|elderly)/.test(queryText)) filterState.age_group = "senior";

  // Apply numeric age rules (above, below, range)
  applyNumericAgeConstraints(queryText, filterState);
};

/**
 * Handle numeric expressions like:
 * - above 30
 * - below 20
 * - 18 to 25
 */
const applyNumericAgeConstraints = (queryText, filterState) => {
  const numericPatterns = [
    {
      pattern: /(above|over|greater than|more than)\s+(\d+)/,
      handler: (value) => {
        filterState.min_age = value;
      },
    },
    {
      pattern: /(below|under|less than|younger than)\s+(\d+)/,
      handler: (value) => {
        filterState.max_age = value;
      },
    },
    {
      pattern: /(\d+)\s*(to|-|and)\s*(\d+)/,
      handler: (min, max) => {
        filterState.min_age = min;
        filterState.max_age = max;
      },
    },
  ];

  for (const rule of numericPatterns) {
    const match = queryText.match(rule.pattern);

    if (match) {
      const numericValues = match.slice(2).map(Number);
      rule.handler(...numericValues);
    }
  }
};

/**
 * Extract country from phrases like "from nigeria"
 */
const extractCountryFromQuery = (queryText, filterState) => {
  const words = queryText.split(" ");
  const fromKeywordIndex = words.indexOf("from");

  if (fromKeywordIndex !== -1 && words[fromKeywordIndex + 1]) {
    const countryPhrase = words.slice(fromKeywordIndex + 1).join(" ");
    const countryCode = resolveCountryCode(countryPhrase);

    if (countryCode) {
      filterState.country_id = countryCode;
    }
  }
};

/**
 * Resolve country name → country code
 */
const resolveCountryCode = (rawInput) => {
  const normalizedInput = rawInput.toLowerCase().trim();

  // Direct match
  if (country_name[normalizedInput]) {
    return country_name[normalizedInput];
  }

  // Partial match fallback
  for (const countryKey in country_name) {
    if (normalizedInput.includes(countryKey)) {
      return country_name[countryKey];
    }
  }

  return null;
};

/**
 * Normalize user input
 */
const normalizeQueryText = (inputText) => {
  return inputText.toLowerCase().trim();
};

/**
 * Main builder: converts natural language → structured filters
 */
export const buildFiltersFromText = (inputText) => {
  if (!inputText) return null;

  const normalizedText = normalizeQueryText(inputText);

  const filterState = {
    gender: null,
    age_group: null,
    min_age: null,
    max_age: null,
    country_id: null,
  };

  extractGenderFromQuery(normalizedText, filterState);
  extractAgeConstraintsFromQuery(normalizedText, filterState);
  extractCountryFromQuery(normalizedText, filterState);

  // Remove null values
  const activeFilters = Object.fromEntries(
    Object.entries(filterState).filter(([_, value]) => value !== null)
  );

  return Object.keys(activeFilters).length > 0 ? activeFilters : null;
};

/**
 * Convert filters → MongoDB query
 */
export const buildMongoQueryFromFilters = (filters) => {
  const mongoQuery = {};

  if (filters.gender) mongoQuery.gender = filters.gender;
  if (filters.age_group) mongoQuery.age_group = filters.age_group;
  if (filters.country_id) mongoQuery.country_id = filters.country_id;

  if (filters.min_age || filters.max_age) {
    mongoQuery.age = {};

    if (filters.min_age) mongoQuery.age.$gte = filters.min_age;
    if (filters.max_age) mongoQuery.age.$lte = filters.max_age;
  }

  return mongoQuery;
};

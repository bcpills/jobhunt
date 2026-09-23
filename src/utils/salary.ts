// Utilities to parse salary strings, compute benchmarks and prepare chart data

export interface ParsedSalary {
  min: number;
  max: number;
  midpoint: number;
  rawText: string;
}

/**
 * Parses salary strings like "$148,000 - $182,000 / yr + Equity" or "$135k - $160k"
 */
export function parseSalaryRange(salaryStr?: string): ParsedSalary {
  if (!salaryStr) {
    return { min: 130000, max: 165000, midpoint: 147500, rawText: '$130k - $165k' };
  }

  // Look for patterns like $148,000 or 148k or 148000
  const clean = salaryStr.replace(/,/g, '');
  // Match numbers followed by optional k
  const matches = [...clean.matchAll(/\$?(\d+)(k)?/gi)];

  if (matches.length >= 2) {
    let num1 = parseInt(matches[0][1], 10);
    if (matches[0][2]?.toLowerCase() === 'k' || num1 < 1000) {
      num1 *= 1000;
    }

    let num2 = parseInt(matches[1][1], 10);
    if (matches[1][2]?.toLowerCase() === 'k' || num2 < 1000) {
      num2 *= 1000;
    }

    const min = Math.min(num1, num2);
    const max = Math.max(num1, num2);
    return {
      min,
      max,
      midpoint: Math.round((min + max) / 2),
      rawText: salaryStr,
    };
  }

  if (matches.length === 1) {
    let num = parseInt(matches[0][1], 10);
    if (matches[0][2]?.toLowerCase() === 'k' || num < 1000) {
      num *= 1000;
    }
    return {
      min: Math.round(num * 0.9),
      max: Math.round(num * 1.1),
      midpoint: num,
      rawText: salaryStr,
    };
  }

  return { min: 130000, max: 165000, midpoint: 147500, rawText: salaryStr };
}

/**
 * Estimates industry/market benchmark salary for a given role title and seniority.
 */
export function getEstimatedMarketBenchmark(jobTitle: string, seniority?: string) {
  const titleLower = jobTitle.toLowerCase();
  let base25 = 135000;
  let baseMedian = 155000;
  let base75 = 178000;

  if (titleLower.includes('staff') || titleLower.includes('principal') || titleLower.includes('lead') || seniority === 'Staff/Lead') {
    base25 = 175000;
    baseMedian = 205000;
    base75 = 235000;
  } else if (titleLower.includes('director') || titleLower.includes('head') || seniority === 'Director/Executive') {
    base25 = 210000;
    baseMedian = 245000;
    base75 = 285000;
  } else if (titleLower.includes('junior') || seniority === 'Junior') {
    base25 = 85000;
    baseMedian = 102000;
    base75 = 120000;
  } else if (titleLower.includes('mid') || seniority === 'Mid-Level') {
    base25 = 115000;
    baseMedian = 132000;
    base75 = 150000;
  } else {
    // Senior default
    base25 = 145000;
    baseMedian = 168000;
    base75 = 192000;
  }

  return {
    percentile25: base25,
    median: baseMedian,
    percentile75: base75,
  };
}

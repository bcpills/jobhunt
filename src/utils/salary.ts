// Utilities to parse salary strings, compute benchmarks and prepare chart data

export interface ParsedSalary {
  min: number;
  max: number;
  midpoint: number;
  rawText: string;
}

/**
 * Parses salary strings like "$55,000 - $80,000 / yr", "$25 - $35/hr", or "$65k - $90k"
 */
export function parseSalaryRange(salaryStr?: string): ParsedSalary {
  if (!salaryStr) {
    return { min: 55000, max: 85000, midpoint: 70000, rawText: '$55k - $85k' };
  }

  const isHourly = /hr|hour|hourly/i.test(salaryStr);
  const clean = salaryStr.replace(/,/g, '');
  const matches = [...clean.matchAll(/\$?(\d+)(k)?/gi)];

  if (matches.length >= 2) {
    let num1 = parseInt(matches[0][1], 10);
    if (matches[0][2]?.toLowerCase() === 'k') {
      num1 *= 1000;
    } else if (isHourly && num1 < 200) {
      num1 *= 2080; // Convert 40hr/wk hourly to annual
    } else if (num1 < 1000 && !isHourly) {
      num1 *= 1000;
    }

    let num2 = parseInt(matches[1][1], 10);
    if (matches[1][2]?.toLowerCase() === 'k') {
      num2 *= 1000;
    } else if (isHourly && num2 < 200) {
      num2 *= 2080;
    } else if (num2 < 1000 && !isHourly) {
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
    if (matches[0][2]?.toLowerCase() === 'k') {
      num *= 1000;
    } else if (isHourly && num < 200) {
      num *= 2080;
    } else if (num < 1000 && !isHourly) {
      num *= 1000;
    }
    return {
      min: Math.round(num * 0.9),
      max: Math.round(num * 1.1),
      midpoint: num,
      rawText: salaryStr,
    };
  }

  return { min: 55000, max: 85000, midpoint: 70000, rawText: salaryStr };
}

/**
 * Estimates industry/market benchmark salary for a given role title and seniority.
 * Supports realistic, achievable bands for IT support, desktop tech, help desk, and operations.
 */
export function getEstimatedMarketBenchmark(jobTitle: string, seniority?: string) {
  const titleLower = (jobTitle || '').toLowerCase();
  const isITSupport =
    titleLower.includes('support') ||
    titleLower.includes('desktop') ||
    titleLower.includes('technician') ||
    titleLower.includes('helpdesk') ||
    titleLower.includes('service desk') ||
    titleLower.includes('specialist') ||
    titleLower.includes('operations') ||
    titleLower.includes('administrator') ||
    titleLower.includes('coordinator') ||
    titleLower.includes('analyst');

  if (isITSupport) {
    if (titleLower.includes('senior') || seniority === 'Senior' || seniority === 'Staff/Lead') {
      return {
        percentile25: 68000,
        median: 82000,
        percentile75: 98000,
      };
    }
    if (titleLower.includes('junior') || titleLower.includes('entry') || seniority === 'Junior') {
      return {
        percentile25: 42000,
        median: 52000,
        percentile75: 62000,
      };
    }
    // Mid-level IT Support
    return {
      percentile25: 54000,
      median: 65000,
      percentile75: 78000,
    };
  }

  // General Software / Engineering roles
  let base25 = 95000;
  let baseMedian = 120000;
  let base75 = 145000;

  if (titleLower.includes('staff') || titleLower.includes('principal') || titleLower.includes('lead') || seniority === 'Staff/Lead') {
    base25 = 145000;
    baseMedian = 175000;
    base75 = 205000;
  } else if (titleLower.includes('director') || titleLower.includes('head') || seniority === 'Director/Executive') {
    base25 = 175000;
    baseMedian = 210000;
    base75 = 245000;
  } else if (titleLower.includes('junior') || seniority === 'Junior') {
    base25 = 60000;
    baseMedian = 75000;
    base75 = 90000;
  } else if (titleLower.includes('mid') || seniority === 'Mid-Level') {
    base25 = 85000;
    baseMedian = 105000;
    base75 = 125000;
  } else {
    // Senior default
    base25 = 115000;
    baseMedian = 138000;
    base75 = 160000;
  }

  return {
    percentile25: base25,
    median: baseMedian,
    percentile75: base75,
  };
}

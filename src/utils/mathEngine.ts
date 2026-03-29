import { evaluate, format } from 'mathjs';

/**
 * Evaluates a mathematical expression and returns the result as a string.
 * Handles precision and errors.
 */
export const evaluateExpression = (expression: string): string => {
  try {
    // Replace visual operators with mathJS compatible ones
    const mathExpression = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '^')
      .replace(/π/g, 'pi')
      .replace(/e/g, 'e');

    const result = evaluate(mathExpression);
    
    // Format the result to avoid long floating point strings
    return format(result, { precision: 14, upperExp: 10, lowerExp: -10 });
  } catch (error) {
    console.error("Math Evaluation Error:", error);
    return "Error";
  }
};

/**
 * Formats a number string with commas for better readability.
 */
export const formatWithCommas = (value: string): string => {
  if (value === "Error" || value === "Infinity" || isNaN(Number(value))) return value;
  
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join('.');
};

/**
 * Checks if a character is a mathematical operator.
 */
export const isOperator = (char: string): boolean => {
  return ['+', '-', '*', '/', '×', '÷', '^', '%'].includes(char);
};

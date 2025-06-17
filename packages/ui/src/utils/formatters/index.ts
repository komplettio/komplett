/**
 * Formats a file size in bytes to a human-readable string (KB, MB, GB, etc.)
 * @param bytes - The file size in bytes
 * @param options - Formatting options
 * @returns A formatted string representing the file size
 */
export function formatFileSize(
  bytes: number,
  options: {
    locale?: string | string[];
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
  } = {},
): string {
  if (bytes === 0) return '0 Bytes';

  const { locale = 'en-US', maximumFractionDigits = 2, minimumFractionDigits = 0 } = options;

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const base = 1024;
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

  // Don't go beyond available units
  const safeUnitIndex = Math.min(unitIndex, units.length - 1);

  const value = bytes / Math.pow(base, safeUnitIndex);

  const formattedValue = new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);

  if (units[safeUnitIndex]) {
    return `${formattedValue} ${units[safeUnitIndex]}`;
  } else {
    return `${String(bytes)} Bytes`;
  }
}

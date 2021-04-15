/**
 * @param obj Arbitrary key/value
 * @param prefix Prefix to filter object keys by
 * @param trim Whether to remove prefix from keys in returned object
 * @returns Filtered set of key/values
 */
export const extractKeyPrefix = (
  obj: Record<string, string>,
  prefix: string,
  trim?: boolean
): Record<string, string> => {
  let entries = Object.entries(obj).filter(([key, value]) => key.startsWith(prefix));
  if (trim) {
    const idx = prefix.length;
    entries = entries.map(([key, value]) => [key.substr(idx), value]);
  }
  return Object.fromEntries(entries);
};

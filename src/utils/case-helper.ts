export const CaseHelper = {
  /**
   * Converts clean writing -> snake_case
   * "Capitalized Words Here" -> "capitalized_words_here"
   */
  toCleanCase(text: any): string {
    if (text === null || text === undefined) return "";
    return String(text)
      .trim()
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  },


  /**
   * Converts snake_case -> Clean Writing
   * "capitalized_words_here" -> "Capitalized Words Here"
   */
  toSnakeCase(text: any): string {
    if (text === null || text === undefined) return "";
    return String(text)
      .trim()
      .replace(/\s+/g, "_")
      .toLowerCase();
  }
};

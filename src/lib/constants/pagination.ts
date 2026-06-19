export const DEFAULT_PAGE_SIZE = 4;

export const PAGE_SIZE_OPTIONS = [4, 8, 12, 20] as const;

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

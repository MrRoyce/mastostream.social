import { getCounts as getCountsFunction } from './getCounts.js';
import { tootPosted as tootPostedFunction } from './tootPosted.js';
import { searchES as searchESFunction } from './searchES.js';
import { isUserAdmin as isUserAdminFunction } from './auth/onCallSetClaims.js';

export const getCounts = getCountsFunction;
export const tootPosted = tootPostedFunction;
export const searchES = searchESFunction;
export const isUserAdmin = isUserAdminFunction;

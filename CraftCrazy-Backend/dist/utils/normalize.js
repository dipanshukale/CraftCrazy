"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCategory = exports.toTitleCase = exports.formatText = void 0;
const formatText = (value) => value.trim().replace(/\s+/g, " ");
exports.formatText = formatText;
const toTitleCase = (value) => (0, exports.formatText)(value).replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
exports.toTitleCase = toTitleCase;
const normalizeCategory = (value) => (0, exports.formatText)(value).toLowerCase();
exports.normalizeCategory = normalizeCategory;

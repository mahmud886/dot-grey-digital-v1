/**
 * Editable page and section copy. Everything here is written by the CMS into
 * src/content/**, so components read strings from this module rather than hardcoding
 * them — otherwise editors cannot change them.
 */
import sectionsJson from "@/content/sections.json";
import home from "@/content/pages/home.json";
import inner from "@/content/pages/inner.json";
import legal from "@/content/pages/legal.json";

export const sections = sectionsJson;
export const pages = { home, ...inner };
export const legalPages = legal;

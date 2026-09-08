"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "../../../../keystatic.config";

/**
 * Must be a Client Component. Without "use client" the bundler resolves
 * @keystatic/core/ui through its react-server condition, which is a stub that renders
 * null — the admin page comes up blank with no error in the console.
 */
export default makePage(config);

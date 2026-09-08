/**
 * Next declares `*.module.css` but not plain stylesheet imports, and TypeScript 5.7+
 * reports an unresolvable side-effect import as an error. This makes `import "./globals.css"`
 * explicit rather than relying on the compiler being lenient.
 */
declare module "*.css";

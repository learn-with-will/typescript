// Prism core + the languages the TypeScript lessons use. `prism-typescript`
// extends `prism-javascript`, so JavaScript must be imported first. `bash` covers
// shell commands (npm, tsc), `json` covers tsconfig and package.json payloads.
// Plain terminal output, type-checker errors, and diagrams use the `text` fence,
// which Prism leaves unhighlighted.
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export default Prism;

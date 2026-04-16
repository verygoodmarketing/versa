// Next.js requires a file named `middleware.ts` at the project root
// exporting a `middleware` function (and optional `config`).
// The implementation lives in proxy.ts to keep this file minimal.
export { proxy as middleware, config } from "./proxy";

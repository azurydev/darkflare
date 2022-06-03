# changelog

#### Archived Releases:

- [**v2**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v2.md)
- [**v1**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v1.md)

## v3.1.1

### Changes:

- **Patched dependencies.**

  - bumped `@types/jest` to **v28.1.0**
  - bumped `@tsndr/cloudflare-worker-jwt` to **v1.2.0**
  - bumped `ts-jest` to **v28.0.4**
  - bumped `turbo` to **v1.2.16**

## v3.1.0

### New Features:

- **Write middlewares the safer way.**

  You should now declare a middleware right from within your route file. The old method of creating a separate `_middleware.ts` file will be marked as deprecated for now and gets removed with the release of **darkflare v4**.

  ```typescript
  import type { Handler } from 'darkflare'

  const beforeAll: Handler = async req => {
    req.whatever = 'Hello World'
  }

  const Get: Handler = async req => {
    // respond with Hello World
    return req.whatever
  }

  export {
    beforeAll,
    Get
  }
  ```

### Changes:

- **Deprecated Service Worker format.**

  Disabling `modules` in your darkflare config file will now give out a warning on console. We'll completely remove support for the Service Worker format in **darkflare v4**.

- **Patched dependencies.**

  - bumped `miniflare` to **v2.5.0** *(dev-only)*
  - bumped `@types/node` to **v17.0.38** *(dev-only)*
  - bumped `esbuild` to **v0.14.42**

## v3.0.6

### Bug Fixes:

- **Fixed build log.**
  
  Added lacking increase of the counter to display the correct amount of processed routes.

### Other Changes:

- **Patched dependencies.**

  - patched `ts-jest`
  - patched `typescript`
  - patched `turbo`

## v3.0.5

### Changes:

- **Patched dependencies and removed unused ones.**

  - patched `turbo`
  - removed `@cloudflare/workers-types`

## v3.0.4

### Changes:

- **Made the types more flexible and added comments for better understanding.**

  We're no longer importing any types from `@cloudflare/workers-types`.
  
  You can now extend the `DarkflareRequest` type:
  ```typescript
  type CustomRequest = DarkflareRequest<Params, Env>
  ```
  
  You can now extend the `Handler` type:
  
  ```typescript
  type CustomHandler = Handler<Request, Response>
  ```

## v3.0.3

### Bug Fixes:

- **Fixed the generation of a new darkflare project in Modules Worker format.**

  Added missing `globs` option to build upload rules.

## v3.0.2

### Bug Fixes:

- **Fixed the generation of a non-modules worker script.**

  An issue in the fallback configuration made it impossible to generate a non-modules worker script or set any options in the configuration to `false`.

## v3.0.0 & v3.0.1

### Breaking Changes:

- **Changed the form of routes to a more stable variant.**
  
  A old route:

  ```typescript
  import type { Handler } from 'darkflare'

  export default {
    get: async () => {
      return 'Hello World'
    }
  }
  ```

  The new version of it:

  ```typescript
  import type { Handler } from 'darkflare'

  export const Get: Handler = async () => {
    return 'Hello World'
  }
  ```

### Bug Fixes:

- **Fixed an issue that led the building process to fail because it couldn't understand web APIs.**
  
  The Web Crypto API *should* work in Cloudflare Workers. Now, the below code snippet should also work with darkflare:

  ```typescript
  import type { Handler } from 'darkflare'

  export const Get: Handler = async () => {
    return crypto.randomUUID()
  }
  ```

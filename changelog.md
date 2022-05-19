# changelog

#### Archived Releases:

- [**v2**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v2.md)
- [**v1**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v1.md)

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

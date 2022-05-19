# changelog

#### Archived Releases:

- [**v2**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v2.md)
- [**v1**](https://github.com/azurydev/darkflare/blob/canary/changelogs/v1.md)

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

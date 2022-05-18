## Routes

### Introduction

> All your routes live in the `routes` directory under the `src` directory. You can have different types of routes as described in the following.

### Create a new Route

```typescript
import type { Handler } from 'darkflare'

export const Get: Handler = async (req, res) => {
  return 'Hello World'
}
```

#### Supported Methods:

- `Get`
- `Put`
- `Patch`
- `Post`
- `Delete`
- `Head`

### Special Types

- #### Index Routes

  darkflare will automatically route files named index to the root of the directory.
  
  - `routes/index.ts` → `/`
  - `routes/api/index.ts` → `/api`

- #### Dynamic Routes

  To match a dynamic segment, you can use the bracket syntax. This allows you to match named parameters.
  
  - `routes/api/[slug].ts` → `/api/:slug` aka. `/api/about`
  - `routes/users/[userId]/name.ts` → `/users/:userId/name` aka. `/users/abcdef/name`

- #### Nested Routes

  darkflare supports nested files. If you create a nested folder structure, files will automatically be routed in the same way still.
  
  - `routes/users/@me/settings.ts` → `/users/@me/settings`
  - `routes/api/about.ts` → `/api/about`

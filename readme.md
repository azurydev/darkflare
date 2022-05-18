## darkflare

### Introduction

> darkflare is a TypeScript framework for Cloudflare workers. The framework is the **foundation** for your project and serves as the **compiler** for your file-based routing app. darkflare generates a lightweight, bundled and minified worker script that leverages `itty-router` under the hood for the routing part. **Our main goal is to provide developers with a straightforward way to create scalable and maintainable production-ready APIs.**

#

### Setup

> Creates a new project with **darkflare** and **Module Workers** syntax.

```sh-session
npx @darkflare/new --modules
```

#

### Guide

- #### Core
  - [`Configuration`](https://github.com/azurydev/darkflare/blob/canary/guide/configuration.md)
  - [`Routes`](https://github.com/azurydev/darkflare/blob/canary/guide/routes.md)
  - [`Middlewares`](https://github.com/azurydev/darkflare/blob/canary/guide/middlewares.md)
  - [`Request`](https://github.com/azurydev/darkflare/blob/canary/guide/request.md)
  - [`Response`](https://github.com/azurydev/darkflare/blob/canary/guide/response.md)

- #### Packages
  - [`jwt`](https://github.com/azurydev/darkflare/blob/canary/guide/packages/jwt.md)
  - [`new`](https://github.com/azurydev/darkflare/blob/canary/guide/packages/new.md)

#

### Example

> To make sure you're not left in the dark, we've created a sample app using [`npx @darkflare/new --modules`](sample-modules-app) and [`npx @darkflare/new`](sample-app).

#

### Contributing

> We'd love to hear all your amazing ideas, feel free to post them [here](https://github.com/azurydev/darkflare/issues/new/choose).

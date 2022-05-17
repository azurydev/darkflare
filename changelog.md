# changelog

### v2.0.0

#### Breaking Changes:

- darkflare now uses the [module workers](https://developers.cloudflare.com/workers/learning/migrating-to-module-workers/) syntax by default
- split packages into separate directories
- renamed build command to `darkflare build`
- removed `preValidation` hook

#### New Features:

- added **unit tests** to be safer in future
- added **middlewares**, an enhanced version of hooks
- added option to **disable handling preflight requests** by browsers
- added option to **opt-out of new module workers syntax**
- added option to **disable minification**
- added `json()` method to `res` object for alternative usage
- added `text()` method to `res` object for alternative usage

#### Bug Fixes:

- fixed default route `/` to respond properly to requests
- fixed `.redirect()` method which didn't actually redirect
- fixed the setting of custom headers
- fixed an issue regarding the build process which led darkflare to think comments are actual route handlers
- fixed type declaration for `.redirect()` method
- added a fallback for `IncomingRequestCfProperties` type in case `@cloudflare/workers-types` is not installed
- fixed an issue that led to an invalid `content-type` header

## v1

### v1.1.0

#### New Features:

- allow strings as return type in routes

#### Changes:

- fixed Darkflare for Linux
- added fallback config

### v1.0.0

Released `@darkflare/new`.

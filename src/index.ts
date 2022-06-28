//import { Type } from './packages/core';

import { Static, Type } from '@sinclair/typebox';

const type = Type.String()

const lol = typeof type

type T = Static<typeof type>

import { TypeCompiler } from '@sinclair/typebox/compiler'
import type { TSchema } from '@sinclair/typebox'

export const validate = async (e: TSchema, a: unknown) => {
  const compiledSchema = TypeCompiler.Compile(e)

  return compiledSchema.Check(a)
}

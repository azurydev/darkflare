import { TypeCompiler } from '@sinclair/typebox/compiler'
import type { TSchema } from '@sinclair/typebox'

export const validate = async (expected: TSchema, actual: unknown) => {
  const compiledSchema = TypeCompiler.Compile(expected)

  return compiledSchema.Check(actual)
}

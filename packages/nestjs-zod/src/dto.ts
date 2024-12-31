/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodSchema, ZodTypeDef, input, output } from '@nest-zod/z'

export interface ZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
  T = TOutput,
> {
  new (): T
  isZodDto: true
  schema: ZodSchema<TOutput, TDef, TInput>
  direction?: 'input' | 'output'
  create(input: unknown): T
}

export function createZodDto<
  TOutput = any,
  TDef extends ZodTypeDef = ZodTypeDef,
  TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
  class AugmentedZodDto {
    public static isZodDto = true
    public static schema = schema

    public static create(input: unknown) {
      return this.schema.parse(input)
    }
  }

  return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>
}

export function createZodInputDto<S extends ZodSchema>(
  schema: S,
): ZodDto<output<S>, ZodTypeDef, input<S>, output<S>> {
  const cls = createZodDto(schema)
  cls.direction = 'input'
  return cls
}

export function createZodOutputDto<S extends ZodSchema>(
  schema: S,
): ZodDto<output<S>, ZodTypeDef, input<S>, input<S>> {
  const cls = createZodDto(schema)
  cls.direction = 'output'
  return cls
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isZodDto(metatype: any): metatype is ZodDto<unknown> {
  return metatype?.isZodDto
}

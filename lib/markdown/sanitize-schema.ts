import { defaultSchema } from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";

export const markdownSanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "details", "summary"],
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), "className"],
    span: [...(defaultSchema.attributes?.span ?? []), "className"],
    div: [...(defaultSchema.attributes?.div ?? []), "className"],
    pre: [...(defaultSchema.attributes?.pre ?? []), "className"],
    img: [...(defaultSchema.attributes?.img ?? []), "loading", "className"],
    a: [...(defaultSchema.attributes?.a ?? []), "target", "rel", "className"],
    h1: [...(defaultSchema.attributes?.h1 ?? []), "id", "className"],
    h2: [...(defaultSchema.attributes?.h2 ?? []), "id", "className"],
    h3: [...(defaultSchema.attributes?.h3 ?? []), "id", "className"],
    h4: [...(defaultSchema.attributes?.h4 ?? []), "id", "className"],
    h5: [...(defaultSchema.attributes?.h5 ?? []), "id", "className"],
    h6: [...(defaultSchema.attributes?.h6 ?? []), "id", "className"],
  },
};

export type DevToolCategoryId =
  | "data"
  | "yaml"
  | "xml"
  | "csv"
  | "css"
  | "tailwind"
  | "layout"
  | "color"
  | "svg"
  | "image"
  | "qr"
  | "encoding"
  | "generators"
  | "network";

export type DevToolUi = "standard" | "playground" | "generator" | "media" | "compare";

export type DevToolEngine =
  | "json"
  | "yaml"
  | "xml"
  | "csv"
  | "css"
  | "tailwind"
  | "flexbox"
  | "grid"
  | "color"
  | "svg"
  | "image"
  | "qr"
  | "barcode"
  | "encoding"
  | "uuid"
  | "nanoid"
  | "password"
  | "hash"
  | "jwt"
  | "timestamp"
  | "lorem"
  | "random"
  | "network";

export type DevToolOperation =
  | "view"
  | "format"
  | "validate"
  | "minify"
  | "prettify"
  | "compare"
  | "to-csv"
  | "to-yaml"
  | "to-xml"
  | "to-json"
  | "to-typescript"
  | "to-interface"
  | "tree"
  | "beautify"
  | "parse"
  | "filter"
  | "edit"
  | "generate"
  | "convert"
  | "encode"
  | "decode"
  | "compress"
  | "resize"
  | "crop"
  | "optimize"
  | "metadata"
  | "favicon"
  | "preview"
  | "to-jsx"
  | "to-react"
  | "clean"
  | "color-edit"
  | "picker"
  | "palette"
  | "gradient"
  | "contrast"
  | "a11y"
  | "random-palette"
  | "playground"
  | "class-builder"
  | "grid-builder"
  | "flex-builder"
  | "shadow"
  | "spacing"
  | "config"
  | "glass"
  | "neumorphism"
  | "clamp"
  | "animation"
  | "border-radius"
  | "strength"
  | "decode-jwt"
  | "encode-jwt"
  | "unix"
  | "cidr"
  | "subnet"
  | "ip"
  | "headers"
  | "user-agent"
  | "dns"
  | "ports";

export type DevToolDefinition = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategoryId;
  engine: DevToolEngine;
  operation: DevToolOperation;
  icon: string;
  ui?: DevToolUi;
  popular?: boolean;
  featured?: boolean;
  inputLabel?: string;
  outputLabel?: string;
  inputPlaceholder?: string;
  sampleInput?: string;
  acceptsFile?: boolean;
  fileTypes?: string;
};

export type DevToolCategory = {
  id: DevToolCategoryId;
  label: string;
  emoji: string;
  description: string;
};

export type ToolResult = {
  output: string;
  error?: string;
  secondary?: string;
};

export type ToolTransformOptions = {
  input: string;
  inputB?: string;
  options?: Record<string, string | number | boolean>;
};

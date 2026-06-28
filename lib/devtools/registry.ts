import type { DevToolCategoryId, DevToolDefinition, DevToolEngine, DevToolOperation, DevToolUi } from "./types";

type T = {
  slug: string;
  title: string;
  description: string;
  category: DevToolCategoryId;
  engine: DevToolEngine;
  operation: DevToolOperation;
  icon?: string;
  ui?: DevToolUi;
  popular?: boolean;
  featured?: boolean;
  acceptsFile?: boolean;
  fileTypes?: string;
  sampleInput?: string;
};

function d(x: T): DevToolDefinition {
  const icons: Record<string, string> = {
    data: "Braces", yaml: "FileText", xml: "FileCode", csv: "Table",
    css: "Palette", tailwind: "Wind", layout: "LayoutGrid", color: "Pipette",
    svg: "Image", image: "ImageIcon", qr: "QrCode", encoding: "Lock",
    generators: "Zap", network: "Globe",
  };
  return {
    icon: icons[x.category] ?? "Wrench",
    inputLabel: "Input",
    outputLabel: "Output",
    ...x,
  };
}

const JSON_TOOLS = [
  ["json-viewer", "JSON Viewer", "Explore and view JSON data with syntax highlighting.", "view"],
  ["json-formatter", "JSON Formatter", "Format and beautify JSON with proper indentation.", "format", true],
  ["json-validator", "JSON Validator", "Validate JSON syntax and catch errors.", "validate"],
  ["json-minifier", "JSON Minifier", "Compress JSON by removing whitespace.", "minify"],
  ["json-prettifier", "JSON Prettifier", "Pretty-print JSON for readability.", "prettify", true],
  ["json-compare", "JSON Compare", "Compare two JSON documents side by side.", "compare"],
  ["json-to-csv", "JSON to CSV", "Convert JSON arrays to CSV format.", "to-csv"],
  ["json-to-yaml", "JSON to YAML", "Convert JSON to YAML format.", "to-yaml"],
  ["json-to-xml", "JSON to XML", "Convert JSON structures to XML.", "to-xml"],
  ["json-to-typescript", "JSON to TypeScript", "Generate TypeScript types from JSON.", "to-typescript"],
  ["json-to-interface", "JSON to Interface", "Generate TypeScript interfaces from JSON.", "to-interface"],
  ["json-tree-viewer", "JSON Tree Viewer", "Visualize JSON as an expandable tree.", "tree"],
] as const;

const YAML_TOOLS = [
  ["yaml-viewer", "YAML Viewer", "View and explore YAML documents.", "view"],
  ["yaml-formatter", "YAML Formatter", "Format YAML with consistent indentation.", "format"],
  ["yaml-validator", "YAML Validator", "Validate YAML syntax.", "validate"],
  ["yaml-to-json", "YAML to JSON", "Convert YAML to JSON format.", "to-json", true],
] as const;

const XML_TOOLS = [
  ["xml-formatter", "XML Formatter", "Format XML with proper indentation.", "format"],
  ["xml-validator", "XML Validator", "Validate XML document structure.", "validate"],
  ["xml-beautifier", "XML Beautifier", "Beautify XML for readability.", "beautify"],
  ["xml-minifier", "XML Minifier", "Minify XML by removing whitespace.", "minify"],
  ["xml-to-json", "XML to JSON", "Convert XML to JSON format.", "to-json", true],
] as const;

const CSV_TOOLS = [
  ["csv-viewer", "CSV Viewer", "View and inspect CSV data.", "view"],
  ["csv-editor", "CSV Editor", "Edit CSV data in a text editor.", "edit"],
  ["csv-formatter", "CSV Formatter", "Format and normalize CSV files.", "format"],
  ["csv-to-json", "CSV to JSON", "Convert CSV to JSON arrays.", "to-json", true],
  ["csv-parser", "CSV Parser", "Parse CSV into structured JSON.", "parse"],
  ["csv-filter", "CSV Filter", "Filter CSV rows by search query.", "filter"],
] as const;

const CSS_TOOLS = [
  ["css-beautifier", "CSS Beautifier", "Beautify CSS with proper formatting.", "beautify", true],
  ["css-minifier", "CSS Minifier", "Minify CSS for production.", "minify"],
  ["css-generator", "CSS Generator", "Generate common CSS snippets.", "generate"],
  ["css-gradient-generator", "CSS Gradient Generator", "Create linear gradient CSS.", "gradient", true],
  ["css-shadow-generator", "CSS Shadow Generator", "Generate box-shadow CSS.", "shadow"],
  ["css-border-radius-generator", "Border Radius Generator", "Generate border-radius CSS.", "border-radius"],
  ["css-animation-generator", "CSS Animation Generator", "Generate keyframe animations.", "animation"],
  ["glassmorphism-generator", "Glassmorphism Generator", "Generate glassmorphism card CSS.", "glass", true],
  ["neumorphism-generator", "Neumorphism Generator", "Generate neumorphic UI CSS.", "neumorphism"],
  ["css-clamp-generator", "CSS Clamp Generator", "Generate fluid clamp() typography.", "clamp"],
] as const;

const TAILWIND_TOOLS = [
  ["tailwind-playground", "Tailwind Playground", "Experiment with Tailwind utility classes.", "playground"],
  ["tailwind-color-generator", "Tailwind Color Generator", "Generate Tailwind color utilities.", "generate"],
  ["tailwind-class-builder", "Tailwind Class Builder", "Build Tailwind class strings.", "class-builder"],
  ["tailwind-grid-builder", "Tailwind Grid Builder", "Build Tailwind grid layouts.", "grid-builder"],
  ["tailwind-flex-builder", "Tailwind Flex Builder", "Build Tailwind flexbox utilities.", "flex-builder"],
  ["tailwind-shadow-generator", "Tailwind Shadow Generator", "Generate Tailwind shadow classes.", "shadow"],
  ["tailwind-spacing-generator", "Tailwind Spacing Generator", "Generate padding and margin classes.", "spacing"],
  ["tailwind-config-preview", "Tailwind Config Preview", "Preview a Tailwind config file.", "config"],
] as const;

const COLOR_TOOLS = [
  ["color-picker", "Color Picker", "Pick colors and get HEX, RGB, HSL values.", "picker"],
  ["color-palette-generator", "Color Palette Generator", "Generate harmonious color palettes.", "palette"],
  ["color-converter", "HEX RGB HSL Converter", "Convert between HEX, RGB, and HSL.", "convert", true],
  ["gradient-generator", "Gradient Generator", "Create CSS gradient strings.", "gradient"],
  ["contrast-checker", "Contrast Checker", "Check WCAG color contrast ratios.", "contrast", true],
  ["accessibility-checker", "Accessibility Checker", "Verify color accessibility compliance.", "a11y"],
  ["random-palette-generator", "Random Palette Generator", "Generate random color palettes.", "random-palette"],
] as const;

const SVG_TOOLS = [
  ["svg-optimizer", "SVG Optimizer", "Optimize SVG file size.", "minify"],
  ["svg-preview", "SVG Preview", "Preview SVG markup live.", "preview"],
  ["svg-compressor", "SVG Compressor", "Compress SVG by removing whitespace.", "compress"],
  ["svg-to-jsx", "SVG to JSX", "Convert SVG to React JSX.", "to-jsx", true],
  ["svg-to-react-component", "SVG to React Component", "Convert SVG to a React component.", "to-react"],
  ["svg-cleaner", "SVG Cleaner", "Remove comments and clean SVG.", "clean"],
  ["svg-color-editor", "SVG Color Editor", "Edit SVG fill and stroke colors.", "color-edit"],
] as const;

const IMAGE_TOOLS = [
  ["image-compressor", "Image Compressor", "Compress images in the browser.", "compress"],
  ["image-resizer", "Image Resizer", "Resize images to custom dimensions.", "resize"],
  ["image-cropper", "Image Cropper", "Crop images interactively.", "crop"],
  ["image-converter", "Image Converter", "Convert between image formats.", "convert"],
  ["png-jpg-webp-converter", "PNG JPG WEBP Converter", "Convert PNG, JPG, and WEBP.", "convert", true],
  ["image-optimizer", "Image Optimizer", "Optimize images for the web.", "optimize"],
  ["image-metadata-viewer", "Image Metadata Viewer", "View image dimensions and metadata.", "metadata"],
  ["favicon-generator", "Favicon Generator", "Generate favicons from images.", "favicon"],
] as const;

const ENCODING_TOOLS = [
  ["base64-encode", "Base64 Encode", "Encode text to Base64.", "encode"],
  ["base64-decode", "Base64 Decode", "Decode Base64 to text.", "decode"],
  ["url-encode", "URL Encode", "Percent-encode URLs and strings.", "encode"],
  ["url-decode", "URL Decode", "Decode percent-encoded strings.", "decode"],
  ["html-encode", "HTML Encode", "Encode HTML entities.", "encode"],
  ["html-decode", "HTML Decode", "Decode HTML entities.", "decode"],
  ["unicode-converter", "Unicode Converter", "Convert text to Unicode escape sequences.", "encode"],
  ["ascii-converter", "ASCII Converter", "Convert text to ASCII codes.", "encode"],
  ["binary-converter", "Binary Converter", "Convert text to binary.", "encode"],
  ["hex-converter", "Hex Converter", "Convert text to hexadecimal.", "encode"],
] as const;

const GENERATOR_TOOLS = [
  ["uuid-generator", "UUID Generator", "Generate RFC 4122 UUIDs.", "generate", true, true],
  ["nanoid-generator", "Nano ID Generator", "Generate compact unique IDs.", "generate"],
  ["password-generator", "Password Generator", "Generate secure random passwords.", "generate", true, true],
  ["password-strength-checker", "Password Strength Checker", "Analyze password strength.", "strength"],
  ["hash-generator", "Hash Generator", "Generate SHA-256 and SHA-512 hashes.", "generate"],
  ["jwt-decoder", "JWT Decoder", "Decode and inspect JWT tokens.", "decode-jwt", true],
  ["jwt-encoder", "JWT Encoder", "Encode JWT header and payload.", "encode-jwt"],
  ["timestamp-converter", "Timestamp Converter", "Convert Unix timestamps to dates.", "unix"],
  ["unix-time-converter", "Unix Time Converter", "Convert between Unix time and ISO dates.", "unix"],
  ["lorem-ipsum-generator", "Lorem Ipsum Generator", "Generate placeholder text.", "generate"],
  ["random-string-generator", "Random String Generator", "Generate random strings.", "generate"],
  ["random-number-generator", "Random Number Generator", "Generate random numbers in a range.", "generate"],
] as const;

const NETWORK_TOOLS = [
  ["ip-address-lookup", "IP Address Lookup", "Analyze IP address information.", "ip"],
  ["cidr-calculator", "CIDR Calculator", "Calculate network ranges from CIDR.", "cidr", true],
  ["subnet-calculator", "Subnet Calculator", "Calculate subnet masks and hosts.", "subnet", true],
  ["http-header-viewer", "HTTP Header Viewer", "Parse and view HTTP headers.", "headers"],
  ["user-agent-parser", "User Agent Parser", "Parse browser user agent strings.", "user-agent"],
  ["dns-lookup", "DNS Lookup", "DNS lookup reference (placeholder).", "dns"],
  ["port-reference-guide", "Port Reference Guide", "Common TCP/UDP port numbers.", "ports"],
] as const;

function mapTools(
  items: readonly (readonly [string, string, string, DevToolOperation, boolean?, boolean?])[],
  category: DevToolCategoryId,
  engine: DevToolEngine,
  extra?: Partial<DevToolDefinition>
): DevToolDefinition[] {
  return items.map(([slug, title, description, operation, popular, featured]) =>
    d({ slug, title, description, category, engine, operation, popular, featured, ...extra })
  );
}

const DATA = mapTools(JSON_TOOLS, "data", "json", { acceptsFile: true, fileTypes: ".json", ui: "standard" });
const YAML = mapTools(YAML_TOOLS, "yaml", "yaml", { acceptsFile: true, fileTypes: ".yaml,.yml" });
const XML = mapTools(XML_TOOLS, "xml", "xml", { acceptsFile: true, fileTypes: ".xml" });
const CSV = mapTools(CSV_TOOLS, "csv", "csv", { acceptsFile: true, fileTypes: ".csv" });
const CSS = mapTools(CSS_TOOLS, "css", "css", { ui: "generator" });
const TAILWIND = mapTools(TAILWIND_TOOLS, "tailwind", "tailwind", { ui: "generator" });
const COLOR = mapTools(COLOR_TOOLS, "color", "color", { ui: "generator" });
const SVG = mapTools(SVG_TOOLS, "svg", "svg", { acceptsFile: true, fileTypes: ".svg" });
const IMAGE = mapTools(IMAGE_TOOLS, "image", "image", { ui: "media", acceptsFile: true, fileTypes: "image/*" });
const ENCODING = ENCODING_TOOLS.map(([slug, title, description, operation]) => {
  const op = operation as DevToolOperation;
  return d({ slug, title, description, category: "encoding", engine: "encoding", operation: op, popular: slug.includes("base64"), sampleInput: "Hello, CampusFlow!" });
});
const GENERATORS = GENERATOR_TOOLS.map(([slug, title, description, operation, popular, featured]) =>
  d({
    slug, title, description, category: "generators",
    engine: slug.includes("uuid") ? "uuid" : slug.includes("nanoid") ? "nanoid" : slug.includes("password") ? "password" : slug.includes("hash") ? "hash" : slug.includes("jwt") ? "jwt" : slug.includes("timestamp") || slug.includes("unix") ? "timestamp" : slug.includes("lorem") ? "lorem" : "random",
    operation: operation as DevToolOperation,
    popular, featured,
    ui: slug.includes("hash") ? "standard" : "generator",
  })
);
const NETWORK = mapTools(NETWORK_TOOLS, "network", "network");

const LAYOUT: DevToolDefinition[] = [
  d({ slug: "flexbox-playground", title: "Flexbox Playground", description: "Interactive flexbox editor with live CSS output.", category: "layout", engine: "flexbox", operation: "playground", icon: "Layout", ui: "playground", popular: true, featured: true }),
  d({ slug: "css-grid-playground", title: "CSS Grid Playground", description: "Interactive CSS Grid editor with live preview.", category: "layout", engine: "grid", operation: "playground", icon: "Grid3x3", ui: "playground", popular: true, featured: true }),
];

const QR_TOOLS: DevToolDefinition[] = [
  d({ slug: "qr-generator", title: "QR Code Generator", description: "Generate QR codes for URL, text, email, WiFi, and more.", category: "qr", engine: "qr", operation: "generate", icon: "QrCode", ui: "generator", popular: true, featured: true }),
  d({ slug: "barcode-generator", title: "Barcode Generator", description: "Generate barcodes and QR codes as PNG/SVG.", category: "qr", engine: "barcode", operation: "generate", icon: "Barcode", ui: "generator", popular: true }),
];

// JSON compare needs dual input
const compareTool = DATA.find((t) => t.slug === "json-compare");
if (compareTool) compareTool.ui = "compare";

export const ALL_DEVTOOLS: DevToolDefinition[] = [
  ...DATA,
  ...YAML,
  ...XML,
  ...CSV,
  ...CSS,
  ...TAILWIND,
  ...LAYOUT,
  ...COLOR,
  ...SVG,
  ...IMAGE,
  ...QR_TOOLS,
  ...ENCODING,
  ...GENERATORS,
  ...NETWORK,
];

export const DEVTOOL_SLUGS = ALL_DEVTOOLS.map((t) => t.slug);

export const POPULAR_DEVTOOLS = ALL_DEVTOOLS.filter((t) => t.popular);
export const FEATURED_DEVTOOLS = ALL_DEVTOOLS.filter((t) => t.featured);

export function getDevTool(slug: string) {
  return ALL_DEVTOOLS.find((t) => t.slug === slug);
}

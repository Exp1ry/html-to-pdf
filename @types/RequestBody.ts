export interface IRequest {
  html: string;
  displayHeaderFooter?: boolean;
  footerTemplate?: string;
  format:
    | "letter"
    | "legal"
    | "tabloid"
    | "ledge"
    | "a0"
    | "a1"
    | "a2"
    | "a3"
    | "a4"
    | "a5"
    | "a6";
  headerTemplate?: string;
  height?: string;
  landscape?: boolean;
  margin?: MarginType;
  omitBackground?: boolean;
  pageRanges?: string;
  path?: boolean;
  preferCSSPageSize?: boolean;
  printBackground?: boolean;
  scale?: number;
  timeout?: number;
  width?: string;
}

export type MarginType = {
  bottom?: number;
  right?: number;
  top?: number;
  left?: number;
};

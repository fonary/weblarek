/// <reference types="vite/client" />

declare module '*.scss' {
  const styles: Record<string, string>;
  export default styles;
}

interface ImportMetaEnv {
  readonly VITE_API_ORIGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
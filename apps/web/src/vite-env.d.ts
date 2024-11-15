/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URI: string;
  readonly VITE_GIT_SHA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

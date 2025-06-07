/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BAIDU_AK: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
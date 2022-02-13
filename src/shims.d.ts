declare module 'md5-file' {
  var md5Promise: {
    (filename: string): Promise<string>;
    sync: (filename: string) => string;
  };

  export = md5Promise;
}

declare module '*.svelte';

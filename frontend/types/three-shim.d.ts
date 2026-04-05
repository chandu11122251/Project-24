declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  export type GLTF = {
    scene: {
      [key: string]: unknown;
    };
  };

  export class GLTFLoader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent<EventTarget>) => void,
      onError?: (error: unknown) => void
    ): void;
  }
}

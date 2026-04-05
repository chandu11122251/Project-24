"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { layoutNextLine, prepareWithSegments, type PreparedTextWithSegments } from "@chenglou/pretext";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ModelWrappedTextCard({
  className,
  targetRef,
  animateOnView,
}: {
  className?: string;
  targetRef?: React.RefObject<HTMLDivElement | null>;
  animateOnView?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const animateOnViewRef = useRef(Boolean(animateOnView));

  useEffect(() => {
    animateOnViewRef.current = Boolean(animateOnView);
  }, [animateOnView]);

  useEffect(() => {
    const root = rootRef.current;
    const textCanvas = textCanvasRef.current;
    if (!root || !textCanvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.mixBlendMode = "normal";
    root.innerHTML = "";
    root.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 4000);
    camera.position.set(0, 0, 1300);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    const keyLight = new THREE.DirectionalLight(0xa5f3fc, 1.6);
    keyLight.position.set(180, 320, 540);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x67e8f9, 1.0);
    rimLight.position.set(-260, 220, -420);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(0, -180, 320);
    scene.add(fillLight);

    const dragonGroup = new THREE.Group();
    scene.add(dragonGroup);

    const loader = new GLTFLoader();

    let activeModel: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let dragonBaseScale = 1;
    let frameId = 0;
    const clock = new THREE.Clock();

    const dragonWrapBounds = { centerX: 0, centerY: 0, halfWidth: 1, halfHeight: 1 };
    const dragonBox = new THREE.Box3();
    const projectionVector = new THREE.Vector3();

    const dragon = {
      loaded: false,
      x: 120,
      y: 110,
      baseX: 120,
      baseY: 110,
      time: 0,
      pathDuration: 20,
      width: 360,
      height: 360,
    };
    const animationLeadSeconds = 3;
    let leadApplied = false;

    const textFont = "500 15px 'Segoe UI', sans-serif";
    const lineHeight = 24;
    const preparedTextCache = new Map<string, PreparedTextWithSegments>();

    const rotationX = THREE.MathUtils.degToRad(270);
    const rotationY = THREE.MathUtils.degToRad(520);
    const rotationZ = THREE.MathUtils.degToRad(90);

    const textureCache = new Map<string, THREE.Texture>();

    const loadCachedTexture = (uri: string | null | undefined) => {
      if (!uri) return null;
      const normalized = uri.startsWith("/") ? uri : `/${uri}`;
      const existing = textureCache.get(normalized);
      if (existing) return existing;

      const texture = new THREE.TextureLoader().load(normalized);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.needsUpdate = true;
      textureCache.set(normalized, texture);
      return texture;
    };

    const convertSpecGlossToStandardMaterial = (gltf: any, rootModel: THREE.Object3D) => {
      const json = gltf?.parser?.json;
      const materialDefs = json?.materials ?? [];
      const textureDefs = json?.textures ?? [];
      const imageDefs = json?.images ?? [];
      const parser = gltf?.parser;
      const associations = parser?.associations;

      rootModel.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial & {
          userData?: { gltfExtensions?: Record<string, unknown> };
        };
        if (!material) return;

        const association = associations?.get(material as unknown as object);
        const materialIndex =
          typeof association?.materials === "number"
            ? association.materials
            : materialDefs.findIndex((entry: any) => entry?.name === material.name);
        const materialDef = materialIndex >= 0 ? materialDefs[materialIndex] : null;
        const ext =
          (material.userData?.gltfExtensions as any)?.KHR_materials_pbrSpecularGlossiness ??
          materialDef?.extensions?.KHR_materials_pbrSpecularGlossiness;

        if (!ext) return;

        const diffuseFactor = ext.diffuseFactor ?? [1, 1, 1, 1];
        const diffuseTextureIndex = ext.diffuseTexture?.index;
        const normalTextureIndex = materialDef?.normalTexture?.index;
        const aoTextureIndex = materialDef?.occlusionTexture?.index;

        const getTextureUriByIndex = (textureIndex: number | undefined) => {
          if (textureIndex === undefined || textureIndex === null) return null;
          const textureDef = textureDefs[textureIndex];
          if (!textureDef) return null;
          const imageDef = imageDefs[textureDef.source];
          return imageDef?.uri ?? null;
        };

        const diffuseMap =
          loadCachedTexture(getTextureUriByIndex(diffuseTextureIndex)) ?? material.map ?? null;
        const normalMap =
          loadCachedTexture(getTextureUriByIndex(normalTextureIndex)) ?? material.normalMap ?? null;
        const aoMap = loadCachedTexture(getTextureUriByIndex(aoTextureIndex)) ?? material.aoMap ?? null;

        if (diffuseMap) {
          diffuseMap.colorSpace = THREE.SRGBColorSpace;
        }

        const converted = new THREE.MeshStandardMaterial({
          color: new THREE.Color(diffuseFactor[0], diffuseFactor[1], diffuseFactor[2]),
          opacity: diffuseFactor[3] ?? 1,
          transparent: (diffuseFactor[3] ?? 1) < 1,
          map: diffuseMap,
          normalMap,
          aoMap,
          roughness: 0.7,
          metalness: 0.05,
          side: material.side,
        });

        if ((mesh.geometry as THREE.BufferGeometry).attributes.uv && !(mesh.geometry as THREE.BufferGeometry).attributes.uv2) {
          (mesh.geometry as THREE.BufferGeometry).setAttribute(
            "uv2",
            (mesh.geometry as THREE.BufferGeometry).attributes.uv
          );
        }

        mesh.material = converted;

        const applyParserTexture = (textureIndex: number | undefined, apply: (tex: THREE.Texture) => void) => {
          if (textureIndex === undefined || textureIndex === null || !parser?.getDependency) return;

          parser
            .getDependency("texture", textureIndex)
            .then((texture: THREE.Texture | null) => {
              if (!texture) return;
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.flipY = false;
              texture.needsUpdate = true;
              apply(texture);
              converted.needsUpdate = true;
            })
            .catch(() => {
              // Ignore texture dependency failures and keep current material maps.
            });
        };

        if (!converted.map) {
          applyParserTexture(diffuseTextureIndex, (texture) => {
            converted.map = texture;
          });
        }

        if (!converted.normalMap) {
          applyParserTexture(normalTextureIndex, (texture) => {
            converted.normalMap = texture;
          });
        }

        if (!converted.aoMap) {
          applyParserTexture(aoTextureIndex, (texture) => {
            converted.aoMap = texture;
          });
        }
      });
    };

    const updateDragonWrapBounds = () => {
      if (!dragon.loaded) return;

      dragonGroup.updateMatrixWorld(true);
      dragonBox.setFromObject(dragonGroup, true);
      if (dragonBox.isEmpty()) return;

      const { min, max } = dragonBox;
      const corners = [
        [min.x, min.y, min.z],
        [min.x, min.y, max.z],
        [min.x, max.y, min.z],
        [min.x, max.y, max.z],
        [max.x, min.y, min.z],
        [max.x, min.y, max.z],
        [max.x, max.y, min.z],
        [max.x, max.y, max.z],
      ];

      let minScreenX = Number.POSITIVE_INFINITY;
      let maxScreenX = Number.NEGATIVE_INFINITY;
      let minScreenY = Number.POSITIVE_INFINITY;
      let maxScreenY = Number.NEGATIVE_INFINITY;

      const rect = root.getBoundingClientRect();

      for (const corner of corners) {
        projectionVector.set(corner[0], corner[1], corner[2]).project(camera);
        const screenX = (projectionVector.x * 0.5 + 0.5) * rect.width;
        const screenY = (-projectionVector.y * 0.5 + 0.5) * rect.height;

        if (screenX < minScreenX) minScreenX = screenX;
        if (screenX > maxScreenX) maxScreenX = screenX;
        if (screenY < minScreenY) minScreenY = screenY;
        if (screenY > maxScreenY) maxScreenY = screenY;
      }

      dragonWrapBounds.centerX = (minScreenX + maxScreenX) / 2;
      dragonWrapBounds.centerY = (minScreenY + maxScreenY) / 2;
      dragonWrapBounds.halfWidth = Math.max(1, (maxScreenX - minScreenX) / 2);
      dragonWrapBounds.halfHeight = Math.max(1, (maxScreenY - minScreenY) / 2);
    };

    const drawPretext = () => {
      const textContext = textCanvas.getContext("2d");
      if (!textContext) return;

      const container = targetRef?.current;
      if (!container) {
        textContext.setTransform(1, 0, 0, 1, 0, 0);
        textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio, 2);
      const canvasRect = root.getBoundingClientRect();
      const cssHeight = Math.max(textCanvas.height / dpr, canvasRect.height);
      const sectionBlocks = Array.from(container.querySelectorAll<HTMLElement>(".section-block"));
      const wrapPadding = 30;
      const silhouettePower = 2.05;

      textContext.setTransform(1, 0, 0, 1, 0, 0);
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
      textContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      textContext.font = textFont;
      textContext.fillStyle = "rgba(226,244,255,0.82)";
      textContext.textBaseline = "top";

      for (const sectionBlock of sectionBlocks) {
        const paragraph = sectionBlock.querySelector<HTMLParagraphElement>("p");
        if (!paragraph) continue;

        const sectionRect = sectionBlock.getBoundingClientRect();
        const paragraphRect = paragraph.getBoundingClientRect();

        const sectionBottom = sectionRect.bottom - canvasRect.top;
        const paragraphTop = paragraphRect.top - canvasRect.top;
        const paragraphBottom = paragraphRect.bottom - canvasRect.top;
        const paragraphLeft = paragraphRect.left - canvasRect.left;
        const paragraphRight = paragraphRect.right - canvasRect.left;

        const paragraphText = paragraph.textContent?.trim() ?? "";
        if (!paragraphText) continue;

        let preparedText = preparedTextCache.get(paragraphText);
        if (!preparedText) {
          preparedText = prepareWithSegments(paragraphText, textFont);
          preparedTextCache.set(paragraphText, preparedText);
        }

        let cursor = { segmentIndex: 0, graphemeIndex: 0 };
        for (let row = 0; ; row += 1) {
          const lineTop = paragraphTop + row * lineHeight;
          if (lineTop > cssHeight - lineHeight) break;
          if (lineTop > sectionBottom || lineTop > paragraphBottom) break;

          let lineLeft = paragraphLeft;
          let lineRight = paragraphRight;

          if (dragon.loaded && activeModel?.visible) {
            const lineMid = lineTop + lineHeight * 0.5;
            const modelTop = dragonWrapBounds.centerY - dragonWrapBounds.halfHeight - wrapPadding;
            const modelBottom = dragonWrapBounds.centerY + dragonWrapBounds.halfHeight + wrapPadding;
            const overlapsModel = lineMid > modelTop && lineMid < modelBottom;

            if (overlapsModel) {
              const radiusY = dragonWrapBounds.halfHeight + wrapPadding;
              const radiusX = dragonWrapBounds.halfWidth + wrapPadding;
              const normalizedY = (lineMid - dragonWrapBounds.centerY) / Math.max(1, radiusY);

              if (Math.abs(normalizedY) < 1) {
                const yPow = Math.pow(Math.abs(normalizedY), silhouettePower);
                const halfWidthAtY = radiusX * Math.pow(Math.max(0, 1 - yPow), 1 / silhouettePower);
                const modelLeft = dragonWrapBounds.centerX - halfWidthAtY;
                const modelRight = dragonWrapBounds.centerX + halfWidthAtY;

                const leftSpanRight = Math.min(modelLeft, paragraphRight);
                const rightSpanLeft = Math.max(modelRight, paragraphLeft);
                const leftSpanWidth = Math.max(0, leftSpanRight - paragraphLeft);
                const rightSpanWidth = Math.max(0, paragraphRight - rightSpanLeft);

                if (leftSpanWidth >= rightSpanWidth && leftSpanWidth >= 120) {
                  lineLeft = paragraphLeft;
                  lineRight = leftSpanRight;
                } else if (rightSpanWidth >= 120) {
                  lineLeft = rightSpanLeft;
                  lineRight = paragraphRight;
                }
              }
            }
          }

          const lineWidth = Math.max(140, lineRight - lineLeft - 8);
          const line = layoutNextLine(preparedText, cursor, lineWidth);
          if (line === null) break;

          textContext.fillText(line.text, lineLeft, lineTop);
          cursor = line.end;

          if (cursor.segmentIndex >= preparedText.segments.length) break;
        }
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      const dpr = Math.min(window.devicePixelRatio, 2);

      renderer.setSize(width, height, true);
      camera.left = -width * 0.5;
      camera.right = width * 0.5;
      camera.top = height * 0.5;
      camera.bottom = -height * 0.5;
      camera.updateProjectionMatrix();

      textCanvas.width = Math.floor(width * dpr);
      textCanvas.height = Math.floor(height * dpr);
      textCanvas.style.width = `${width}px`;
      textCanvas.style.height = `${height}px`;

      dragon.baseX = Math.min(180, width * 0.26);
      dragon.baseY = Math.min(170, height * 0.24);
      dragon.x = dragon.baseX;
      dragon.y = dragon.baseY;

      if (activeModel) {
        const targetSize = Math.min(width, height) * 0.46;
        const fit = targetSize / Math.max(1, dragon.width, dragon.height);
        activeModel.scale.setScalar(dragonBaseScale * fit);
      }
    };

    resize();

    loader.load(
      "/Dragon.glb",
      (gltf) => {
        const loadedModel = (gltf as any).scene as THREE.Object3D;
        const clips = ((gltf as any).animations ?? []) as THREE.AnimationClip[];

        convertSpecGlossToStandardMaterial(gltf, loadedModel);
        activeModel = loadedModel;

        const initialBox = new THREE.Box3().setFromObject(activeModel, true);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        initialBox.getSize(size);
        initialBox.getCenter(center);

        dragon.width = Math.max(1, size.x);
        dragon.height = Math.max(1, size.y);

        const largestAxis = Math.max(size.x, size.y, size.z, 1);
        dragonBaseScale = 1 / largestAxis;
        activeModel.position.sub(center);
        activeModel.scale.setScalar(dragonBaseScale * Math.min(root.clientWidth, root.clientHeight) * 0.46);
        activeModel.rotation.set(rotationX, rotationY, rotationZ);

        if (clips.length > 0) {
          mixer = new THREE.AnimationMixer(activeModel);
          const primaryClip = clips[0];
          const action = mixer.clipAction(primaryClip);
          action.reset();
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.clampWhenFinished = false;
          action.play();
        }

        dragon.loaded = true;
        dragonGroup.add(activeModel);
      },
      undefined,
      () => {
        activeModel = null;
        dragon.loaded = false;
      }
    );

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const shouldAnimatePath = animateOnViewRef.current;

      const width = root.clientWidth || 1;
      const height = root.clientHeight || 1;

      const rootRect = root.getBoundingClientRect();
      const targetRect = targetRef?.current?.getBoundingClientRect();

      if (!targetRect) {
        renderer.render(scene, camera);
        drawPretext();
        return;
      }

      if (shouldAnimatePath) {
        if (!leadApplied) {
          dragon.time = animationLeadSeconds;
          leadApplied = true;
        }
        dragon.time += delta;
      }

      const t = Math.min(1, dragon.time / dragon.pathDuration);

      // One-way dive: top-left -> bottom-center
      const boxLeft = targetRect.left - rootRect.left;
      const boxRight = targetRect.right - rootRect.left;
      const boxTop = targetRect.top - rootRect.top;
      const boxBottom = targetRect.bottom - rootRect.top;
      const boxCenterX = (boxLeft + boxRight) / 2;

      const TLx = boxLeft;
      const TLy = boxTop;
      const BCx = boxCenterX;
      const BCy = boxBottom;

      // Strong ease-in-out — slow start, slow end
      const u = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Cubic Bézier: TL -> (TLx, TLy + 75% of drop) -> (midX, BCy) -> BC
      const inv = 1 - u;
      const P1x = TLx;
      const P1y = TLy + (BCy - TLy) * 0.75;
      const P2x = TLx + (BCx - TLx) * 0.5;
      const P2y = BCy;

      dragon.x =
        inv * inv * inv * TLx +
        3 * inv * inv * u * P1x +
        3 * inv * u * u * P2x +
        u * u * u * BCx;
      dragon.y =
        inv * inv * inv * TLy +
        3 * inv * inv * u * P1y +
        3 * inv * u * u * P2y +
        u * u * u * BCy;

      if (mixer) mixer.update(delta);

      if (activeModel) {
        dragonGroup.rotation.set(0, 0, 0);
        activeModel.rotation.set(rotationX, rotationY, rotationZ);

        const worldX = dragon.x - width / 2;
        const worldY = height / 2 - dragon.y;
        dragonGroup.position.set(worldX, worldY, 0);

        camera.position.set(0, 0, 1300);
        camera.position.z = 1300;
        camera.lookAt(0, 0, 0);

        if (dragon.y >= boxBottom - 1) {
          activeModel.visible = false;
          if (mixer) {
            mixer.stopAllAction();
          }
        }

        updateDragonWrapBounds();
      }

      renderer.render(scene, camera);
      drawPretext();
    };

    animate();

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(root);

    const container = targetRef?.current;
    const contentResizeObserver = container
      ? new ResizeObserver(() => {
          resize();
          updateDragonWrapBounds();
          drawPretext();
        })
      : null;

    if (container && contentResizeObserver) {
      contentResizeObserver.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      contentResizeObserver?.disconnect();
      renderer.dispose();
      dragonGroup.clear();
      scene.clear();
      root.innerHTML = "";
      textureCache.forEach((texture) => texture.dispose());
      textureCache.clear();
    };
  }, []);

  return (
    <div
      className={cn("pointer-events-none relative h-full w-full", className)}
      aria-hidden="true"
    >
      <canvas ref={textCanvasRef} className="absolute inset-0" />
      <div ref={rootRef} className="absolute inset-0" />
    </div>
  );
}

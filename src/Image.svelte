<svelte:options tag={null} />

<script>
  import { onMount, tick } from 'svelte';

  export let src;
  export let alt;
  let className = '';
  export { className as class };
  export let srcset;
  export let srcsetwebp;
  export let srcsetavif;
  export let placeholder = '';
  export let width;
  export let aspectratio;
  export let immediate = false;
  export let blur = 40;
  export let quality = '';

  const srcLocal = src; // suppress unused-export-let
  const qualityLocal = quality;

  let clientWidth;
  let intersecting = false;
  let native = false;
  let container;
  let imgLoaded = false;
  let hasResizeObserver = true;

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
  $: imageWidth =
    fixedWidth && clientWidth
      ? Math.min(clientWidth, width)
      : fixedWidth
      ? width
      : clientWidth;
  $: imageHeight = imageWidth / aspectratio;
  $: sizes = imageWidth ? `${imageWidth}px` : undefined;
  $: setSrcset =
    (intersecting || native || immediate) && (sizes || !hasResizeObserver);
  $: loaded = imgLoaded || immediate;

  onMount(() => {
    tick().then(() => {
      let ro;
      if (window.ResizeObserver) {
        ro = new ResizeObserver((entries) => {
          clientWidth = entries[0].contentRect.width;
        });

        ro.observe(container);
      } else {
        hasResizeObserver = false;
      }

      native = 'loading' in HTMLImageElement.prototype;
      if (native || immediate) {
        return () => {
          if (ro) {
            ro.unobserve(container);
          }
        };
      }

      const io = new IntersectionObserver(
        (entries) => {
          intersecting = entries[0].isIntersecting;
          if (intersecting) {
            io.unobserve(container);
          }
        },
        {
          rootMargin: `100px`,
        },
      );

      io.observe(container);

      return () => {
        io.unobserve(container);
        if (ro) {
          ro.unobserve(container);
        }
      };
    });
  });
</script>

<div
  bind:this={container}
  style="{fixedWidth ? `max-width:${width}px;` : ''} --svimg-blur:{blur}px"
  class="wrapper {className}"
>
  <picture>
    {#if srcsetavif}
      <source
        type="image/avif"
        srcset={setSrcset ? srcsetavif : undefined}
        {sizes}
      />
    {/if}
    {#if srcsetwebp}
      <source
        type="image/webp"
        srcset={setSrcset ? srcsetwebp : undefined}
        {sizes}
      />
    {/if}
    <img
      srcset={setSrcset ? srcset : undefined}
      {sizes}
      alt={loaded ? alt : undefined}
      width={imageWidth}
      height={imageHeight}
      loading={!immediate ? 'lazy' : undefined}
      class="image {loaded ? 'loaded' : ''}"
      on:load={() => (imgLoaded = true)}
    />
  </picture>
  {#if !immediate}
    <img
      class="placeholder"
      src={placeholder}
      {alt}
      width={imageWidth}
      height={imageHeight}
    />
  {/if}
</div>

<style>
  .wrapper {
    display: grid;
    grid: 1fr / 1fr;
    gap: 0px;
    grid-gap: 0px; /* safari 10/11 doesn't support gap property */
    overflow: hidden;
  }
  .wrapper > * {
    grid-area: 1 / 1 / 2 / 2;
  }
  .wrapper img {
    width: 100%;
    height: auto;
    display: block;
  }
  .image {
    opacity: 0;
    transition: opacity 0.25s ease-in;
  }
  .image.loaded {
    opacity: 1;
  }
  .placeholder {
    z-index: -1;
    filter: blur(var(--svimg-blur));
  }
</style>

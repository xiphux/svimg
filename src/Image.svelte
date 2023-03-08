<svelte:options tag={null} />

<script>
  import { onMount, tick } from 'svelte';

  export let src;
  export let alt;
  let className = '';
  export { className as class };
  export let srcset;
  export let srcsetwebp = '';
  export let srcsetavif = '';
  export let placeholder = '';
  export let placeholdersrc = '';
  export let placeholderwebp = '';
  export let placeholderavif = '';
  export let width = '';
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
  let imgError = false;
  let hasResizeObserver = true;
  let hidePlaceholder = false;
  let supportsCssAspectRatio = true;
  let mounted = false;

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
    (intersecting || native || immediate) &&
    mounted &&
    (sizes || !hasResizeObserver);
  $: useAspectRatioFallback =
    !supportsCssAspectRatio && aspectratio && (fixedWidth || hasResizeObserver);

  function onImgLoad() {
    imgLoaded = true;
    if (!immediate) {
      setTimeout(() => {
        hidePlaceholder = true;
      }, 250); // sync with opacity transition duration
    }
  }

  onMount(() => {
    // src attribute must be set after onload to ensure
    // the onload handler still fires for immediate images
    mounted = true;

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

      supportsCssAspectRatio = CSS.supports(
        'aspect-ratio',
        'var(--svimg-aspect-ratio)',
      );

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
  style="{fixedWidth
    ? `max-width:${width}px;`
    : ''} --svimg-blur:{blur}px; {aspectratio
    ? `--svimg-aspect-ratio:${aspectratio};`
    : ''}"
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
      alt={imgLoaded || imgError ? alt : undefined}
      width={imageWidth}
      height={imageHeight}
      loading={!immediate ? 'lazy' : undefined}
      class="image {imgLoaded || immediate ? 'loaded' : ''}"
      on:load={onImgLoad}
      on:error={() => (imgError = true)}
    />
  </picture>
  {#if !immediate && !hidePlaceholder}
    {#if placeholdersrc}
      <picture>
        {#if placeholderavif}
          <source type="image/avif" srcset={placeholderavif} />
        {/if}
        {#if placeholderwebp}
          <source type="image/webp" srcset={placeholderwebp} />
        {/if}
        <img class="placeholder" srcset={placeholdersrc} {alt} width={imageWidth} height={imageHeight} style={useAspectRatioFallback
          ? `width:${imageWidth}px; height:${imageHeight}px;`
          : ''} />
      </picture>
    {:else}
      <img
        class="placeholder"
        src={placeholder}
        {alt}
        width={imageWidth}
        height={imageHeight}
        style={useAspectRatioFallback
          ? `width:${imageWidth}px; height:${imageHeight}px;`
          : ''}
      />
    {/if}
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
    aspect-ratio: var(--svimg-aspect-ratio);
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

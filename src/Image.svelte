<script>
  import { onMount, tick } from "svelte";

  export let src;
  export let alt;
  let className = "";
  export { className as class };
  export let srcset;
  export let srcsetwebp;
  export let placeholder = "";
  export let width;
  export let aspectratio;
  export let immediate = false;

  const srcLocal = src; // suppress unused-export-let

  let clientWidth;
  let intersecting = false;
  let native = false;
  let container;
  let loaded = false;

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
  $: imageWidth =
    fixedWidth && clientWidth
      ? Math.min(clientWidth, width)
      : fixedWidth
      ? width
      : clientWidth;
  $: imageHeight = imageWidth / aspectratio;
  $: sizes = imageWidth ? `${imageWidth}px` : undefined;

  onMount(() => {
    tick().then(() => {
      let ro;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(entries => {
          const entry = entries[0];
          clientWidth = entry.contentRect.width;
        });

        ro.observe(container);
      }

      native = "loading" in HTMLImageElement.prototype;
      if (native || immediate) {
        return () => {
          if (ro) {
            ro.unobserve(container);
          }
        };
      }

      const io = new IntersectionObserver(
        entries => {
          intersecting = entries[0].isIntersecting;
          if (intersecting) {
            io.unobserve(container);
          }
        },
        {
          rootMargin: `100px`
        }
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

<style>
  .wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    overflow: hidden;
  }
  .wrapper > * {
    grid-area: 1 / 1 / 2 / 2;
  }
  .image {
    width: 100%;
    display: block;
    opacity: 0;
    transition: opacity 0.25s ease-in;
  }
  .image.loaded {
    opacity: 1;
  }
  .placeholder {
    width: 100%;
    display: block;
    z-index: -1;
  }
</style>

<svelte:options tag={null} />

<div
  bind:this={container}
  style={fixedWidth ? `max-width:${width}px` : undefined}
  class="wrapper {className}">
  <picture>
    {#if srcsetwebp}
      <source
        type="image/webp"
        srcset={intersecting || native || immediate ? srcsetwebp : undefined}
        {sizes} />
    {/if}
    <img
      srcset={intersecting || native || immediate ? srcset : undefined}
      {sizes}
      alt={loaded || immediate ? alt : undefined}
      width={imageWidth}
      height={imageHeight}
      loading={!immediate ? 'lazy' : undefined}
      class="image {loaded || immediate ? 'loaded' : ''}"
      on:load={() => (loaded = true)} />
  </picture>
  {#if !immediate}
    <img
      class="placeholder"
      src={placeholder}
      {alt}
      width={imageWidth}
      height={imageHeight} />
  {/if}
</div>

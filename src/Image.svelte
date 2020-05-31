<script>
  import { onMount, tick } from "svelte";

  export let src;
  export let alt;
  let className = "";
  export { className as class };
  export let srcset;
  export let srcsetwebp;
  export let placeholder;
  export let width;

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
  $: sizes = `${imageWidth}px`;

  onMount(() => {
    tick().then(() => {
      const ro = new ResizeObserver(entries => {
        const entry = entries[0];
        clientWidth = entry.contentRect.width;
      });

      ro.observe(container);

      native = "loading" in HTMLImageElement.prototype;
      if (native) {
        return () => {
          ro.unobserve(container);
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
        ro.unobserve(container);
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
    display: block;
  }
  .placeholder {
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
        srcset={intersecting || native ? srcsetwebp : undefined}
        {sizes} />
    {/if}
    <img
      srcset={intersecting || native ? srcset : undefined}
      {sizes}
      alt={loaded ? alt : undefined}
      width={imageWidth}
      loading="lazy"
      class="image"
      on:load={() => (loaded = true)} />
  </picture>
  <img class="placeholder image" src={placeholder} {alt} width={imageWidth} />
</div>

<script>
  import { onMount } from "svelte";

  export let src;
  export let alt;
  let className;
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

  onMount(() => {
    native = "loading" in HTMLImageElement.prototype;
    if (native) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        intersecting = entries[0].isIntersecting;
        if (intersecting) {
          observer.unobserve(container);
        }
      },
      {
        rootMargin: `100px`
      }
    );

    observer.observe(container);

    return () => observer.unobserve(container);
  });

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
  $: imageWidth = fixedWidth ? width : clientWidth;
  $: sizes = `${imageWidth}px`;
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
  picture,
  img {
    grid-area: 1 / 1 / 2 / 2;
  }
  .placeholder {
    z-index: -1;
  }
</style>

<div
  bind:this={container}
  bind:clientWidth
  style={fixedWidth ? `width:${width}px` : undefined}
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
      {width}
      loading="lazy"
      on:load={() => (loaded = true)} />
  </picture>
  <img class="placeholder" src={placeholder} {alt} {width} />
</div>

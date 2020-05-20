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

  let clientWidth;
  let intersecting = false;
  let native = false;
  let container;
  let loaded = false;

  const expand = 100;

  onMount(() => {
    native = "loading" in HTMLImageElement.prototype;
    if (native) {
      return;
    }

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        entries => {
          intersecting = entries[0].isIntersecting;
          if (intersecting) {
            observer.unobserve(container);
          }
        },
        {
          rootMargin: `${expand}px`
        }
      );

      observer.observe(container);

      return () => observer.unobserve(container);
    }

    function handler() {
      const rect = container.getBoundingClientRect();

      intersecting =
        rect.bottom + expand > 0 &&
        rect.right + expand > 0 &&
        rect.top - expand < window.innerHeight &&
        rect.left - expand < window.innerWidth;

      if (intersecting) {
        window.removeEventListener("scroll", handler);
      }
    }

    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  });

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
  $: imageWidth = fixedWidth ? width : clientWidth;
  $: sizes = `${imageWidth}px`;
  $: showPlaceholder = (native && !loaded) || (!native && !intersecting);
</script>

<style>
  div.wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
  picture,
  img {
    grid-area: 1 / 1 / 2 / 2;
  }
  img.placeholder {
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
      alt={!showPlaceholder ? alt : undefined}
      {width}
      loading={native ? 'lazy' : undefined}
      on:load={() => (loaded = true)} />
  </picture>
  {#if showPlaceholder}
    <img class="placeholder" src={placeholder} {alt} {width} />
  {/if}
</div>

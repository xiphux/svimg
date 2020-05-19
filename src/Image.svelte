<script>
  import { onMount } from "svelte";

  export let src;
  export let alt;
  let className;
  export { className as class };
  export let srcset;
  export let srcsetWebp;
  export let placeholder;
  export let width;

  let clientWidth;
  let intersecting = false;
  let container;

  const expand = 100;

  onMount(() => {
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
</script>

<div
  bind:this={container}
  bind:clientWidth
  style={fixedWidth ? `width:${width}px` : undefined}
  class={className}>
  <picture>
    {#if srcsetWebp}
      <source
        type="image/webp"
        srcset={intersecting ? srcsetWebp : undefined}
        {sizes} />
    {/if}
    <img
      {src}
      srcset={intersecting ? srcset : placeholder}
      {sizes}
      {alt}
      {width} />
  </picture>
</div>

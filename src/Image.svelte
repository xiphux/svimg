<script context="module">
  import "lazysizes";
</script>

<script>
  export let src;
  export let alt;
  let className;
  export { className as class };
  export let srcset;
  export let srcsetWebp;
  export let placeholder;
  export let width;

  let clientWidth;

  $: fixedWidth = !!(width && /^[0-9]+$/.test(width));
  $: imageWidth = fixedWidth ? width : clientWidth;
</script>

<div
  bind:clientWidth
  style={fixedWidth ? `width:${width}px` : undefined}
  class={className}>
  <picture>
    {#if srcsetWebp}
      <source
        type="image/webp"
        data-srcset={srcsetWebp}
        sizes="{imageWidth}px" />
    {/if}
    <img
      {src}
      srcset={placeholder}
      data-srcset={srcset}
      sizes="{imageWidth}px"
      {alt}
      {width}
      class="lazyload" />
  </picture>
</div>

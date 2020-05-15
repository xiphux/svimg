<script>
  export let src;
  export let alt = undefined;
  let className = undefined;
  export { className as class };
  export let srcset;
  export let srcsetWebp;
</script>

<picture>
  {#if srcsetWebp}
    <source type="image/webp" srcset={srcsetWebp} />
  {/if}
  <img {src} {srcset} {alt} class={className} />
</picture>

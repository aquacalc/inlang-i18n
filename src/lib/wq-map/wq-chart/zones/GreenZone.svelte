<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { area } from "d3";
  import { interpolatePath } from "d3-interpolate-path";

  export let gzPoints;
  export let xScale;
  export let yScale;

  $: areaGenerator = area()
    .x((d) => xScale(d.x))
    // .y0((d) => yScale(d.y))
    .y1((d) => yScale(d.y));

  const tGreenZonePath = tweened(null, {
    duration: 800,
    easing: cubicOut,
    interpolate: interpolatePath,
  });

  $: gzPath = areaGenerator(gzPoints);
  $: tGreenZonePath.set(gzPath);

  // $: console.log(gzPath);
</script>

<defs>
  <linearGradient id="MyGradient" gradientTransform="rotate(35)">
    <!-- 127deg,
      rgba(9, 143, 16, 1) 0%,
      rgba(58, 182, 107, 0.8961136685552408) 67%,
      rgba(7, 255, 0, 1) 100% -->
    <!-- (30deg, rgba(130,249,126,1) 0%, rgba(8,89,40,0.3) 50%, rgba(130,249,126,1) 100%) -->
    <!-- see: https://cssgradient.io/ -->
    <!-- <stop offset="100%" stop-color="rgba(47, 79, 47, 0.5)" /> -->
    <!-- <stop offset="100%" stop-color="rgba(10,230,26,0.35)" /> -->

    <!-- <stop offset="0%" stop-color="rgba(240,9,126,0.35)" /> -->
    <!-- <stop offset="50%" stop-color="rgba(230,150,126,0.35)" /> -->
    <!-- <stop offset="60%" stop-color="rgba(58, 182, 107, 0.65)" /> -->
    <!-- <stop offset="60%" stop-color="rgba(58, 182, 107, 0.65)" /> -->
    <!-- <stop offset="78.5%" stop-color="rgba(60, 150, 107, 0.65)" /> -->
    <!-- <stop offset="100%" stop-color="rgba(230,230,116,0.85)" /> -->
  </linearGradient>
</defs>

<path class="green-zone" d={$tGreenZonePath} />
<!-- <path class="green-zone" d={$tGreenZonePath} fill='rgba(47, 79, 47, 0.65)' /> -->
<!-- <path class="green-zone" d={$tGreenZonePath} fill="url(#MyGradient)" /> -->

<style>
  .green-zone {
    /* fill: green; */

    /* fill: linear-gradient(70deg, rgb(247, 166, 166), red); */
    /* opacity: 0.35; */
    /* stroke: red;
    stroke-opacity: 0.35;
    stroke-width: 2; */
    fill: rgba(47, 130, 47, 0.5);
    /* fill: rgba(47, 79, 47, 0.5); */
    /* fill: linear-gradient(
      127deg,
      rgba(9, 143, 16, 1) 0%,
      rgba(58, 182, 107, 0.8961136685552408) 67%,
      rgba(7, 255, 0, 1) 100%
    ); */
  }
</style>

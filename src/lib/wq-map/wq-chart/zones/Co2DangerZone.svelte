<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { area } from "d3";
  import { interpolatePath } from "d3-interpolate-path";

  export let co2Coords;
  export let xScale;
  export let yScale;

  $: areaGenerator = area()
    .x((d) => xScale(d.x))
    .y0((d) => yScale(0)) // Need this for CO2 with area generator (but not polygon?)
    .y1((d) => yScale(d.y));

  const tCo2DangerPath = tweened(null, {
    duration: 800,
    easing: cubicOut,
    interpolate: interpolatePath,
  });

  $: gzPath = areaGenerator(co2Coords);
  $: tCo2DangerPath.set(gzPath);

  // $: console.log(gzPath);
</script>

<defs>
  <linearGradient id="Co2Gradient" gradientTransform="rotate(45)">
    <!-- <stop offset="30%" stop-color="rgb(0, 166, 166)" />
    <stop offset="80%" stop-color="blue" /> -->
    <stop offset="78%"  stop-color="rgba(190, 80, 0, 0.75)"/>
    <stop offset="100%" stop-color="red"/>
  </linearGradient>
</defs>

<path class="co2-danger-zone" d={$tCo2DangerPath} fill={"url(#Co2Gradient)"} />

<style>
  .co2-danger-zone {
    /* fill: green; */

    /* fill: linear-gradient(70deg, rgb(247, 166, 166), red); */
    opacity: 0.35;
    stroke: rgb(30, 0, 255);
    stroke-opacity: 0.8;
    stroke-width: 1;
  }
</style>

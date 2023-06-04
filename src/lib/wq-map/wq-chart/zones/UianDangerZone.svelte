<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { area } from "d3";
  import { interpolatePath } from "d3-interpolate-path";

  export let uianCoords;
  export let xScale;
  export let yScale;

  $: areaGenerator = area()
    .x((d) => xScale(d.x))
    // .y0((d) => yScale(d.low))
    .y1((d) => yScale(d.y));

  const tUianDangerPath = tweened(null, {
    duration: 800,
    easing: cubicOut,
    interpolate: interpolatePath,
  });

  $: gzPath = areaGenerator(uianCoords);
  $: tUianDangerPath.set(gzPath);

  // $: console.log(`UianDanger: `, uianCoords);
</script>

<defs>
  <linearGradient id="UianGradient" gradientTransform="rotate(45)">
    <!-- <stop offset="30%" stop-color="rgb(0, 166, 166)" />
    <stop offset="80%" stop-color="blue" /> -->
    <stop offset="15%" stop-color="red"/>
    <stop offset="100%"  stop-color="rgba(190, 80, 0, 0.75)"/>
  </linearGradient>
</defs>

<path class="uian-danger-zone" d={$tUianDangerPath} fill={"url(#UianGradient)"} />

<style>
  .uian-danger-zone {
    /* fill: green; */

    /* fill: linear-gradient(70deg, rgb(247, 166, 166), red); */
    opacity: 0.35;
    stroke: rgb(30, 0, 255);
    stroke-opacity: 0.8;
    stroke-width: 1;
  }
</style>

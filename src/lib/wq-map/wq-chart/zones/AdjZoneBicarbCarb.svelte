<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { area } from "d3";
  import { interpolatePath } from "d3-interpolate-path";

  export let adjBicarbCarbPoints;
  export let xScale;
  export let yScale;

  // $: console.log(`adjBicarbCarbPoints -> `, adjBicarbCarbPoints)

  $: areaGenerator = area()
    .x((d) => xScale(d.x))
    // .y0((d) => yScale(d.y))
    .y1((d) => yScale(d.y));

  const tBicarbCarbPath = tweened(null, {
    duration: 800,
    easing: cubicOut,
    interpolate: interpolatePath,
  });

  $: bicarbCarbPath = areaGenerator(adjBicarbCarbPoints);
  $: tBicarbCarbPath.set(bicarbCarbPath);

  // $: console.log(bicarbCarbPath);
</script>

<path class="adj-bicarb-carb-zone" d={$tBicarbCarbPath} />

<style>
  .adj-bicarb-carb-zone {
    fill: rgba(254, 254, 193, 0.198);
    /* fill: rgba(239, 203, 255, 0.5); */
  }
</style>

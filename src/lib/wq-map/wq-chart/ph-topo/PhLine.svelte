<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  import { line } from "d3-shape";
  import { interpolatePath } from "d3-interpolate-path";

  export let lineData;
  export let xScale;
  export let yScale;
  // export let dic_max = 8;

  // console.log(lineData);

  // ------ //
  // [NB] Tween pH markers like
  // Stahl tweening Datapoint?
  const tX = tweened(null, {
    duration: 800,
    easing: cubicOut,
    // interpolate: interpolatePath,
  });
  const tY = tweened(null, {
    duration: 800,
    easing: cubicOut,
    // interpolate: interpolatePath,
  });

  $: tX.set(xScale.domain()[1]);
  $: tY.set(yScale.domain()[1]);
  // $: tX.set(lineData.data[1].x);
  // $: tY.set(lineData.data[1].y);

  //  see: https://www.d3indepth.com/shapes/
  // d3.line() returns a lineGenerator function...
  $: lineGenerator = line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  const tLinePath = tweened(null, {
    duration: 800,
    easing: cubicOut,
    interpolate: interpolatePath,
  });

  $: linePath = lineGenerator(lineData.data);
  $: tLinePath.set(linePath);

  // $: console.log(`Xr: `, xScale.range()[1])
  // $: console.log(`Xd: `, xScale.domain()[1])
  // $: console.log(`xScale($tX): `, xScale($tX))

  // $: console.log(`${lineData.ph_nbs}: ${lineData.data[1].x} ${$tX}`);

  // $: console.log(`Y: `, yScale.domain())
</script>

<!-- Why the following? see note for <text> below -->
<!-- xScale($tX) > 0 ? (lineData.ph_nbs % 1 === 0 ? "gray" : "lightgray") : 'white'} -->
<path
  class="line"
  d={$tLinePath}
  stroke={xScale($tX) > 0
    ? lineData.ph_nbs % 1 === 0
      ? "gray"
      : "lightgray"
    : "white"}
  strokeWidth={lineData.ph_nbs % 1 === 0 ? "0.5" : "0.15"}
/>

<!-- Why the following? -->
<!-- Until correctly set chart area/axes, -->
<!-- pH lines interfere with top of y-axis -->
<!-- x = {xScale($tX) > 0 ? xScale($tX) : -100} -->
<!--  -->
<!-- [NB]   dy={xScale($tX) < xScale(dic_max) ? TOP margin : RT Margin} -->
<g transform={`translate(${0}, ${0})`}>
  <!-- <g transform= {`translate(${width + margin.left}, ${margin.top})`}> -->

  <!-- <text
    class="ph-text"
    x={xScale($tX) > 0 ? xScale($tX) : -100}
    y={yScale($tY)}
    dy={xScale($tX) < xScale(dic_max) ? "-0.25em" : "0.15em"}
    dx={xScale($tX) < xScale(dic_max) ? "-0.25em" : "1.5em"}

    {lineData.ph_nbs % 1 === 0 && lineData.ph_nbs < 13
      ? `pH ${lineData.ph_nbs}`
      : ""}
  > -->

  <!-- IF...the intersection with the right y-axis...                             -->
  <!--   ...is less than the MAX Y (accounting for any zoom & pan)...             -->
  <!--   ...then compare with the line's y-value at MAX X w/in the clip-path...   -->
  <!-- [NB] MUST BE "yScale.range()[0]" because y-scale inverted, top-bottom, eh? -->

  <!-- [NB] ∆'d const from " - 6 " to " - 16 " in "x" of {:else} -->
  <!-- [NB] 'pH 8' scrunched in upper-right corner when sal < 2.5 ppt -->
  {#if lineData.ph_nbs % 1 === 0 && lineData.ph_nbs < 13}
    {#if lineData.slope * $tX + lineData.intercept < yScale.domain()[1]}
      <text
        class="ph-text"
        x={xScale.range()[1] - 17}
        y={yScale(lineData.slope * $tX + lineData.intercept) - (
          yScale(lineData.slope * $tX + lineData.intercept) < 20 ? -15 : 0
        )}
      >
        {`pH ${lineData.ph_nbs}`}
      </text>
    {:else}
      <text
        class="ph-text"
        x={xScale(($tY - lineData.intercept) / lineData.slope) - 16}
        y={13}
      >
        {`pH ${lineData.ph_nbs}`}
      </text>
    {/if}
  {/if}
</g>

<!-- {#if lineData.ph_nbs === 8}
      <text x="200" y="60">
        {lineData.slope * $tX + lineData.intercept <= yScale.domain()[1]}
      </text>
      <text x="200" y="80">
        {lineData.slope * $tX + lineData.intercept}
      </text>
      <text x="200" y="100">
        {yScale.domain()[1]}
      </text>
    {/if} -->
<style>
  .line {
    fill: none;
  }
  .ph-text {
    fill: rebeccapurple;
    /* fill: #3f51b5; */
    /* color: #635f5d; */
    opacity: 0.85;
    font-size: 0.75rem;
    text-anchor: middle;
  }
</style>

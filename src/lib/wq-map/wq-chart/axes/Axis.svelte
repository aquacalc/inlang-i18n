<script>
  // see: Tom Février's https://github.com/TomFevrier/svelte-d3-demo/blob/master/src/ScatterPlot.svelte

  import { select, selectAll } from "d3-selection";
  import { axisBottom, axisLeft, axisRight, axisTop } from "d3-axis";

  export let width;
  export let height;
  export let margin;
  export let position;
  export let scale;

  let transform;
  let g;

  let title = {
    text: "",
    x: 0,
    y: 0,
    rotate: 0,
    anchor: null,
  };

  let { text, x, y, rotate, anchor } = title;

  $: {
    select(g).selectAll("*").remove();

    let axis;

    switch (position) {
      case "bottom":
        axis = axisBottom(scale).tickSizeOuter(0).ticks(7);
        transform = `translate(${margin.left}, ${height + margin.top})`;
        text = "Dissolved Inorganic Carbon [mmol/kg]";
        x = width / 2;
        y = 33;
        // x = width / 3.5;
        // y = height + margin.top;
        rotate = 0;
        anchor = "center";
        break;

      case "left":
        axis = axisLeft(scale).tickSizeOuter(0).ticks(7);
        transform = `translate(${margin.left}, ${margin.top})`;
        text = "Alkalinity [meq/kg]";
        x = -140;
        y = height / 20 - 50;
        rotate = "-90";
        anchor = "middle";
        break;

      case "right":
        axis = axisRight(scale).tickSizeOuter(0).ticks(12);
        transform = `translate(${width + margin.left}, ${margin.top})`;
        text = "Alkalinity [ppm]";
        x = -140;
        y = 45;
        // y = height + 240;
        rotate = -90;
        anchor = "middle";
        break;

      // [NB] Firefox won't display outline/border of 'invisible' <rect>,
      //      so the WQ Map's top border is missing
      // see: https://stackoverflow.com/questions/17271325/firefox-applying-border-outline-css-properties-to-svg-elements
      // Add 'blank' top axis as a substitute, eh?
      case "top":
        axis = axisTop(scale).tickSizeOuter(0).ticks(0);
        transform = `translate(${margin.left}, ${margin.top})`;
        text = "";
        x = 0;
        y = 0;
        rotate = 0;
        anchor = "middle";
        break;
    }

    let myAxis = select(g).call(axis);

    // let label = select(g)
    myAxis
      .append("text")
      // .attr("class", "axis-test-text")
      .style("transform", `rotate(${rotate}deg)`)
      .style("text-anchor", anchor)
      .attr("x", x)
      .attr("y", y)
      .style("font-size", "0.85rem")
      .style("fill", "#414141")
      .text(text);
  }
</script>

<g class="axis" bind:this={g} {transform} />

<!-- <g class="axis" bind:this={g} {transform} /> -->
<style>
  .axis {
    color: var(--axis-color);
    opacity: 0.85;
    /* font-size: 5rem; */
  }
</style>

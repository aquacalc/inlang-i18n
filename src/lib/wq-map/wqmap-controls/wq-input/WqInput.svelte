<script>
  // export let type = 'text'
  export let name;
  export let id;
  export let title;
  export let inputData;

  // <!-- To pass input data from child to parent component... -->
  // <!-- ...see: https://linguinecode.com/post/pass-input-value-from-child-component-to-parent-component -->
  export let WqInputData;
  export let onChange;

  // ADD this prop for local storage??
  export let value;
  export let units;

  const { init, unitsLong, unitsShort, min, max } = inputData;

  // To pass 'up' to parent component...
  // ...see: https://linguinecode.com/post/pass-input-value-from-child-component-to-parent-component
  let input = init.value;
  let selected = init.units;
  let selectedShort = null;
  let isValid;

  $: WqInputData = {
    name,
    input: value,
    selected: units,
    selectedShort,
    isValid: true,
  };

  $: idx = unitsLong.indexOf(WqInputData.selected);

  // Validation helpers
  // [HACK] Don't know why needed " && WqInputData.input !== '' " for Sal input when input empty...?
  $: isValidInput =
    WqInputData.input >= min[idx] &&
    WqInputData.input <= max[idx] &&
    WqInputData.input !== "";
  $: isValidTextColor = `${isValidInput ? `valid` : `invalid`}`;
  $: isValidBkgColor = `${isValidInput ? null : `invalid-bkg`}`;

  const handleInputChange = (e) => {
    // console.log(`** ${e.target.value} vs. ${WqInputData.input}`)
    // console.log(`${WqInputData.input} >= ${min[idx]}? ${WqInputData.input >= min[idx]}`)
    // console.log(`${WqInputData.input} <= ${max[idx]}? ${WqInputData.input <= max[idx]}`)

    isValid = WqInputData.input >= min[idx] && WqInputData.input <= max[idx];
    // console.log(`isValid is ${isValid}`)

    if ("function" === typeof onChange) {
      // console.log(`onChange IS a function...`)
      // Check if input value is valid, then pass to the parent component
      // onChange(e.target.value >= min[idx] && e.target.value <= max[idx]);
      WqInputData.isValid = isValid;
      // console.log(`WqInputData.isValid = ${WqInputData.isValid}`)
      // console.log(`WqInputData: `, WqInputData)
      // console.log(`***********************`)

      if (isValid) {
        // console.log(`0. ${WqInputData.selectedShort}`);
        WqInputData.selectedShort =
          unitsShort[unitsLong.indexOf(WqInputData.selected)];
        // console.log(`1. ${WqInputData.selectedShort}`);

        onChange(WqInputData);
      } else {
        onChange({
          ...WqInputData,
          isValid: false,
        });
      }
    }

    // console.log(`isValid = ${isValid}`)
    // isValid = WqInputData.input >= min[idx] && WqInputData.input <= max[idx]
    // console.log(`isValid = ${isValid} (${isValidInput})`)
  };

  // [Super-HACK0y] Can't use @html in title attribute of WqInput component,
  //        so try it here to italicize & color (red) 'crit' in some titles
  let myTitle = title;

  if('crit UIA-N' === title){
   myTitle = `<span><em style="color: red">crit</em> UIA-N</span>`;
   } else if('crit CO₂' === title) {
   myTitle = `<span><em style="color: red">crit</em> CO₂</span>`;
   } else {
    myTitle = title;
   }
</script>

<div class="wq-input-group">
  <label for={id} class="wq-form-label" class:invalid={!isValidInput}>
    {@html myTitle}{" "}
    <!-- {title}{" "} -->
    <span class={isValidTextColor}
      >{`(${min[idx]} - ${max[idx]}${unitsShort[idx]})`}</span
    >
  </label>

  <div class="wq-input-group-input-select">
    <input
      {name}
      {id}
      class={isValidBkgColor}
      bind:value={WqInputData.input}
      placeholder={`Enter valid ${title}`}
      on:input={handleInputChange}
    />

    <select
      id={id + "Units"}
      name={name + "Units"}
      bind:value={WqInputData.selected}
      class={isValidBkgColor}
      style="background-color: rgb(195, 195, 195); color: black; 
							appearance: {unitsLong.length === 1 ? 'none' : null};
							cursor: {unitsLong.length === 1 ? 'default' : 'pointer'}"
      disabled={unitsLong.length === 1}
      on:change={handleInputChange}
    >
      {#each unitsLong as option}
        {#if option.includes("-disabled")}
          <option value={option} disabled>
            {option.split("-")[0]}
          </option>
        {:else}
          <option value={option}>
            {option}
          </option>
        {/if}
      {/each}
    </select>
  </div>

  <!-- TEST BINDING -->
  <!-- <h3 class="red-test">
        {#if isValidInput}
          {input}{unitsShort[idx]} ({isValidInput})
        {:else}
          <em>Invalid input...</em>
        {/if}
      </h3> -->
</div>

<style>
  /* .red-test { color: red;} */

  .wq-input-group {
    --invalid-red: #fce2e2;
    /* --invalid-red: #ffd1d1; */

    display: flex;
    flex-direction: column;
    /* justify-content: flex-start; */
  }

  /* Modify appearance of input & select to look like one unit */
  .wq-input-group-input-select {
    width: 85%;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 0;
  }

  /*  */

  input,
  select {
    font-family: inherit;
    font-size: 0.95rem;
    /* font-size: inherit; */
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  /*  */

  input {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    text-align: right;
    outline: none;
    /* tweak width */
    width: 100px;
  }
  input:focus,
  input:active {
    background-color: rgb(214, 229, 249);
  }
  select {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: rgb(195, 195, 195);
    outline: none;
    cursor: pointer;
    /* tweak width */
    width: 150px;
  }
  .wq-form-label {
    font-size: 0.8rem;
    font-weight: 400;
    margin-bottom: 0rem;
    text-align: left;
  }

  /* (IN)VALIDITY STYLES */
  .valid {
    color: green;
  }
  .invalid {
    color: red;
    font-weight: 500;
    /* font-style: oblique; */
  }
  label span.invalid {
    background: var(--invalid-red);
    /* background: #fbebaf; */
    /* see: https://stackoverflow.com/questions/16597304/background-color-for-text-only */
    /* box-shadow: 2px 0 0px 0px #ffd1d1, -2px 0 0px 0px #ffd1d1; */
    border: 1px solid red;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    padding: 0 0.15rem;

    /* Avoid 'double border' on bottom when invalid */
    border-bottom: 0;
  }
  .invalid-bkg {
    color: red;
    border-color: red;
    background: var(--invalid-red);

    /* When NO label title && invalid, adjust top-left */
    /* border-top-left-radius: 0; */
  }
  .invalid-bkg:focus {
    border-color: red;
    background: var(--invalid-red);
  }

  /* -------------------------- */
  /* .my-class-name-addon {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 720px) {
    .my-class-name-addon {
      width: 85%;
    }
  }

  @media (max-width: 400px) {
    .my-class-name-addon {
      width: 100%;
    }
  } */
</style>

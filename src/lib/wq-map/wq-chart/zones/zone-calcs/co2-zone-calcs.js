export const uianZoneCoords = (
  icTemp,
  icSal,
  phFree,
  tanVal,
  tanUnits,
  uianCritVal,
  uianCritUnits
) => {
  // console.log(`...CHANGE_GREEN_ZONE_INPUT...`);

  const rho = calcRho(icTemp, icSal);
  // console.log(
  //   `calcRho(${icTemp}, ${icSal}) = ${calcRho(icTemp, icSal)} kg/m3`
  // );

  // --------------- TA-N & UIA-N* ----------------
  // [NB] convert TA-N & UIA-N* in compatible units
  const percentUian = percentNh3ForTemp(icTemp, icSal, +phFree_init);

  // **** -- RE-VISIT -- this choice ***
  // [NB] NOT in IC units, mg/kg (ppm), because force MICRO-gram/L
  //      in critPh calculation (below)
  const inputTanInMgPerL = ammoniaToTargetUnits(
    +tan.value,
    tan.units,
    "mg/L",
    rho,
    percentUian
  );

  // ----- Convert [Alk] to meq/kg ------
  const icAlk_low = alkToIcUnits(+alk_low.value, alk_low.units, rho);
  const icAlk_high = alkToIcUnits(+alk_high.value, alk_high.units, rho);

  // Convert input crit UIA-N to insure it's in μg/L
  const critUianInMicrogramsPerLiter = ammoniaToTargetUnits(
    +uian_crit.value,
    uian_crit.units,
    "μg/L",
    rho,
    percentUian
  );

  let critPh = critPhFreeForTanMillero(
    +inputTanInMgPerL * 1000, // [TEST] measured TA-N in μg/L
    +critUianInMicrogramsPerLiter, // [NB] The CRITICAL UIA-N in μg/L
    // +uian_crit.value, // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
    +icTemp,
    +icSal
  );

  // [HACK] Like in UiaContent.js, critPh can NaN or +/-Inf
  //        if TA-N is too low to produce the critical UIA-N
  critPh = isNaN(critPh) ? 12.0 : critPh;
  critPh = critPh === Infinity ? 12.0 : critPh;
  critPh = critPh === -Infinity ? 5.0 : critPh;

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // ---------------------------
  const critCo2_mgL = +co2_crit.value; // [NB] "* (0.001 * rho)" converts to mg/L
  const x = +uian_crit.value; // [NB] The CRITICAL UIA-N in same units as inputTanInTargetUnits
  // console.log(` crit_co2 = ${critCo2_mgL} ${co2_crit.units} (want mg/L)`);
  // console.log(
  //   `crit_uian: ${uian_crit.value} ${uian_crit.units} -> ${critUianInMicrogramsPerLiter} μg/L`
  // );
  // ---------------------------

  // Calculate DIC values for Green Zone's UIA-N* border
  const gz_dic_1 =
    1000 * calcDicOfAlkPh(icAlk_low / 1000, critPh, icTemp, icSal);
  const gz_dic_4 =
    1000 * calcDicOfAlkPh(icAlk_high / 1000, critPh, icTemp, icSal);

  // Calculate DIC values for Green Zone's CO2* border
  const gz_dic_2 = calcDicForAlkCo2(
    icAlk_low / 1000,
    +co2_crit.value / 44009.6,
    icTemp,
    icSal
  );
  const gz_dic_3 = calcDicForAlkCo2(
    icAlk_high / 1000,
    +co2_crit.value / 44009.6,
    icTemp,
    icSal
  );

  // console.log(`rho = ${rho} g/L`);
  // console.log(`rho = ${rho * 0.001} kg/L`);
  // console.log(`1 / rho = ${1.0 / (rho * 0.001)} L/kg`);

  // [NB] CO2* --not-- a straight line, so add points at low Alk for better fit
  const numPts = 5 * Math.abs(+icAlk_high - +icAlk_low) + 5;
  // console.log(`NUM_PTS = ${numPts}`);
  let dangerCo2Line_forGreenZone = Array(numPts <= 2 ? 3 : Math.round(numPts)) // condition guards fractional array lengths
    .fill()
    .map((dic, idx) => {
      const alk = (+icAlk_low + 0.2 * idx) / 1000;
      dic = calcDicForAlkCo2(
        alk,
        +co2_crit.value / (0.001 * rho) / 44009.6, // [NB] "* (0.001 * rho)" converts co2_crit.value in mg/L to mg/kg
        icTemp,
        icSal
      );
      return {
        x: dic,
        y: alk * 1000,
      };
    })
    .filter((data) => data.y <= +icAlk_high);

  // [HACK] If dangerCo2Line_forGreenZone's max Alk < icAlk_high,
  //        must "top it off" or top GZ border will not have the same Alk-value
  const topOffGreenZoneArray = {
    x: calcDicForAlkCo2(
      icAlk_high / 1000,
      +co2_crit.value / 44009.6,
      icTemp,
      icSal
    ),
    y: icAlk_high,
  };
  // console.log(`topOffGreenZoneArray: `, topOffGreenZoneArray);

  // console.log(`${gz_dic_1} -> ${gz_dic_4}`);
  // console.log(`${gz_dic_2} -> ${gz_dic_3}`);
  // console.log(`x: ${gz_dic_4}, y: ${icAlk_high} (${+icAlk_high})`);

  dangerCo2Line_forGreenZone = [
    { x: gz_dic_1, y: icAlk_low },
    ...dangerCo2Line_forGreenZone,
    topOffGreenZoneArray,
    { x: gz_dic_4, y: icAlk_high },
  ];

  // console.log(`dangerCo2Line_forGreenZone: `, dangerCo2Line_forGreenZone);

  // Calculate slope & intercept of CO2* and UIA-N* lines
  // If the slope of the CO2* line > slope of UIA-N* line, find intersection
  // -- UIA-N* border line
  const slope_uian_line = (+icAlk_high - +icAlk_low) / (gz_dic_4 - gz_dic_1);
  const intercept_uian_line = +icAlk_low - slope_uian_line * gz_dic_1;

  // -- CO2* border line
  const slope_co2_line = (+icAlk_high - +icAlk_low) / (gz_dic_3 - gz_dic_2);
  const intercept_co2_line = +icAlk_low - slope_co2_line * gz_dic_2;

  // console.log(
  //   `UIA-N* line: f(dic) = ${slope_uian_line} * DIC + ${intercept_uian_line} (${intercept_uian_line_check})`
  // );
  // console.log(
  //   `CO2* line: f(dic) = ${slope_co2_line} * DIC + ${intercept_co2_line} (${intercept_co2_line_check})`
  // );

  // [Custom Validation] Is alk_low.value > alk_high.value ?
  // [NB] MUST be in same alk units

  let greenZoneCoords = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  // Is slope CO2* > slope UIA-N* ?
  //  -- If so, there is an intersection.
  // If there is an intersection, is it > alk_high?
  //  -- If so, ignore it
  //  -- If not, it < alk_low?
  //
  // console.log(` `);
  // console.log(`  ~~~~  `);

  if (wqMapDecorations && wqMapDecorations.showHideGreenZone) {
    if (+alk_high.value > +alk_low.value) {
      // console.log(
      //   `VALID Alk pair: alk_high ${alk_high.value} > alk_low ${alk_low.value}`
      // );

      if (slope_co2_line > slope_uian_line) {
        // console.log(`${slope_co2_line} > ${slope_uian_line} => INTERSECTION`);

        // Compute intersection
        const dic_star =
          (intercept_uian_line - intercept_co2_line) /
          (slope_co2_line - slope_uian_line);
        const alk_star = slope_co2_line * dic_star + intercept_co2_line;
        const alk_star_check = slope_uian_line * dic_star + intercept_uian_line;

        const phFree_at_intersection = calcPhForAlkDic(
          alk_star / 1000,
          dic_star / 1000,
          icTemp,
          icSal
        );

        const phNbs_at_intersection = phFreeToPhNbs(
          phFree_at_intersection,
          icSal,
          icTemp,
          0
        );
      }
    }
  }

  // ^^^^^^^^^ NITRIFIER ZONE ^^^^^^^^^^

  // ********************** //
  // ***** DANGER CO2 ***** //
  // ********************** //

  let dangerCo2Line = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  if (wqMapDecorations && wqMapDecorations.showHideDangerCo2) {
    // [NB] CO2* --not-- a straight line, so add points at low Alk for better fit
    dangerCo2Line = Array(40)
      .fill()
      .map((dic, idx) => {
        const alk = (0.2 * idx) / 1000;
        dic = calcDicForAlkCo2(alk, +co2_crit.value / 44009.6, +icTemp, +icSal);
        return {
          x: dic,
          y: alk * 1000,
        };
      });

    dangerCo2Line = [
      ...dangerCo2Line,
      { x: 8, y: 8 }, // *
      { x: 8, y: 0 }, // *
    ];
  }

  // WqMapContext -- CO2 DANGER ZONE ACTION --
  // Only fire action when form is valid
  if (formState.isValid) {
    showHideCo2DangerZone(dangerCo2Line);
  }

  // [HACK] Pass inputTanInMgPerL to Context to add to dataState
  //        to be used in Form (or in Context?) to calculate
  //        UIA-N at each WQ Waypoint
  // Only fire action when form is valid
  if (formState.isValid) {
    passCurrentTan(inputTanInMgPerL);
  }

  // Pass crit_uian & crit_co2 to display in tooltip for target wp on WQ Map
  if (formState.isValid) {
    passCritCo2AndUian({
      critUian: critUianInMicrogramsPerLiter,
      critCo2: critCo2_mgL,
    });
  }

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  // *********************** //
  // ***** DANGER UIAN ***** //
  // *********************** //

  let dangerUianLine = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];

  if (wqMapDecorations && wqMapDecorations.showHideDangerUian) {
    const uianDangerLow =
      1000 * calcDicOfAlkPh(0 / 1000, critPh, icTemp, icSal);
    const uianDangerHigh =
      1000 * calcDicOfAlkPh(8 / 1000, critPh, icTemp, icSal);

    dangerUianLine = [
      { x: 0, y: 0 }, // *
      { x: uianDangerLow, y: 0 },
      { x: uianDangerHigh, y: 8 },
      { x: 0, y: 8 }, // *
    ];
  }
};

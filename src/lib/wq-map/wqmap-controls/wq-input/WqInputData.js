// **                                   ** //
// ** Unicode sub- and superscripts ** //
// **                                   ** //
export const waveDash = "\u301C";

export const superPlus = "\u207A";
export const superMinus = "\u207B";
export const superMinusTwo = "\u207C";

export const superTwo = "\u00B2";
export const superThree = "\u00B3";

export const subTwo = "\u2082";
export const subThree = "\u2083";

export const oneSixteenth = "\ua833";

export const questionMarkInCircle = "?\u20DD";

// **                                   ** //
// ** Nitrogen MWs ** //
// **                                   ** //
const NH3 = 17.031; // g NH3/mole
const NH4 = 18.038; // g NH4/mole
const HNO3 = 47.01344; // g HNO3/mole
const NO3 = 62.0049; // g NO3/mole
const HNO2 = 47.01344; // g HNO2/mole
const NO2 = 46.0055; // g NO2/mole
const N = 14.00674; // g N/mole

const H = 1.00794; // g H/mole
const O = 15.9994; // g O/mole

// ** TEMPERATURE **
export const tempData = {
  unitsLong: ["Celsius", "Fahrenheit", "Kelvin"],
  unitsShort: ["° C", "° F", "° K"],
  // unitsShort: ["º C", "º F", "º K"],
  min: [4, 39, 277],
  max: [40, 104, 313],
  init: {
    value: "25",
    units: "Celsius",
    isValid: true,
  },
};

// ** SALINITY **
export const salData = {
  unitsLong: [
    "Salinity-disabled",
    "‰",
    "Conductivity-disabled",
    "μS(μmho)/cm",
    "mS/cm (dS/m)",
    "S/m",
    "S/cm",
  ],
  unitsShort: [
    "Salinity-disabled",
    "‰",
    "Conductivity-disabled",
    " μS/cm",
    " mS/cm",
    " S/m",
    " S/cm",
  ],
  min: [0, 0, 0, 5000, 5.0, 0.5, 0.005],
  max: [0, 40, 0, 66000, 66, 6.6, 0.066],
  init: {
    value: "34.5",
    units: "‰",
    isValid: true,
  },
};

// ** pH **
export const phData = {
  unitsLong: ["NBS Scale"],
  unitsShort: [" NBS"],
  min: [5.0],
  max: [11],
  init: {
    value: "8.1",
    units: "NBS Scale",
    isValid: true,
  },
};

// ** ALKALINITY **
export const alkData = {
  unitsLong: [
    "oceanographic-disabled",
    "meq/kg",
    "meq/L",
    "legacy-disabled",
    "ppm CaCO" + subThree,
    "Karbonathärte-disabled",
    "dKH",
  ],
  unitsShort: [
    "oceanographic-disabled",
    " meq/kg",
    " meq/L",
    "legacy-disabled",
    " ppm",
    "Karbonathärte-disabled",
    " dKH",
  ],
  min: [0, 0.25, 0.25, 0, 10, 0, 0.75],
  max: [0, 10, 10, 0, 500, 0, 30],
  init: {
    value: "2.3",
    units: "meq/kg",
    isValid: true,
  },
};

// ** AMMONIA **
export const ammoniaData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/L",
    "mg/kg (ppm)",
    // "μg/L",
    // "μg/kg (ppb)",
    "by Moles-disabled",
    "mmol/L (mM)",
    "mmol/kg",
    // "μmol/L (μM)",
    // "μmol/kg"
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/L",
    " mg/kg",
    // " μg/L",
    // " μg/kg",
    "by Moles-disabled",
    " mmol/L",
    " mmol/kg",
    // " μmol/L",
    // " μmol/kg"
  ],
  min: [
    0, 0, 0,
    // 0, 0,
    0, 0, 0,
    //  0, 0
  ],
  max: [
    0, 200, 200,
    // 10,
    // 10,
    // "*", "*",
    0, 12, 12,
    // 0.6,
    // 0.6,
    // "*", "*"
  ],
  init: {
    value: "0.15",
    units: "mg/L",
    isValid: true,
  },
};

// ** UIA **
export const uiaData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/L",
    "mg/kg (ppm)",
    "μg/L",
    "μg/kg (ppb)",
    // "by Moles-disabled",
    // "mmol/L (mM)",
    // "mmol/kg",
    // "μmol/L (μM)",
    // "μmol/kg"
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/L",
    " mg/kg",
    " μg/L",
    " μg/kg",
    // "by Moles-disabled",
    // " mmol/L",
    // " mmol/kg",
    // " μmol/L",
    // " μmol/kg"
  ],
  min: [
    0, 0.001, 0.001, 0.5, 0.5,
    // 0, 0, 0, 0, 0
  ],
  max: [
    0, 0.05, 0.05, 50, 50,
    // 0, 0.015, 0.015, 15, 15
  ],
  init: {
    value: "12.5",
    units: "μg/L",
    isValid: true,
  },
};

//  ------------

// export const ammoniaFormsData = [
//   {
//     nameLong: "Total Ammonia Nitrogen (NH₃-N + NH₄⁺-N)",
//     nameShort: "TA-N",
//     index: 0
//   },
//   {
//     nameLong: "Un-ionized Ammonia Nitrogen (NH₃-N)",
//     nameShort: "UIA-N",
//     index: 1
//   },
//   {
//     nameLong: "Total Ammonia (NH₃ + NH₄⁺)",
//     nameShort: "TA",
//     index: 2
//   },
//   {
//     nameLong: "Un-ionized Ammonia (NH₃)",
//     nameShort: "UIA",
//     index: 3
//   }
// ];

// ** OXYGEN **
export const oxygenData = {
  unitsLong: [
    "by Tension-disabled",
    "mm Hg (torr)",
    "atm",
    "mbar",
    "psi",
    "in Hg",
    "in H2O",
    "by Mass-disabled",
    "mg/L",
    "mg/kg (ppm)",
    // "μg/L",
    // "μg/kg (ppb)",
    "by Volume-disabled",
    "mL/L",
    "mL/kg",
    "by Moles-disabled",
    "mmol/L (mM)",
    "mmol/kg",
    "μmol/L (μM)",
    "μmol/kg",
  ],
  unitsShort: [
    "by Tension-disabled",
    " mm Hg",
    " atm",
    " mbar",
    " psi",
    " in Hg",
    " in H2O",
    "by Mass-disabled",
    " mg/L",
    " mg/kg",
    // " μg/L",
    // " μg/kg",
    "by Volume-disabled",
    " mL/L",
    " mL/kg",
    "by Moles-disabled",
    " mmol/L",
    " mmol/kg",
    " μmol/L",
    " μmol/kg",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [
    0, 240, 0.3, 300, 4, 10, 120, 0, 12, 12,
    // "*",
    // "*",
    0, 8, 8, 0, 0.4, 0.4, 360, 360,
  ],
  init: {
    value: "5.5",
    units: "mg/L",
    isValid: true,
  },
};

// ** critical OXYGEN TENSION **
// typical: 70 - 90 mm Hg
export const o2TensionCritData = {
  unitsLong: ["mm Hg"],
  unitsShort: [" mm Hg"],
  min: [70],
  max: [130],
  init: {
    value: "90",
    units: "mm Hg",
    isValid: true,
  },
};

// RATIO: Mg:Ca
// mass  ratio = 3.12
// molar ratio = 5.14
export const Mg_Ca_target = 3.12;

// ** CALCIUM **
// typical SW: 10.3 mmol/kg, 0.412 g/kg
// Ca atomic mass: 40.078 mg/mmol
export const calciumData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/kg (ppm)",
    "mg/L",
    "by Moles-disabled",
    "mmol/kg",
    "mmol/L",
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/kg",
    " mg/L",
    "by Moles-disabled",
    " mmol/kg",
    " mmol/L",
  ],
  min: [0, 0.5, 0.5, 0, 0.1, 0.1],
  max: [0, 600, 600, 0, 15, 15],
  init: {
    value: "406",
    units: "mg/kg (ppm)",
    isValid: true,
  },
};

// ** MAGNESIuM **
// typical SW: 53.27 mmol/kg, 1.250 g/kg (1292 ppm)
// Mg atomic mass: 24.305 mg/mmol
// http://www.soest.hawaii.edu/oceanography/courses/OCN623/Spring2012/Salinity2012web.pdf
export const magnesiumData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/kg (ppm)",
    "mg/L",
    "by Moles-disabled",
    "mmol/kg",
    "mmol/L",
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/kg",
    " mg/L",
    "by Moles-disabled",
    " mmol/kg",
    " mmol/L",
  ],
  min: [0, 0.5, 0.5, 0, 0.1, 0.1],
  max: [0, 1600, 1600, 0, 65, 65],
  init: {
    value: "1265",
    units: "mg/kg (ppm)",
    isValid: true,
  },
};

// RATIO: Na:K
// mass  ratio = 28.2
// molar ratio = 45.95
export const Na_K_target = 28.2;

// ** SODIuM **
// typical SW: 456.7 mmol/kg, 10.5 g/kg
// Na atomic mass: 22.9897 mg/mmol
export const sodiumData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/kg (ppm)",
    "mg/L",
    "by Moles-disabled",
    "mmol/kg",
    "mmol/L",
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/kg",
    " mg/L",
    "by Moles-disabled",
    " mmol/kg",
    " mmol/L",
  ],
  min: [0, 0.1, 0.1, 0, 0.5, 0.5],
  max: [0, 17000, 17000, 0, 740, 740],
  init: {
    value: "11092",
    units: "mg/kg (ppm)",
    isValid: true,
  },
};

// ** POTASSIUM **
// typical SW: 9.7 mmol/kg, 0.380 g/kg
// K atomic mass: 39.0983 mg/mmol
export const potassiumData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/kg (ppm)",
    "mg/L",
    "by Moles-disabled",
    "mmol/kg",
    "mmol/L",
  ],
  unitsShort: [
    "by Mass-disabled",
    " mg/kg",
    " mg/L",
    "by Moles-disabled",
    " mmol/kg",
    " mmol/L",
  ],
  min: [0, 0.5, 0.5, 0, 0.1, 0.1],
  max: [0, 500, 500, 0, 12, 12],
  init: {
    value: "393",
    units: "mg/kg (ppm)",
    isValid: true,
  },
};

// ** critical OMEGA-calcite **
// typical SW: ~3
export const omegaCaData = {
  unitsLong: ["pure number"],
  unitsShort: [""],
  min: [0],
  max: [8],
  init: {
    value: "1.0",
    // value: "4.5",
    units: "pure number",
    isValid: true,
  },
};

// ** critical OMEGA-aragonite **
// typical SW: ~3
export const omegaArData = {
  unitsLong: ["pure number"],
  unitsShort: [""],
  min: [0],
  max: [5],
  init: {
    value: "1.0",
    // value: "3.0",
    units: "pure number",
    isValid: true,
  },
};

// ** LENGTH **
export const lengthData = {
  unitsLong: [
    "Metric-disabled",
    "meters (m)",
    "centimeters (cm)",
    "millimeters (mm)",
    // "English-disabled",
    // "yards (yd)",
    // "feet (ft)",
    // "inches (in)"
  ],
  unitsShort: [
    "by Metric-disabled",
    " m",
    " cm",
    " mm",
    // "by English-disabled",
    // " yd",
    // " ft",
    // " in"
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, 500, 1000, 10000, 0, 20, 60, 2500],
  init: {
    value: "2",
    units: "meters (m)",
    isValid: true,
  },

  fractionalInches: [
    "", // [NB] changed from '0' to '' for use in WqInput_radio.js's English units selection input
    "1/16",
    "1/8",
    "3/16",
    "1/4",
    "5/16",
    "3/8",
    "7/16",
    "1/2",
    "9/16",
    "5/8",
    "11/16",
    "3/4",
    "13/16",
    "7/8",
    "15/16",
  ],
};

// LengthType based on R code, see global.R
// 4th @param of convert(), type, re-cast to an object with .units, .factors, & .icUnits
// e.g.: length.data = list(units = lengthUnits, factors = lengthFactors, icUnits = 'm')
export const lengthType = {
  units: [
    "",
    "m",
    "cm",
    "mm",
    "",
    "yd, ft, & in",
    "ft & in",
    "in",
    "yd (decimal)",
    "ft (decimal)",
    "in (decimal)",
  ],
  factors: [
    0,
    1.0,
    100.0,
    1000.0,
    0,
    888.888, // [KLUDGE] to tag 'yd, ft, in' units
    777.777, // [KLUDGE] to tag 'ft, in' units
    787.878, // [KLUDGE] to tag 'in' units
    1.0936133,
    3.280839895,
    39.37007874,
  ],
  icUnits: "m",
};

// ** YARDS DATA **
export const yardsData = {
  unitsLong: ["yd"],
  // unitsLong: ["yards"],
  unitsShort: ["yd"],
  min: [0],
  max: [100],
  init: {
    value: "0",
    units: "yd",
    isValid: true,
  },
};
// ** FEET DATA **
export const feetData = {
  unitsLong: ["ft"], // [NB] unitsLong are validated in WqInput_radio and wq-form-hook-rado
  // unitsLong: ["feet"],
  unitsShort: ["ft"],
  min: [0],
  max: [100],
  init: {
    value: "0",
    units: "ft",
    isValid: true,
  },
};
// ** >WHOLE< INCHES DATA **
export const wholeInchData = {
  unitsLong: ["in"],
  unitsShort: ["in"],
  min: [0],
  max: [100],
  init: {
    value: "0",
    units: "in",
    isValid: true,
  },
};

// ** >FRACTIONAL< INCHES DATA **
// export const fractionalInchData = {
//   unitsLong: [
//     "", // [NB] changed from '0' to '' for use in WqInput_radio.js's English units selection input
//     "1/16",
//     "1/8",
//     "3/16",
//     "1/4",
//     "5/16",
//     "3/8",
//     "7/16",
//     "1/2",
//     "9/16",
//     "5/8",
//     "11/16",
//     "3/4",
//     "13/16",
//     "7/8",
//     "15/16"
//   ],
//   unitsShort: [
//     "", // [NB] changed from '0' to '' for use in WqInput_radio.js's English units selection input
//     "1/16",
//     "1/8",
//     "3/16",
//     "1/4",
//     "5/16",
//     "3/8",
//     "7/16",
//     "1/2",
//     "9/16",
//     "5/8",
//     "11/16",
//     "3/4",
//     "13/16",
//     "7/8",
//     "15/16"
//   ],
//   min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   max: [
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100,
//     100
//   ],
//   init: {
//     value: "0",
//     units: "in",
//     isValid: true
//   }
// };

// ** VOLUME **
export const volumeData = {
  unitsLong: [
    "Metric-disabled",
    "milliliters (mL)",
    "liters (L)",
    "cubic meters (m" + superThree + ")",
    "English-disabled",
    "gallons (US)",
    "gallons (UK)",
    "cubic feet (ft" + superThree + ")",
    "acre-ft",
  ],
  unitsShort: [
    "by Metric-disabled",
    " mL",
    " L",
    " m" + superThree,
    "by English-disabled",
    " gal (US)",
    " gal (UK)",
    " ft" + superThree,
    " ac-ft",
  ],
  min: [0, 0.1, 0.1, 0.1, 0, 0.1, 0.1, 0.1, 0.1],
  max: [0, 5000, 50000, 5000, 0, 500000, 500000, 150000, 100],
  init: {
    value: "100",
    units: "cubic meters (m" + superThree + ")",
    isValid: true,
  },
};

// VolumeType based on R code, see global.R
// 4th @param of convert(), type, re-cast to an object with .units, .factors, & .icUnits
// e.g.: volume.data = list(units = volumeUnits, factors = volumeFactors, icUnits = 'L')
export const volumeType = {
  units: [
    "",
    "milliliters (mL)",
    "liters (L)",
    "cubic meters (m" + superThree + ")",
    "",
    "gallons (US)",
    "gallons (UK)",
    "cubic feet (ft" + superThree + ")",
    "acre-ft",
  ],
  factors: [
    0, 1000.0, 1.0, 0.001, 0, 0.264172, 0.2199692, 0.035314667, 0.0000008107,
  ],
  icUnits: "liters (L)",
};

// ** AREA **
export const areaData = {
  unitsLong: [
    "Metric-disabled",
    "ha",
    "m²",
    "cm²",
    "mm²",
    "English-disabled",
    "acre",
    "yd²",
    "ft²",
  ],
  unitsShort: [
    "Metric-disabled",
    " ha",
    " m²",
    " cm²",
    " mm²",
    "English-disabled",
    " acre",
    " yd²",
    " ft²",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, 1000, 1000, 1000, 1000, 0, 1000, 5000, 10000],
  init: {
    value: "100",
    units: "m²",
    isValid: true,
  },
};

// areaType based on R code, see global.R
// 4th @param of convert(), type, re-cast to an object with .units, .factors, & .icUnits
// e.g.: aarea.data = list(units = areaUnits, factors = areaFactors, icUnits = 'L')
export const areaType = {
  units: ["", "ha", "m²", "cm²", "mm²", "", "acre", "yd²", "ft²"],
  factors: [
    0, 1.0, 10000.0, 100000000.0, 10000000000.0, 0, 2.4710538147, 11959.900463,
    107639.10417,
  ],
  icUnits: "ha",
};

// ** Stock Soln **
export const stockData = {
  unitsLong: ["%"],
  unitsShort: ["%"],
  min: [0.0],
  max: [100],
  init: {
    value: "5.7",
    units: "%",
    isValid: true,
  },
};

// ** PPM **
export const ppmData = {
  unitsLong: ["ppm"],
  unitsShort: [" ppm"],
  min: [0.0],
  max: [1000],
  init: {
    value: "15",
    units: "ppm",
    isValid: true,
  },
};

// ** BAROMETRIC **
// Barometric pressure range (see: https://water.usgs.gov/software/DOTABLES/)
// 380-836 mm Hg, 14.97-32.91 in Hg, 507-1114 mbar, 51-112 kPa, or 0.5-1.1 atm
export const barometricData = {
  unitsLong: [
    "by Pressure-disabled",
    "atm",
    "mm Hg (torr)",
    "mbar",
    "kPa",
    "by Altitude-disabled",
    "km",
    "m",
    "ft",
  ],
  unitsShort: [
    "by Pressure-disabled",
    " atm",
    " mm Hg",
    " mbar",
    " kPa",
    "by Altitude-disabled",
    " km",
    " m",
    " ft",
  ],
  min: [0, 0.5, 380, 510, 50, 0, 0, 0, 0],
  max: [0, 1.1, 830, 1115, 115, 0, 4.0, 4000, 13000],
  init: {
    value: "760",
    units: "mm Hg (torr)",
    isValid: true,
  },
};

// ** TGP ** //
export const tgpData = {
  unitsLong: [
    "percentage-disabled",
    "%",
    "Δ Pressure-disabled",
    "Δ atm",
    "Δ mm Hg (torr)",
    "Δ mbar",
    "Total Pressure-disabled",
    "atm",
    "mm Hg (torr)",
    "mbar",
  ],
  unitsShort: [
    "percentage-disabled",
    "%",
    "Δ Pressure-disabled",
    " atm",
    " mm Hg",
    " mbar",
    // " Δ atm",
    // " Δ mm Hg",
    // " Δ mbar",
    "Total Pressure-disabled",
    " atm",
    " mm Hg",
    " mbar",
  ],
  min: [0, 0, 0, -1, -600, 0, 0, 0, 0, 0],
  max: [0, 150, 0, 1, 700, 2, 0, 1.5, 1200, 60],
  init: {
    value: "5.25",
    units: "Δ mm Hg (torr)",
    isValid: true,
  },
};

// ** CO2 -- ATMOSPHERE ** //
export const co2AtmosData = {
  unitsLong: [
    "partial pressure-disabled",
    "μatm",
    "mole fraction-disabled",
    "μmol/mol",
    "mixing ratio-disabled",
    "ppmv",
    // "percentage-disabled",
    // "%"
  ],
  unitsShort: [
    "partial pressure-disabled",
    " μatm",
    "mole fraction-disabled",
    " μmol/mol",
    "mixing ratio-disabled",
    " ppmv",
    // "percentage-disabled",
    // "%"
  ],
  min: [
    0, 300, 0, 300, 0, 300,
    // 0, 0
  ],
  max: [
    0, 1000, 0, 1000, 0, 1000,
    //  0, 0.1
  ],
  init: {
    value: "405",
    units: "μatm",
    isValid: true,
  },
};

// ** CO2 -- DISSOLVED ** //
export const co2DissolvedData = {
  unitsLong: [
    "by Mass-disabled",
    "mg/L",
    "mg/kg (ppm)",
    "by Moles-disabled",
    "mmol/L (mM)",
    "mmol/kg",
    "μmol/L (μM)",
    "μmol/kg",
    "by Tension-disabled",
    "mm Hg (torr)",
    "atm",
  ],
  unitsShort: [
    "by mass-disabled",
    " mg/L",
    " mg/kg",
    "by moles-disabled",
    " mmol/L",
    " mmol/kg",
    " μmol/L",
    " μmol/kg",
    "by tension-disabled",
    " mm Hg",
    " atm",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, 100, 100, 0, 2.3, 2.3, 2300, 2300, 0, 75, 0.1],
  init: {
    value: "10",
    units: "mg/L",
    isValid: true,
  },
};

// ** critical CO2 DISSOLVED **
export const co2CritData = {
  unitsLong: ["mg/L"],
  // unitsLong: ["mg/L", "mg/kg"],
  unitsShort: [" mg/L"],
  min: [0.1],
  max: [100],
  // max: [100],
  init: {
    value: "10",
    units: "mg/L",
    isValid: true,
  },
};

// ** BIOMASS ** //
export const biomassData = {
  unitsLong: [
    "by Area-disabled",
    "kg/m²",
    "g/m²",
    "lbs/m²",
    "lbs/ft²",
    "kg/ha",
    "kg/acre",
    "lbs/ha",
    "lbs/acre",
    "by Volume-disabled",
    "kg/m³",
    "g/L",
    "lbs/gal (US)",
    "lbs/gal (UK)",
    "lbs/ft³",
    "kg/acre-ft",
    "lbs/acre-ft",
  ],
  unitsShort: [
    "by Area-disabled",
    " kg/m²",
    " g/m²",
    " lbs/m²",
    " lbs/ft²",
    " kg/ha",
    " kg/acre",
    " lbs/ha",
    " lbs/acre",
    "by Volume-disabled",
    " kg/m³",
    " g/L",
    " lbs/gal (US)",
    " lbs/gal (UK)",
    " lbs/ft³",
    " kg/acre-ft",
    " lbs/acre-ft",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, 100, 500, 250, 9, 9, 9, 9, 9, 0, 7, 7, 7, 7, 7, 7, 7],

  biomassFactors: [
    0, 1.0, 1000.0, 2.2046226218, 0.20481614, 10000.0, 4046.8564, 22046.226218,
    8921.791, 0, 1.0, 1.0, 0.0083454044, 0.010022413, 0.062427961, 1233.48,
    2719.358,
  ],
  init: {
    value: "5",
    units: "kg/m³",
    isValid: true,
  },
};

// biomass[Area/Volume]Type based on R code, see global.R
// 4th @param of convert(), type, re-cast to an object with .units, .factors, & .icUnits
// e.g.: biomass.data = list(units = biomassUnits, factors = biomassFactors, icUnits = 'L')
export const biomassVolumeType = {
  units: [
    "",
    "kg/m³",
    "g/L",
    "lbs/gal (US)",
    "lbs/gal (UK)",
    "lbs/ft³",
    "kg/acre-ft",
    "lbs/acre-ft",
  ],
  factors: [
    0, 1.0, 1.0, 0.0083454044, 0.010022413, 0.062427961, 1233.48, 2719.358,
  ],
  icUnits: "kg/m³",
};

export const biomassAreaType = {
  units: [
    "",
    "kg/m²",
    "g/m²",
    "lbs/m²",
    "lbs/ft²",
    "kg/ha",
    "kg/acre",
    "lbs/ha",
    "lbs/acre",
  ],
  factors: [
    0, 1.0, 1000.0, 2.2046226218, 0.20481614, 10000.0, 4046.8564, 22046.226218,
    8921.791,
  ],
  icUnits: "kg/m²",
};

// ** MASS -- lbs & kg (for now) ** //
export const massData = {
  unitsLong: ["kg", "lbs"],
  unitsShort: [" kg", " lbs"],
  min: [0, 0],
  max: [50000, 500000],

  biomassFactors: [1.0, 2.2046226218],
  init: {
    value: "50",
    units: "kg",
    isValid: true,
  },
};

// ** ABUNDANCE ** //
export const abundanceData = {
  unitsLong: [
    "by Area-disabled",
    "ind/m²",
    "ind/ft²",
    "ind/ha",
    "ind/acre",
    "by Volume-disabled",
    "ind/m³",
    "ind/L",
    "ind/gal (US)",
    "ind/gal (UK)",
    "ind/ft³",
    "ind/acre-ft",
  ],
  unitsShort: [
    "by Area-disabled",
    " ind/m²",
    " ind/ft²",
    " ind/ha",
    " ind/acre",
    "by Volume-disabled",
    " ind/m³",
    " ind/L",
    " ind/gal (US)",
    " ind/gal (UK)",
    " ind/ft³",
    " ind/acre-ft",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, 500, 250, 5000, 2500, 0, 500, 50, 50, 50, 50, 50],

  abundanceFactors: [
    0, 1.0, 0.09290313, 10000, 4046.781, 0, 1.0, 0.001, 0.003785441,
    0.004546074, 0.02831682, 1233.502,
  ],
  init: {
    value: "20",
    units: "ind/m²",
    isValid: true,
  },
};

// abundance[Area/Volume]Type based on R code, see global.R
// 4th @param of convert(), type, re-cast to an object with .units, .factors, & .icUnits
// e.g.: abundance.data = list(units = abundanceUnits, factors = abundanceFactors, icUnits = 'L')
export const abundanceVolumeType = {
  units: [
    "",
    "ind/m³",
    "ind/L",
    "ind/gal (US)",
    "ind/gal (UK)",
    "ind/ft³",
    "ind/acre-ft",
  ],
  factors: [0, 1.0, 0.001, 0.003785441, 0.004546074, 0.02831682, 1233.502],
  icUnits: "ind/m³",
};

export const abundanceAreaType = {
  units: ["", "ind/m²", "ind/ft²", "ind/ha", "ind/acre"],
  factors: [0, 1.0, 0.09290313, 10000, 4046.781],
  icUnits: "ind/m²",
};

// ** W-BAR **
export const wbarData = {
  unitsLong: ["g/ind", "kg/ind", "lbs/ind"],
  unitsShort: [" g/ind", " kg/ind", " lbs/ind"],
  min: [0, 0, 0],
  max: [900, 25, 15],
  init: {
    value: "12",
    units: "g/ind",
    isValid: true,
  },
};

// --- Specific Feed Rad, TAN, O2, & CO2 factors for FeedFlow component -- //

// ** SPECIFIC FEED RATE **
export const sfrData = {
  unitsLong: ["%/day"],
  unitsShort: ["%/day"],
  // unitsShort: [" %/day"],
  min: [0],
  max: [25],
  init: {
    value: "1.20",
    units: "%/day",
    isValid: true,
  },
};

// ** TAN FACTOR **
export const tanFactorData = {
  unitsLong: ["g TA-N/kg feed"],
  unitsShort: [" g TA-N/kg feed"],
  min: [0],
  max: [60],
  init: {
    value: "32.5",
    units: "g TA-N/kg feed",
    isValid: true,
  },
};

// ** PROTEIN FACTOR **
export const proteinFactorData = {
  unitsLong: ["%"],
  unitsShort: ["%"],
  min: [25],
  max: [65],
  init: {
    value: "35",
    units: "%",
    isValid: true,
  },
};

// ** O2 FACTOR **
export const o2FactorData = {
  unitsLong: ["kg O₂/kg feed"],
  unitsShort: [" kg O₂/kg feed"],
  min: [0.2],
  max: [1.0],
  init: {
    value: "0.35",
    units: "kg O₂/kg feed",
    isValid: true,
  },
};

// ** CO2 FACTOR **
export const co2FactorData = {
  unitsLong: ["kg CO₂/kg O₂"],
  unitsShort: [" kg CO₂/kg O₂"],
  min: [0],
  max: [1.8],
  init: {
    value: "1.3",
    units: "kg CO₂/kg O₂",
    isValid: true,
  },
};

// ** POWER (used as 'orphaned' SELECT (i.e., no INPUT) in Heatup) **
export const powerData = {
  unitsLong: ["kilowatts (kW)", "watts (W)", "BTU/hr", "BTU/min"],
  unitsShort: [" kW", " W", " BTU/hr", " BTU/min"],
  min: [0, 0, 0, 0],
  max: [1000, 2000, 1000, 1000],
  init: {
    value: "5",
    units: "kilowatts (kW)",
    isValid: true,
  },
};

// ** TIME (used in Heatup) **
export const timeData = {
  unitsLong: ["minutes", "hours", "days"],
  unitsShort: [" min", " hr", " d"],
  min: [10, 0.5, 0.5],
  max: [90, 72, 4],
  init: {
    value: "6",
    units: "hours",
    isValid: true,
  },
};

// ** COST (used in Heatup) **
export const costData = {
  unitsLong: [
    "Natural Gas-disabled",
    "/therm",
    "/Ccf",
    "Heating Oil-disabled",
    "/gal (US)",
    "Propane LPG-disabled",
    "/gal(US)",
    "Electricity-disabled",
    "/kWh",
  ],
  unitsShort: [
    "Natural Gas-disabled",
    "/therm",
    "/Ccf",
    "Heating Oil-disabled",
    "/gal (US)",
    "Propane LPG-disabled",
    "/gal(US)",
    "Electricity-disabled",
    "/kWh",
  ],
  min: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  max: [0, "*", "*", 0, "*", 0, "*", 0, "*"],
  init: {
    value: "0.15",
    units: "/kWh",
    isValid: true,
  },
};

// ** RELATIVE HUMIDITY (used in Heatup) **
export const relativeHumidityData = {
  unitsLong: ["%"],
  unitsShort: ["%"],
  min: [0],
  max: [100],
  init: {
    value: "50",
    units: "%",
    isValid: true,
  },
};

// ** TANK - STOOGES CODE **
// export const tankData = {
//   unitsLong: ["I", "II", "III", "IV"],
//   unitsShort: ["I", "II", "III", "IV"],
//   min: [" ", " ", " ", " "],
//   max: ["IV", "IV", "IV", "IV"],
//   init: {
//     value: "I",
//     units: "I",
//     isValid: true,
//   },
// };

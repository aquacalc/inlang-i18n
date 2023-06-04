import { format } from "d3";

// NB: When needed, over-ride round() in generalConversions
const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

const isEmpty = (myObj) => Object.keys(myObj).length === 0;

// Nice 'trick' at ~5h 48m 00s of https://www.youtube.com/watch?v=2LhoCfjm8R4
const siFormat = () => format(".2s");
const siFormatLong = () => format(".3s");

const wqTickFormat = (tickValue) => format("0.1f")(tickValue);
const tickFormat = (tickValue) => siFormat()(tickValue).replace("G", "B");

const tickFormatLong = (tickValue) =>
  siFormatLong()(tickValue).replace("G", " Billion").replace("M", " Million");

const myFormats = {
  round,
  wqTickFormat,
  isEmpty,
  tickFormat,
  tickFormatLong,
};

export default myFormats;

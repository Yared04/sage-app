import React, { useContext, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { AppContext } from "../pages/_app";

const textTransformerTimes = (value: number): string => {
  return value === 0
    ? "12am"
    : (value < 13 ? value : value - 12) + (value < 12 ? "am" : "pm");
};

const TIME = { min: 0, max: 24 };

const SliderComponent = (): JSX.Element => {
  const { min, max } = TIME;
  const { state, setState } = useContext(AppContext);

  const onValuesChange = (value: number): void => {
    state.selectedTime?.setHours(value);
    setState((prevState: any) => ({
      ...prevState,
      selectedTime: new Date(prevState.selectedTime?.setHours(value)),
    }));
  };

  return (
    <div className="mt-4">
      <Slider
        className=""
        min={min}
        max={max}
        value={state.selectedTime?.getHours()}
        onChange={onValuesChange}
        // onAfterChange={onValuesChange}
        marks={{
          [min]: textTransformerTimes(min),
          [max]: textTransformerTimes(max),
        }}
        step={1}
        railStyle={{ backgroundColor: "#E5E7EB", height: 7 }}
        trackStyle={{ backgroundColor: "#00274c", height: 7 }}
        handleStyle={{ borderColor: "#00274c" }}
        dotStyle={{
          visibility: "hidden",
        }}
      />
    </div>
  );
};

export default SliderComponent;

"use client";
import React, { useContext, useEffect, useState } from "react";
import { Graph } from "../../components/Graph";
import clsx from "clsx";
import { AppContext } from "../_app";
import RangeSlider from "../../components/Slider";
import Nav from "../../components/Nav";
import { useRouter } from "next/router";
import axios from "axios";

export type ButtonStates = {
  [key: string]: boolean;
};

const Detail = () => {
  const [buttonStates, setButtonStates] = useState<ButtonStates>({
    operational: false,
    dataTransfer: false,
    batteryStorage: false,
    embodied: false,
  });

  const { state, setState } = useContext(AppContext);
  const router = useRouter();
  const { id } = router.query;
  const [projectData, setProjectData] = useState<any>(null); // Modify the type based on your project data structure

  const fetchProjectData = async (id: string) => {
    // Perform an API call or use any data fetching method to retrieve the project data
    try {
      const res = await axios.get(`http://localhost:8080/api/projects/${id}`);
      const projectData = res.data.project;
      return projectData.dataCenters;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Fetch the project data whenever the slider values change
    if (state.selectedTime && id) {
      // Perform an API call or use any data fetching method to retrieve the project data
      fetchProjectData(id).then((dataCenters) => {
        setProjectData(dataCenters);
      });
    }
  }, [id, state.selectedTime]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    setState((prevState: any) => ({
      ...prevState,
      selectedDate: new Date(dateValue),
    }));
  };
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value;
    const timeParts = timeValue.split(":");
    const selectedTime = new Date();
    selectedTime.setHours(parseInt(timeParts[0], 10));
    selectedTime.setMinutes(parseInt(timeParts[1], 10));
    setState((prevState: any) => ({
      ...prevState,
      selectedTime: selectedTime,
    }));
  };
  const toggleButton = (btnName: string) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [btnName]: !prevState[btnName],
    }));
  };
  const today = new Date().toISOString().split("T")[0];
  const cur_time = new Date().toTimeString().substring(0, 5);

  return (
    <>
      <nav>
        <Nav />
      </nav>
      <div className="mx-6 sm:mx-20 flex flex-col gap-12 lg:flex-row">
        <div className=" md:basis-3/5 flex flex-col gap-12 lg:border-r-2">
          <div className="overflow-x-auto p-3 ">
            <div className="flex sm:flex-col gap-5 sm:gap-11">
              <div className="flex gap-5 sm:gap-11 justify-center">
                <button
                  className={clsx(
                    " shrink-0 font-bold rounded-md shadow-xl sm:text-2xl w-36 sm:w-64 lg:w-72 h-20 sm:p-2",
                    buttonStates.operational
                      ? "bg-primary text-white ring-2 ring-offset-2 ring-primary"
                      : "bg-white text-black"
                  )}
                  onClick={() => toggleButton("operational")}
                >
                  <span>Operational</span>
                  <br />
                  Carbon Footprint
                </button>
                <button
                  className={clsx(
                    "shrink-0 font-bold rounded-md shadow-xl sm:text-2xl w-36 sm:w-64 lg:w-72 h-20 sm:p-2 ",
                    buttonStates.dataTransfer
                      ? "bg-primary text-white ring-2 ring-offset-2 ring-primary"
                      : "bg-white text-black"
                  )}
                  onClick={() => toggleButton("dataTransfer")}
                >
                  <span>Data Transfer</span>
                  <br />
                  Carbon Footprint
                </button>
              </div>
              <div className="flex gap-5 sm:gap-11 justify-center">
                <button
                  className={clsx(
                    "shrink-0 font-bold rounded-md shadow-xl sm:text-2xl w-36 sm:w-64 lg:w-72 h-20 sm:p-2 ",
                    buttonStates.batteryStorage
                      ? "bg-primary text-white ring-2 ring-offset-2 ring-primary"
                      : "bg-white text-black"
                  )}
                  onClick={() => toggleButton("batteryStorage")}
                >
                  <span>Battery Storage</span>
                  <br />
                  Carbon Footprint
                </button>
                <button
                  className={clsx(
                    "shrink-0 font-bold rounded-md shadow-xl sm:text-2xl w-36 sm:w-64 lg:w-72 h-20 sm:p-2 ",
                    buttonStates.embodied
                      ? "bg-primary text-white ring-2 ring-offset-2 ring-primary"
                      : "bg-white text-black"
                  )}
                  onClick={() => toggleButton("embodied")}
                >
                  <span>Embodied</span>
                  <br />
                  Carbon Footprint
                </button>
              </div>
            </div>
          </div>
          {projectData && (
            <Graph data={projectData} selectedCFs={buttonStates} />
          )}
        </div>
        <div className="md:basis-2/5">
          <p className="text-xl font-bold mb-5">Complete By:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="">
              <label className="mr-2 text-lg font-medium" htmlFor="datePicker">
                Date:
              </label>
              <input
                className="outline outline-gray-500 outline-1 rounded-sm w-32 h-8"
                type="date"
                id="datePicker"
                min={today}
                max=""
                value={
                  state.selectedDate
                    ? state.selectedDate.toISOString().substring(0, 10)
                    : ""
                }
                onChange={handleDateChange}
              />
            </div>

            <div className="">
              <label className="mr-2 text-lg font-medium " htmlFor="timePicker">
                Time:
              </label>
              <input
                className="outline outline-gray-500 outline-1 rounded-sm w-32 h-8"
                type="time"
                id="timePicker"
                min={cur_time}
                value={
                  state.selectedTime
                    ? (state.selectedTime.getHours() < 10 ? "0" : "") +
                      state.selectedTime.getHours() +
                      ":" +
                      state.selectedTime.toISOString().substring(14, 16)
                    : ""
                }
                onChange={handleTimeChange}
              />
            </div>
          </div>

          <RangeSlider />
        </div>
      </div>
    </>
  );
};

export default Detail;

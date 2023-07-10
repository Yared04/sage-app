"use client";
import React, { useContext, useEffect, useState } from "react";
import { DataCenter } from "@/types/DataCenter";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { AppContext } from "@/pages/_app";

interface CreateProps {
  dataCenters: DataCenter[];
}

const Create = ({ dataCenters }: CreateProps) => {
  const [projectName, setProjectName] = useState<string>("");
  const [softwareCharacteristicsFile, setFile] = useState<File | null>(null);
  const [selectedDataCenters, setSelectedDataCenters] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [distanceFilter, setDistanceFilter] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const { state, setState } = useContext(AppContext);

  const router = useRouter();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          // Reverse geocoding using Google Maps Geocoding API
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
          fetch(geocodingUrl)
            .then((response) => response.json())
            .then((data) => {
              const address = data.results[0].formatted_address;

              // Pre-fill the location state with the address
              setLocation(address);
            })
            .catch((error) => {
              console.error("Error retrieving address:", error);
            });
        },
        function (error) {
          // Handle errors
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleDataCenterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;

    if (checked) {
      // Find the corresponding data center object
      const selectedDataCenter = dataCenters.find(
        (dataCenter) => dataCenter._id === value
      );

      if (selectedDataCenter) {
        // Add the ID to the selectedDataCenters array
        setSelectedDataCenters((prevSelectedDataCenters) => [
          ...prevSelectedDataCenters,
          selectedDataCenter._id,
        ]);
      }
    } else {
      // Remove the ID from the selectedDataCenters array
      setSelectedDataCenters((prevSelectedDataCenters) =>
        prevSelectedDataCenters.filter((dataCenterId) => dataCenterId !== value)
      );
    }
  };

  const handleCountryFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    if (checked) {
      setCountryFilter([...countryFilter, value]);
    } else {
      setCountryFilter(countryFilter.filter((country) => country !== value));
    }
  };

  const filterDataCenters = (dataCenters: DataCenter[]) => {
    let filteredDataCenters = dataCenters;

    if (countryFilter.length > 0) {
      filteredDataCenters = filteredDataCenters.filter((dataCenter) =>
        countryFilter.includes(dataCenter.country!)
      );
    }

    if (distanceFilter) {
      filteredDataCenters = filteredDataCenters.filter(
        (dataCenter) => dataCenter.distance <= distanceFilter
      );
    }

    return filteredDataCenters;
  };

  const filteredCountries = Array.from(
    new Set(dataCenters.map((dataCenter: DataCenter) => dataCenter.country))
  );

  const filteredDataCenters = filterDataCenters(dataCenters);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    event.preventDefault();

    // Create a FormData object to send the form data
    let fd = new FormData();

    fd.append("projectName", projectName);
    fd.append("file", softwareCharacteristicsFile);
    fd.append("userId", state.curUser ? state.curUser.id : "");

    selectedDataCenters.forEach((dataCenterId) => {
      fd.append("dataCenters[]", dataCenterId);
    });

    fd.append("dataCenterIds", JSON.stringify(selectedDataCenters));

    try {
      const response = await axios.post(
        `http://localhost:8080/api/projects/new-project`,
        fd
      );

      if (response.status === 201) {
        // Handle success response

        router.push(`/projects/${response.data.project._id}`); // Navigate to the newly created project page
      } else {
        // Handle error response
        console.error("Failed to send data.");
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    setTimeout(() => {
      setLoading(false); // Set loading state to false after the delay
    }, 2000);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-3/4">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            <span className="sr-only">Loading...</span>
          </div>
          <h1 className="text-center mb-4">
            These are the parameters we gathered...
          </h1>
          <div>
            <p className="font-bold">Software Characteristics</p>
            <ul>
              <li>Dynamic Instructions Count</li>
              <li></li>
              <li></li>
            </ul>
          </div>
          <div>
            <p className="font-bold">Hardware Characteristics</p>
            <ul>
              <li>Processor Type</li>
              <li>Cache</li>
              <li></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="mx-6 sm:mx-20 sm:flex sm:gap-10 max-h-screen">
          <div className="mb-3 sm:basis-1/2 sm:pr-16 sm:border-r sm:border-gray-200 flex-grow">
            <label htmlFor="Name" className="inline-block text-bold text-xl">
              Project Name:
            </label>
            <input
              id="Name"
              type="text"
              value={projectName}
              placeholder="Enter workload name"
              onChange={(event) => setProjectName(event.target.value)}
              className="w-full mt-1 mb-4 p-3 border border-solid border-neutral-300 text-neutral-700 transition duration-300 ease-in-out rounded-md bg-clip-padding focus:border-primary focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:focus:border-primary"
            />

            <label htmlFor="File" className="inline-block text-bold text-xl">
              Upload File:
            </label>
            <input
              className="relative mx-0 mt-1 mb-4 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] font-normal leading-[2.15] text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
              id="File"
              type="file"
              onChange={handleFileChange}
            />
            <label
              htmlFor="Location"
              className="inline-block text-bold text-xl"
            >
              Your Location:
            </label>
            <input
              id="Location"
              type="text"
              placeholder="Enter location"
              className="w-full mt-1 mb-4 p-3 border border-solid border-neutral-300 text-neutral-700 transition duration-300 ease-in-out rounded-md bg-clip-padding focus:border-primary focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:focus:border-primary"
              value={location}
              onChange={handleLocationChange}
            />
          </div>
          <div className="sm:basis-1/2 flex-grow">
            <p className="text-bold text-xl">
              Pick desireable data centers to run your workoad
            </p>
            <div className="grid grid-cols-2 m-3 sm:grid-cols-4 gap-2">
              {filteredCountries.map((country) => (
                <label key={country} className="flex items-center">
                  <input
                    type="checkbox"
                    value={country}
                    checked={countryFilter.includes(country!)}
                    onChange={handleCountryFilterChange}
                    className="mr-2"
                  />
                  {country}
                </label>
              ))}
            </div>
            <div>
              <label htmlFor="distance">Maximum Distance:</label>
              <input
                className=" mt-1 sm:m-4 p-1 border border-solid border-neutral-300 text-neutral-700 transition duration-300 ease-in-out rounded-md bg-clip-padding focus:border-primary focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:bg-neutral-700 dark:focus:border-primary"
                type="number"
                id="distance"
                value={distanceFilter === 0 ? "" : distanceFilter}
                onChange={(e) => setDistanceFilter(Number(e.target.value))}
              />
            </div>
            <div>
              {filteredDataCenters.map((dataCenter) => (
                <div
                  key={dataCenter.name}
                  className="w-full border border-y-2 border-gray-100 p-4 bg-white shadow-sm text-sm font-medium text-gray-700 rounded-md"
                >
                  <label>
                    <input
                      type="checkbox"
                      value={dataCenter._id}
                      checked={selectedDataCenters.includes(dataCenter._id)}
                      onChange={handleDataCenterChange}
                      className="mr-2"
                    />
                    {dataCenter.name} - {dataCenter.country} -{" "}
                    {dataCenter.distance} miles
                  </label>
                </div>
              ))}
              <button
                className="mt-4 font-bold text-lg w-24 h-10 bg-primary text-white rounded-md shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary "
                onClick={handleSubmit}
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Create;

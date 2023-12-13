// RouteReport.js
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MapComponent from "./MapComponent.js";
import { useJsApiLoader } from "@react-google-maps/api";
import { ReactComponent as CalendarSvg } from "../calendar.svg";
import * as XLSX from "xlsx";
import { RiFileExcel2Fill as ExcelIcon } from "react-icons/ri";
import axios from "axios";
import { formatDrivingTime, formatCustomDate } from "../utils.js";

function isValidRoute(route) {
  const requiredKeys = [
    "route_id",
    "type",
    "start",
    "avg_speed",
    "max_speed",
    "end",
    "distance",
    "decoded_route",
  ];
  return requiredKeys.every((key) => key in route);
}

const librariesArray = ["geometry"]; // Define the libraries array outside the component
const baseUrl = "https://mapon.com/api/v1/";
const exportToExcel = (dataToExport, customFileName) => {
  if (dataToExport.length === 0) {
    console.warn("No data to export.");
    return;
  }

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Routes");
  XLSX.writeFile(wb, customFileName + ".xlsx");
};

function RouteReport() {
  const defaultFromDate = new Date();
  defaultFromDate.setDate(defaultFromDate.getDate() - 7);

  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(new Date());
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleError, setVehicleError] = useState("");
  const [dateRangeError, setDateRangeError] = useState("");
  const [routes, setRoutes] = useState([]);
  const [fileName, setFileName] = useState("Routes");
  const [initialLoading, setInitialLoading] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: librariesArray,
  });

  // MS Excel Column export
  const filterData = (routes) => {
    return routes.map((route, index) => ({
      "Start Time": route.start.time,
      "End Time": route.end.time,
      "Start Address": route.start.address,
      "End Address": route.end.address,
      Duration: formatDrivingTime(route.start.time, route.end.time),
      Distance: (route.distance / 1000).toFixed(2),
    }));
  };

  useEffect(() => {
    const fetchVehicleOptions = async () => {
      try {
        const response = await axios.get(
          baseUrl + "unit/list.json?key=" + process.env.REACT_APP_MAPON_API_KEY
        );
        if (response.data && response.data.data && response.data.data.units) {
          setVehicleOptions(response.data.data.units);
          console.log("Fetched vehicle options:", response.data.data.units);
        }
      } catch (error) {
        console.error("Error fetching vehicle options:", error);
      }
    };

    fetchVehicleOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setVehicleError("");
    setDateRangeError("");

    if (!selectedVehicle) {
      setVehicleError("Please select a vehicle.");

      // Clear the error message after 5 seconds
      setTimeout(() => {
        setVehicleError("");
      }, 5000);
      return;
    }
    if (!fromDate || !toDate) {
      setDateRangeError("Please select both start and end dates.");
      setTimeout(() => {
        setDateRangeError("");
      }, 5000);
      return;
    }

    const maxDateRange = 31;
    const currentDate = new Date();

    if (fromDate > currentDate || toDate > currentDate) {
      setDateRangeError("Dates cannot exceed the current date.");
      setTimeout(() => {
        setDateRangeError("");
      }, 5000);
      return;
    }

    const timeDifference = toDate.getTime() - fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference > maxDateRange) {
      setDateRangeError(
        `The date range exceeds ${maxDateRange} days. Please select a shorter range.`
      );
      setTimeout(() => {
        setDateRangeError("");
      }, 5000);
    } else if (fromDate > toDate) {
      setDateRangeError(
        "The start date cannot be after the end date. Please check your dates."
      );
      setTimeout(() => {
        setDateRangeError("");
      }, 5000);
    }

    const apiUrl = `${baseUrl}route/list.json?key=${
      process.env.REACT_APP_MAPON_API_KEY
    }&from=${fromDate.toISOString().split(".")[0] + "Z"}&till=${
      toDate.toISOString().split(".")[0] + "Z"
    }&unit_id=${selectedVehicle}&include[]=decoded_route`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.error) {
        const { code, msg } = response.data.error;
        console.error("API Error:", code, msg);
        return;
      }

      if (
        response.data &&
        response.data.data &&
        response.data.data.units &&
        response.data.data.units[0] &&
        response.data.data.units[0].routes
      ) {
        const unitId = response.data.data.units[0].unit_id;
        const validRoutes = [];
        const invalidRoutes = [];

        response.data.data.units[0].routes.forEach((route) => {
          if (route.type === "route") {
            if (isValidRoute(route)) {
              validRoutes.push(route);
            } else {
              invalidRoutes.push(route);
            }
          }
        });

        if (invalidRoutes.length > 0) {
          console.log(`Invalid route structure found in unit_id: ${unitId}`);
          invalidRoutes.forEach((route) =>
            console.log(`Invalid route data:`, route)
          );
        }

        console.log(validRoutes);
        setRoutes(validRoutes);
      } else {
        setRoutes([]);
        // Message: No routes available.
      }
      setInitialLoading(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      return;
    }

    const selectedVehicleOption = vehicleOptions.find(
      (option) => option.unit_id == selectedVehicle
    );

    if (selectedVehicleOption) {
      const { label, number } = selectedVehicleOption;
      setFileName(
        `Routes_${label}_${number}_from_${formatCustomDate(
          fromDate
        )}_to_${formatCustomDate(toDate)}`
      );
      console.log(`Routes_${label}_${number}_from_${formatCustomDate(
        fromDate
      )}_to_${formatCustomDate(toDate)}`);
    } else {
      console.warn(`No vehicle option found for unit_id: ${selectedVehicle}`);
    }
  };

  return (
    <>
      <div className="errors">
        <p className={`error-modal ${!vehicleError && "invisible"}`}>
          {vehicleError}
        </p>
        <p className={`error-modal ${!dateRangeError && "invisible"}`}>
          {dateRangeError}
        </p>
      </div>
      <div className="container">
        <form className="route-report" onSubmit={handleSubmit}>
          <div className="wrapper">
            <h1>Route report</h1>
            <div className="input">
              <label htmlFor="vehicle-number" className="input-label required">
                Vehicle number
              </label>
              <select
                id="vehicle-number"
                name="vehicle-number"
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
              >
                <option value="" defaultValue>
                  Select vehicle
                </option>
                {vehicleOptions.map((vehicle) => (
                  <option key={vehicle.unit_id} value={vehicle.unit_id}>
                    {vehicle.number} | {vehicle.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="input">
              <span className="input-label">Period</span>
              <div className="period">
                <div className="date">
                  <label htmlFor="from-date">From</label>
                  <DatePicker
                    showIcon
                    id="from-date"
                    selected={fromDate}
                    onChange={setFromDate}
                    dateFormat="yyyy.MM.dd"
                    icon={<CalendarSvg />}
                  />
                </div>
                <div className="date">
                  <label htmlFor="to-date">To</label>
                  <DatePicker
                    showIcon
                    id="to-date"
                    selected={toDate}
                    onChange={setToDate}
                    dateFormat="yyyy.MM.dd"
                    icon={<CalendarSvg />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="action">
            {routes.length > 0 && (
              <button
                id="excel-btn"
                type="button"
                onClick={() => exportToExcel(filterData(routes), fileName)}
              >
                <ExcelIcon />
                Export to Excel
              </button>
            )}
            <button id="generate-btn" type="submit">
              Generate
            </button>
          </div>
        </form>
        {!initialLoading &&
          (isLoaded ? (
            routes.length > 0 ? (
              routes.map((route, index) => (
                <MapComponent key={index} route={route} isLoaded={isLoaded} />
              ))
            ) : (
              <p>
                No routes available from {formatCustomDate(fromDate, ".")} to{" "}
                {formatCustomDate(toDate, ".")}.
              </p>
            )
          ) : initialLoading ? (
            <p>Loading routes...</p>
          ) : null)}
      </div>
    </>
  );
}

export default RouteReport;

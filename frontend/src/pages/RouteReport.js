// App.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import MapComponent from './MapComponent';
import { useJsApiLoader } from '@react-google-maps/api';
import { ReactComponent as CalendarSvg } from '../calendar.svg';
import * as XLSX from 'xlsx';
import { RiFileExcel2Fill } from "react-icons/ri";

const librariesArray = ['geometry'];  // Define the libraries array outside the component

const exportToExcel = (dataToExport) => {
  if (dataToExport.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Routes');
  XLSX.writeFile(wb, 'routes.xlsx');
};

function formatDrivingTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const timeDifference = end - start;

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function RouteReport() {
  const [fromDate, setFromDate] = useState(new Date('2023-11-10'));
  const [toDate, setToDate] = useState(new Date());
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleError, setVehicleError] = useState('');
  const [dateRangeError, setDateRangeError] = useState('');
  const [routes, setRoutes] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: librariesArray,  // Use the constant here
  });

  const formatDateWithDots = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('default', options).format(date);
    return formattedDate.replace(/\//g, '.');
  };

  const filterData = (routes) => {
    return routes.map((route, index) => ({
      StartTime: route.start.time,
      EndTime: route.end.time,
      StartAddress: route.start.address,
      EndAddress: route.end.address,
      Duration: formatDrivingTime(route.start.time, route.end.time),
      Distance: (route.distance / 1000).toFixed(2),
    }));
  };
  
  useEffect(() => {
    const fetchVehicleOptions = async () => {
      try {
        const response = await axios.get('https://mapon.com/api/v1/unit/list.json?key=' + process.env.REACT_APP_MAPON_API_KEY);
        if (response.data && response.data.data && response.data.data.units) {
          setVehicleOptions(response.data.data.units);
          console.log('Fetched vehicle options:', response.data.data.units);
        }
      } catch (error) {
        console.error('Error fetching vehicle options:', error);
      }
    };

    fetchVehicleOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setVehicleError('');
    setDateRangeError('');

    if (!selectedVehicle) {
      setVehicleError('Please select a vehicle.');
      
      // Clear the error message after 5 seconds
      setTimeout(() => {
        setVehicleError('');
      }, 5000);
      
      return;
    }

    const maxDateRange = 31;
    const currentDate = new Date();

    if (fromDate > currentDate || toDate > currentDate) {
      setDateRangeError('Dates cannot exceed the current date.');
      return;
    }

    const timeDifference = toDate.getTime() - fromDate.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);

    if (dayDifference > maxDateRange || fromDate > toDate) {
      setDateRangeError('Invalid date range. Please check your dates.');

      setTimeout(() => {
        setDateRangeError('');
      }, 5000);
      return;
    }
    console.log(`https://mapon.com/api/v1/route/list.json?key=${process.env.REACT_APP_MAPON_API_KEY}&from=${fromDate.toISOString().split('.')[0] + 'Z'}&till=${toDate.toISOString().split('.')[0] + 'Z'}&unit_id=${selectedVehicle}&include[]=decoded_route`);
    try {
      const response = await axios.get(
        `https://mapon.com/api/v1/route/list.json?key=${process.env.REACT_APP_MAPON_API_KEY}&from=${fromDate.toISOString().split('.')[0] + 'Z'}&till=${toDate.toISOString().split('.')[0] + 'Z'}&unit_id=${selectedVehicle}&include[]=decoded_route`
      );

      if (response.data && response.data.error) {
        const { code, msg } = response.data.error;
        console.error('API Error:', code, msg);
        return;
      }

      if (response.data && response.data.data && response.data.data.units && response.data.data.units[0] && response.data.data.units[0].routes) {
        const filteredRoutes = response.data.data.units[0].routes.filter(route => route.type === 'route');
        console.log(filteredRoutes);
        setRoutes(filteredRoutes);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <>
      <div className="errors">
        <p className={`error-modal ${!vehicleError && 'invisible'}`}>
          {vehicleError}
        </p>
        <p className={`error-modal ${!dateRangeError && 'invisible'}`}>
          {dateRangeError}
        </p>
      </div>
      <div className="container">
        <form className="route-report" onSubmit={handleSubmit}>
          <div className="wrapper">
          <h1>Route report</h1>
            <div className="input">
              <label htmlFor="vehicle-number" className="input-label required">Vehicle number</label>
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
                    {vehicle.label} - {vehicle.number}
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
                    dateFormat={formatDateWithDots(fromDate)}
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
                    dateFormat={formatDateWithDots(toDate)}
                    icon={<CalendarSvg />}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="action">
          {routes.length > 0 && (
            <button type="button" onClick={() => exportToExcel(filterData(routes))}>
              <RiFileExcel2Fill />
              Export to Excel
              </button>
          )}
          <button type="submit">Generate</button>
          </div>
        </form>
        {isLoaded && routes.map((route, index) => (
          <MapComponent key={index} route={route} isLoaded={isLoaded} />
        ))}
      </div>
    </>
  );
}

export default RouteReport;
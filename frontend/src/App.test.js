import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';  // Import Axios
import RouteReport from './pages/RouteReport.js';

// Mock Axios
jest.mock('axios');

// Sample response data
const mockResponseData = {
  data: {
    error: null,
    data: {
      units: [
        {
          unit_id: 'sample_unit_id',
          routes: [
            {
              route_id: 'sample_route_id',
              type: 'route',
              start: { time: '2023-01-01T00:00:00Z', address: 'Start Address' },
              end: { time: '2023-01-01T01:00:00Z', address: 'End Address' },
              avg_speed: 60,
              max_speed: 80,
              distance: 10000,
              decoded_route: 'sample_decoded_route',
            },
          ],
        },
      ],
    },
  },
};

// Sample vehicle options
const mockVehicleOptions = [
  { unit_id: '81297', number: 'JL-2400', label: 'BMW' },
];

describe('RouteReport', () => {
  // Mocking useEffect to avoid issues with useJsApiLoader
  jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

  it('renders RouteReport component and fetches data', async () => {
    // Mocking the Axios get method to return the sample data
    axios.get.mockResolvedValueOnce(mockResponseData);

    render(<RouteReport />);

    // Select a vehicle
    fireEvent.change(screen.getByLabelText(/Vehicle number/i), {
      target: { value: '81297' },
    });

    // Set date range
    fireEvent.change(screen.getByLabelText(/From/i), {
      target: { value: '2023-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/To/i), {
      target: { value: '2023-01-02' },
    });

    // Click the generate button
    fireEvent.click(screen.getByText(/Generate/i));

    // Wait for the Axios request to be completed
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    // Check if the component renders the fetched route data
    expect(screen.getByText(/Start Address/i)).toBeInTheDocument();
    expect(screen.getByText(/End Address/i)).toBeInTheDocument();
    // Add more assertions based on your actual component content

    // Mocking XLSX.writeFile to avoid actual file creation during testing
    jest.spyOn(window.XLSX, 'writeFile').mockImplementation(() => {});

    // Click the export to Excel button
    fireEvent.click(screen.getByText(/Export to Excel/i));

    // Check if XLSX.writeFile is called
    expect(window.XLSX.writeFile).toHaveBeenCalledTimes(1);
  });
});

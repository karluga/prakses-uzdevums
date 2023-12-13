import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import App from "./App.js";
import { AuthProvider, useAuth } from "./AuthContext.js";
import Layout from "./pages/Layout.js";
import RouteReport from "./pages/RouteReport.js";
import MapComponent from "./pages/MapComponent.js";
import Login from "./pages/Login.js";
import NoPage from "./pages/NoPage.js";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  if (!auth.user) {
    // User is not authenticated, redirect to /login
    return <Navigate to="/login" replace />;
  }
  return children;
};

describe("Layout component", () => {
  test("renders main page without crashing and detects logo image", () => {
    render(<App />);

    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toBeInTheDocument();
  });
});

describe("RouteReport component", () => {
  test("generates route report with real response", async () => {
    render(<RouteReport />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Vehicle number/i)).toBeInTheDocument();
    });

    const mockRoute = {
      route_id: "456",
      type: "route",
      start: { time: "2023-01-01T10:00:00Z", address: "Start Address" },
      end: { time: "2023-01-01T12:00:00Z", address: "End Address" },
      avg_speed: 60,
      max_speed: 80,
      distance: 100000,
      decoded_route: {
        points: [
          {
            gmt: "2023-11-16T15:08:59Z",
            lat: 56.92801000000001,
            lng: 24.082990000000002,
            speed: 0,
          },
          {
            gmt: "2023-11-16T15:08:59Z",
            lat: 56.92784,
            lng: 24.08274,
            speed: 0,
          },
          {
            gmt: "2023-11-16T15:09:00Z",
            lat: 56.92790000000001,
            lng: 24.08275,
            speed: 8,
          },
        ],
      },
    };

    render(<MapComponent route={mockRoute} isLoaded={true} />);

    expect(screen.getByText(/Km driven/i)).toBeInTheDocument();
    expect(screen.getByText(/Driving time/i)).toBeInTheDocument();
  });
});

describe("App Routing", () => {
  test("displays RouteReport for authenticated users", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <RouteReport />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
  });

  test("displays '404 - Page not found' for non-existing route", () => {
    render(
      <MemoryRouter initialEntries={["/non-existing-route"]}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <RouteReport />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="*" element={<NoPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    const notFoundText = screen.getByText("404 - Page not found");
    expect(notFoundText).toBeInTheDocument();
  });
});
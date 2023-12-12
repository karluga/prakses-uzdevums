import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App'; // assuming this is the main component of your app

const mockAxios = new MockAdapter(axios);


// Test to check if the main page renders without crashing
test('renders main page without crashing', () => {
  render(<App />);

  // Check if the image with alt text "logo" is present
  const logoImage = screen.getByAltText('logo');
  expect(logoImage).toBeInTheDocument();
});

// Mocking the successful registration response
mockAxios.onPost('http://localhost/backend/register.php').reply(200, {
  user: {
    id: 123, // replace with the actual value of $lastInsertId
    username: 'jesttest', // replace with the actual value of $username
  },
});

test('simulates user registration', async () => {
  render(<App />);

  // Navigate to the registration form or component
  // You need to implement a way to navigate to the registration page or component

  // Simulate user input
  userEvent.type(screen.getByLabelText(/registerUsername/i), 'jesttest');
  userEvent.type(screen.getByLabelText(/registerPassword/i), 'jesttest');
  userEvent.type(screen.getByLabelText(/registerEmail/i), 'jest@test.com');

  // Simulate form submission
  userEvent.click(screen.getByRole('button', { name: /register/i }));

  // Wait for the registration process to complete
  await waitFor(() => {
    // Assert that the registration was successful
    expect(screen.getByText(/Logged in as jesttest/i)).toBeInTheDocument();
  });
});

// Clean up mock after all tests are done
afterAll(() => {
  mockAxios.restore();
});

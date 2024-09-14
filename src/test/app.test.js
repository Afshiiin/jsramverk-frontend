import React from 'react';
import { render, waitFor } from '@testing-library/react';

import App from '../App.js'; // Adjust the import path as needed

test('Check if useEffect works correctly and update the title', async () => {
  render(<App />);
  
  await waitFor(() => {
    expect(document.title).toBe('My Editor');
  });
});
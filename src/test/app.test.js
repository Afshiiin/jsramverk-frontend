import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Editor from '../app.js'; // Adjust the import path as needed

test('Check if useEffect works correctly and update the title', async () => {
  render(<Editor />);
  
  await waitFor(() => {
    expect(document.title).toBe('My Editor');
  });
});
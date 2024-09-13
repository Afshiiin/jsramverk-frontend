import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import Editor from '../app.js'; // Adjust the import path as needed


test('Get title', () => {
  render(<Editor />);
  expect(document.title).toBe('My Editor');
  
});
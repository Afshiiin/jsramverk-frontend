import React from 'react';
import { render} from '@testing-library/react';

import Editor from '../App.js'; // Adjust the import path as needed


test('Get title', () => {
  render(<Editor />);
  expect(document.title).toBe('My Editor');
  
});
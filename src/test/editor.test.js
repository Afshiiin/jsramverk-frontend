import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Editor from '../components/body/editor/editor.js'; 

test('get an elemne content by id', () => {
  render(<Editor />);
  const editorElement = screen.getByTestId('todo-1');
  expect(editorElement).toBeInTheDocument();
  expect(editorElement).toHaveTextContent('Existing files');
  
});

test('find the button with the correct text', () => {
  const { getByText } = render(<Editor />);
  expect(getByText('Create New File')).toBeInTheDocument();
});

 test('find and click on a button', () => {
  const handleClick = jest.fn();
  const { getByText } = render(<Editor onClick={handleClick} />);
  
  fireEvent.click(getByText('Create New File'));
  
});


test('finds the input by id and types into it', () => {
  const { getById, getByText } = render(<Editor />);

  // Find the input field by id
  const input = document.getElementById('outlined-basic');
  expect(input).toBeInTheDocument();

  // Write text in the input
  fireEvent.change(input, { target: { value: 'My text for testing' } });

  // check if the value has been updated to our text
  expect(input.value).toBe('My text for testing');


});

 

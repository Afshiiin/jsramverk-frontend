import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Editor from '../components/body/editor/Editor'; // Adjust the import path as needed

test('Check the section where the list of existing files loads and verify the header of the div', async () => {
  render(<Editor />);
  
  const editorElement = await screen.findByTestId('ListOfFiles');
  expect(editorElement).toBeInTheDocument();
  expect(editorElement).toHaveTextContent('Existing files');
});


jest.mock('@ckeditor/ckeditor5-react', () => ({
  CKEditor: ({ onChange }) => (
    <textarea
      data-testid="mockedCKEditor"
      onChange={(e) => onChange({}, { getData: () => e.target.value })}
    />
  ),
}));

test('updates CKEditor value on change', () => {
  render(<Editor />);

  const editor = screen.getByTestId('mockedCKEditor');
  fireEvent.change(editor, { target: { value: 'My name is Afshin' } });

  expect(editor.value).toBe('My name is Afshin');
});



/* test('shows alert message when trying to create a file with an empty name', async () => {
  render(<Editor />);

  const input = screen.getByTestId('inputTitleDoc').querySelector('input');

  fireEvent.change(input, { target: { value: '' } });

  const createButton = screen.getByText(/Create New File/i);
  fireEvent.click(createButton);

  const alertMessage = await screen.findByText(/Give a name to the file!/i);
  expect(alertMessage).toBeInTheDocument();
}); */




 

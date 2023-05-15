// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

import Spinner from "./Spinner";
import React from 'react';
import { render, screen, waitfor } from '@testing-library/react';

test("renders the spinner",() => {
  render(Spinner);

  expect(Spinner).toBeInTheDocument;
})

test("renders the spinner when passed on", () => {
  render(<Spinner on={true}/>);
  expect(Spinner).toBeInTheDocument;
})

test("returns null when passed off", () => {
  render(<Spinner on={false}/>);
  expect(Spinner).not.toBeInTheDocument;
})

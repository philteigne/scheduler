import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, queryByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
  
    return waitForElement(() => getByText("Monday"))
      .then(() => fireEvent.click(getByText("Tuesday")))
      .then(() => expect(getByText("Leopold Silvers")).toBeInTheDocument())
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
      
    const { container, debug } = render(<Application />)

    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    // console.log(prettyDOM(container))

    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"))

    expect(queryByText(appointment, "Saving")).not.toBeInTheDocument();

    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"));

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />)

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment")[1]
    fireEvent.click(getByAltText(appointment, "Delete"))
    
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"))

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"))
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day")
      .find(day => queryByText(day, "Monday"))

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Check that Monday has 1 spot remaining.
    const day = getAllByTestId(container, "day")
      .find(day => getByText(day, "Monday"));
    
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    
    // 4. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment")[1]
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 5. Change the "Input" to "Lydia Miller-Jones".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click the "Save" button on the appointment.
    fireEvent.click(getByText(appointment, "Save"));
    
    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    
    // 8. Wait until the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    
    // 9. Check that Monday has 1 spot remaining.
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {

    axios.put.mockRejectedValueOnce();
  
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment")[0]
    fireEvent.click(getByAltText(appointment, "Add"));
    
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));
    
    await waitForElement(() => getByText(appointment, "Could not book appointment."))

    // 7. Check that the element with the text "Saving" is not in document.
    expect(queryByText(appointment, "Could not book appointment.")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    
    // 1. Render the Application.
    const { container, debug } = render(<Application />)

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment")[1]
    fireEvent.click(getByAltText(appointment, "Delete"))
    
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));
    await waitForElement(() => getByText(appointment, "Could not cancel appointment."))

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(queryByText(appointment, "Could not cancel appointment.")).toBeInTheDocument();
  });
})
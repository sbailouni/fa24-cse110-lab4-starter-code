import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AppProvider } from './context/AppContext';  
import { MyBudgetTracker } from "./views/MyBudgetTracker";

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// })
describe("Budget Tracker Required Tests", () => {
  test('create an expense, total and remaining should update', () => {
    render(<AppProvider>
            <MyBudgetTracker />
           </AppProvider>);

    const budget = 1000;
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '20' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
    
    const totalSpent = budget - 20;
    expect(screen.getByText(`Spent so far: $${20}`)).toBeInTheDocument();
    expect(screen.getByText(`Remaining: $${totalSpent}`)).toBeInTheDocument();
  })

  test('delete an expense, total and remaining should update', () => {
    render(<AppProvider>
      <MyBudgetTracker />
     </AppProvider>);

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '20' } });
    fireEvent.click(screen.getByText(/save/i));
    // ensure that the expense is in document
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /x/i })); 

    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    expect(screen.queryByText('$20')).not.toBeInTheDocument();

    expect(screen.getByText('Spent so far: $0')).toBeInTheDocument();
    expect(screen.getByText('Remaining: $1000')).toBeInTheDocument();
  })

  test('Budget equation holds true after various operations', () => {
    render(<AppProvider>
      <MyBudgetTracker />
     </AppProvider>);
    const budget = 1000;
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '20' } });
    fireEvent.click(screen.getByText(/save/i));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Transportation' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '30' } });
    fireEvent.click(screen.getByText(/save/i));

    const totalSpent = 20 + 30;
    const remainingBalance = budget - totalSpent;

    expect(screen.getByText(`Spent so far: $${totalSpent}`)).toBeInTheDocument();
    expect(screen.getByText(`Remaining: $${remainingBalance}`)).toBeInTheDocument();
    expect(screen.getByText(`Budget: ${budget}`)).toBeInTheDocument();

    const buttons = screen.getAllByRole("button", { name: /x/i });

    fireEvent.click(buttons[0]);

    const total = 30;
    const remaining = budget - total;

    expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
    expect(screen.queryByText('$20')).not.toBeInTheDocument();

    expect(screen.getByText(`Spent so far: $${total}`)).toBeInTheDocument();
    expect(screen.getByText(`Remaining: $${remaining}`)).toBeInTheDocument();
    expect(screen.getByText(`Budget: ${budget}`)).toBeInTheDocument();
  })
})
describe("Budget Tracker Edge Case Tests", () => {
  test('shows alert message when spending exceeds budget', () => {
    render(<AppProvider>
      <MyBudgetTracker />
     </AppProvider>);
    window.alert = jest.fn();

    const budget = 1000;
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Groceries' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '1010' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(window.alert).toHaveBeenCalledWith("You have exceeded your budget!");
  })
  test('remaining balance should be negative when exceeding budget', () => {
    render(<AppProvider>
      <MyBudgetTracker />
     </AppProvider>);

    const budget = 1000;
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Loan' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '1110' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText(`Remaining: $-110`)).toBeInTheDocument();
  })
  test('remaining should be the same when adding a 0 dollar expense', () => {
    render(<AppProvider>
      <MyBudgetTracker />
     </AppProvider>);

    const budget = 1000;
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Free Drink' } });
    fireEvent.change(screen.getByLabelText(/cost/i), { target: { value: '0' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(screen.getByText('Free Drink')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();

    const totalSpent = budget - 0;
    expect(screen.getByText(`Spent so far: $${0}`)).toBeInTheDocument();
    expect(screen.getByText(`Remaining: $${totalSpent}`)).toBeInTheDocument();
  })
})
;

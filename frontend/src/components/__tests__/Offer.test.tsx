import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Offer from "../Offer";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

vi.mock("../CountDown", () => ({
  default: () => <div data-testid="countdown">Countdown</div>,
}));

describe("Offer", () => {
  it("should render the offer heading", () => {
    render(<Offer />);
    expect(screen.getByText(/Delicious Burger & French Fry/)).toBeDefined();
  });

  it("should render the description text", () => {
    render(<Offer />);
    expect(
      screen.getByText(/Progressively simplify effective e-toilers/),
    ).toBeDefined();
  });

  it("should render the countdown component", () => {
    render(<Offer />);
    expect(screen.getByTestId("countdown")).toBeDefined();
  });

  it("should render Order Now button", () => {
    render(<Offer />);
    expect(screen.getByText("Order Now")).toBeDefined();
  });

  it("should render the offer product image", () => {
    render(<Offer />);
    const img = screen.getByAltText("");
    expect(img).toBeDefined();
  });
});

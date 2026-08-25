import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../page";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string; width?: number; height?: number; className?: string; fill?: boolean }) => {
    return <img src={props.src} alt={props.alt} width={props.width} height={props.height} className={props.className} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe("LoginPage", () => {
  it("should render Welcome heading and 3 options by default", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /welcome$/i })).toBeDefined();
    expect(screen.getByText("Sign in with Account")).toBeDefined();
    expect(screen.getByText("Sign in with Google")).toBeDefined();
    expect(screen.getByText("Sign in with Facebook")).toBeDefined();
  });

  it("should not show form fields on initial view", () => {
    render(<LoginPage />);
    expect(screen.queryByPlaceholderText("Email")).toBeNull();
    expect(screen.queryByPlaceholderText(/Password/)).toBeNull();
  });

  it("should render contact us link", () => {
    render(<LoginPage />);
    const link = screen.getByText("Contact us");
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/");
  });

  it("should render login background image", () => {
    render(<LoginPage />);
    const imgs = screen.getAllByRole("presentation", { name: "" });
    const bgImg = imgs.find((img) => img.getAttribute("src") === "/loginBg.png");
    expect(bgImg).toBeDefined();
  });

  it("should show LoginForm when clicking Sign in with Account", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Account"));
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeDefined();
    expect(screen.getByPlaceholderText("Email")).toBeDefined();
    expect(screen.getByPlaceholderText(/Password/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Login" })).toBeDefined();
  });

  it("should show RegisterForm when clicking Register from LoginForm", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Account"));
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByRole("heading", { name: /create account/i })).toBeDefined();
    expect(screen.getByPlaceholderText("Name")).toBeDefined();
    expect(screen.getByPlaceholderText("Phone (optional)")).toBeDefined();
    expect(screen.getByRole("button", { name: "Register" })).toBeDefined();
  });

  it("should switch back to LoginForm from RegisterForm", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Account"));
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByRole("heading", { name: /create account/i })).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /login$/i }));
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeDefined();
  });

  it("should go back to options from LoginForm", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Account"));
    expect(screen.queryByText("Sign in with Account")).toBeNull();
    fireEvent.click(screen.getByText("Back to options"));
    expect(screen.getByText("Sign in with Account")).toBeDefined();
    expect(screen.getByRole("heading", { name: /welcome$/i })).toBeDefined();
  });

  it("should go back to options from RegisterForm", () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Sign in with Account"));
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.queryByText("Sign in with Account")).toBeNull();
    fireEvent.click(screen.getByText("Back to options"));
    expect(screen.getByText("Sign in with Account")).toBeDefined();
  });
});

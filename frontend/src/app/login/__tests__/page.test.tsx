import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("should render the welcome heading", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /welcome/i })).toBeDefined();
  });

  it("should render Google sign-in button", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in with Google")).toBeDefined();
  });

  it("should render Facebook sign-in button", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in with Facebook")).toBeDefined();
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
});

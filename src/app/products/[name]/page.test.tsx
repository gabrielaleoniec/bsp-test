/// <reference types="@testing-library/jest-dom" />
import { useProductsStore } from "@/store/products-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Page from "./page";

const mockPush = jest.fn();
const mockUseParams = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: () => [null],
}));

const productFixture = {
  number: "b0006se5bq",
  name: "singing coach unlimited",
  description: "A singing coach product for learning.",
  images: [
    { url: "https://example.com/1.jpg", name: "Front" },
    { url: "https://example.com/2.jpg", name: "Back" },
  ],
};

function renderProductPage(name: string) {
  mockUseParams.mockReturnValue({ name });
  return render(<Page />);
}

beforeEach(() => {
  mockPush.mockClear();
  mockUseParams.mockReturnValue({ name: "" });
  useProductsStore.setState({ products: [], hasSyncedOnce: false });
});

describe("Product detail page ([name]/page.tsx)", () => {
  it("shows Loading when not synced and product not in store", () => {
    mockUseParams.mockReturnValue({ name: "any-product" });
    render(<Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /any-product/i }),
    ).not.toBeInTheDocument();
  });

  it("shows Product not found when synced but product missing", () => {
    useProductsStore.setState({ hasSyncedOnce: true, products: [] });
    renderProductPage("missing-product");
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("renders product name, number and description when product exists", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderProductPage("singing coach unlimited");

    expect(
      screen.getByRole("heading", { name: /singing coach unlimited/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Product number:")).toBeInTheDocument();
    expect(screen.getByText("b0006se5bq")).toBeInTheDocument();
    expect(
      screen.getByText("A singing coach product for learning."),
    ).toBeInTheDocument();
  });

  it("renders Edit button that navigates to edit page", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderProductPage("singing coach unlimited");

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);
    expect(mockPush).toHaveBeenCalledWith(
      "/products/singing%20coach%20unlimited/edit",
    );
  });

  it("finds product by decoded name (encoded slug in params)", () => {
    const productWithAmp = {
      ...productFixture,
      name: "Product & Co.",
      number: "n-amp",
      description: "Description",
      images: [],
    };
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productWithAmp],
    });
    // URL-encoded "Product & Co." as param
    renderProductPage("Product%20%26%20Co.");

    expect(
      screen.getByRole("heading", { name: /product & co\./i }),
    ).toBeInTheDocument();
    expect(screen.getByText("n-amp")).toBeInTheDocument();
  });

  it("renders images when product has images", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderProductPage("singing coach unlimited");

    expect(screen.getByAltText("Front")).toBeInTheDocument();
    expect(screen.getByAltText("Back")).toBeInTheDocument();
  });

  it("does not render image list when product has no images", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [{ ...productFixture, images: [] }],
    });
    renderProductPage("singing coach unlimited");

    expect(screen.queryByAltText("Front")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /singing coach unlimited/i }),
    ).toBeInTheDocument();
  });
});

/// <reference types="@testing-library/jest-dom" />
import { QueryProvider } from "@/components/providers/query-provider";
import { useProductsStore } from "@/store/products-store";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Page from "./page";

function renderWithProviders(ui: React.ReactElement) {
  return render(<QueryProvider>{ui}</QueryProvider>);
}

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockUseParams = jest.fn();
const mockFetch = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => mockUseParams(),
  useRouter: () => ({ push: mockPush, back: mockBack }),
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

function renderEditPage(name: string) {
  mockUseParams.mockReturnValue({ name });
  return renderWithProviders(<Page />);
}

beforeEach(() => {
  mockPush.mockClear();
  mockBack.mockClear();
  mockUseParams.mockReturnValue({ name: "" });
  mockFetch.mockReset();
  useProductsStore.setState({ products: [], hasSyncedOnce: false });
  global.fetch = mockFetch;
});

describe("Product edit page ([name]/edit/page.tsx)", () => {
  it("shows Loading when not synced and product not in store", () => {
    mockUseParams.mockReturnValue({ name: "any-product" });
    renderWithProviders(<Page />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows Product not found when synced but product missing", () => {
    useProductsStore.setState({ hasSyncedOnce: true, products: [] });
    renderEditPage("missing-product");
    expect(screen.getByText(/product not found/i)).toBeInTheDocument();
  });

  it("renders Edit product heading and form with product data", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    expect(
      screen.getByRole("heading", { name: /edit product/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("singing coach unlimited"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("b0006se5bq")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("A singing coach product for learning."),
    ).toBeInTheDocument();
  });

  it("Save button submits with updated data and redirects on success", async () => {
    const updatedProduct = {
      ...productFixture,
      name: "Updated Name",
      description: "Updated description",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProduct,
    });

    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    const nameInput = screen.getByDisplayValue("singing coach unlimited");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated Name");
    const descInput = screen.getByDisplayValue(
      "A singing coach product for learning.",
    );
    await userEvent.clear(descInput);
    await userEvent.type(descInput, "Updated description");

    await userEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/products/singing%20coach%20unlimited",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.name).toBe("Updated Name");
    expect(body.description).toBe("Updated description");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/products/Updated%20Name");
    });
  });

  it("Cancel button calls router.back", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockBack).toHaveBeenCalled();
  });

  it("Add image shows error when URL or name is empty", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [{ ...productFixture, images: [] }],
    });
    renderEditPage("singing coach unlimited");

    await userEvent.click(screen.getByRole("button", { name: /add image/i }));
    expect(screen.getByText(/url and name are required/i)).toBeInTheDocument();
  });

  it("Add image adds row when URL and name are valid", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [{ ...productFixture, images: [] }],
    });
    renderEditPage("singing coach unlimited");

    await userEvent.type(
      screen.getByPlaceholderText("https://…"),
      "https://example.com/new.jpg",
    );
    await userEvent.type(
      screen.getByPlaceholderText(/e\.g\. front view/i),
      "New image",
    );
    await userEvent.click(screen.getByRole("button", { name: /add image/i }));

    expect(
      screen.getByDisplayValue("https://example.com/new.jpg"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("New image")).toBeInTheDocument();
  });

  it("Remove image removes the image row", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await userEvent.click(removeButtons[0]);

    expect(
      screen.queryByDisplayValue("https://example.com/1.jpg"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByDisplayValue("https://example.com/2.jpg"),
    ).toBeInTheDocument();
  });

  it("editing image URL updates the row", async () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    const urlInputs = screen.getAllByDisplayValue(/example\.com/);
    await userEvent.clear(urlInputs[0]);
    await userEvent.type(urlInputs[0], "https://example.com/updated.jpg");

    expect(
      screen.getByDisplayValue("https://example.com/updated.jpg"),
    ).toBeInTheDocument();
  });

  it("shows submit error when mutation fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({ error: "Invalid body" }),
    });

    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [productFixture],
    });
    renderEditPage("singing coach unlimited");

    await userEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid body|bad request/i,
    );
  });
});

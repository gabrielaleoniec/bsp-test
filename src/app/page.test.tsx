/// <reference types="@testing-library/jest-dom" />
import { useProductsStore } from "@/store/products-store";
import { render, screen } from "@testing-library/react";

import Home from "./page";

function renderHome() {
  return render(<Home />);
}

beforeEach(() => {
  useProductsStore.setState({ products: [], hasSyncedOnce: false });
});

describe("Home (basic page)", () => {
  it("renders the Products heading", () => {
    useProductsStore.setState({ hasSyncedOnce: true });
    renderHome();
    expect(
      screen.getByRole("heading", { name: /products/i }),
    ).toBeInTheDocument();
  });

  it("shows Loading when not synced yet", () => {
    renderHome();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("shows product table when synced with products", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [
        {
          number: "b0006se5bq",
          name: "singing coach unlimited",
          description: "A singing coach product",
          images: [],
        },
      ],
    });
    renderHome();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /singing coach unlimited/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "b0006se5bq" }),
    ).toBeInTheDocument();
  });

  it("shows No products when synced and list is empty", () => {
    useProductsStore.setState({ hasSyncedOnce: true, products: [] });
    renderHome();
    expect(screen.getByText(/no products\./i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("product name links point to product detail route", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [
        {
          number: "b0006se5bq",
          name: "singing coach unlimited",
          description: "A singing coach product",
          images: [],
        },
      ],
    });
    renderHome();
    const nameLink = screen.getByRole("link", {
      name: /singing coach unlimited/i,
    });
    expect(nameLink).toHaveAttribute(
      "href",
      "/products/singing%20coach%20unlimited",
    );
  });

  it("product number link points to same product detail route", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [
        {
          number: "b0006se5bq",
          name: "singing coach unlimited",
          description: "A singing coach product",
          images: [],
        },
      ],
    });
    renderHome();
    const numberLink = screen.getByRole("link", { name: "b0006se5bq" });
    expect(numberLink).toHaveAttribute(
      "href",
      "/products/singing%20coach%20unlimited",
    );
  });

  it("renders multiple products in the table", () => {
    useProductsStore.setState({
      hasSyncedOnce: true,
      products: [
        {
          number: "n1",
          name: "Product One",
          description: "First",
          images: [],
        },
        {
          number: "n2",
          name: "Product Two",
          description: "Second",
          images: [],
        },
      ],
    });
    renderHome();
    expect(
      screen.getByRole("cell", { name: /product one/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "n1" })).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /product two/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "n2" })).toBeInTheDocument();
  });
});

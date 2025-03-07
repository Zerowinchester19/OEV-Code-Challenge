import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductList from "@/components/ProductList";
import { waitFor } from "@testing-library/react";

describe("ProductList - Basisfunktionen", () => {
  test("Öffnet das Dialog-Fenster beim Klicken auf 'Add new product'", () => {
    render(<ProductList />);

    // Button suchen und klicken
    const addButton = screen.getByText(/add new product/i);
    fireEvent.click(addButton);

    // Prüfen, ob das Dialogfenster angezeigt wird
    expect(screen.getByText(/Neues Produkt hinzufügen/i)).toBeInTheDocument();
  });

  test("Eingabe von Produktname wird gespeichert", () => {
    render(<ProductList />);

    fireEvent.click(screen.getByText(/add new product/i));

    const titleInput = screen.getByLabelText(/Produktname/i);
    fireEvent.change(titleInput, { target: { value: "Testprodukt" } });

    expect(titleInput).toHaveValue("Testprodukt");
  });

  test("Dialog-Fenster wird geschlossen", async () => {
    render(<ProductList />);

    fireEvent.click(screen.getByText(/add new product/i));

    const cancelButton = screen.getByText(/Abbrechen/i);
    fireEvent.click(cancelButton);

    // Warten, bis das Element aus dem DOM entfernt wird
    await waitFor(() =>
      expect(
        screen.queryByText(/Neues Produkt hinzufügen/i)
      ).not.toBeInTheDocument()
    );
  });
});

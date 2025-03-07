/* Author: Ercan Celik */
"use client";
import React from "react";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/products";
import { useCartStore } from "@/store/cartStore";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
  Container,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  isCustom?: boolean;
  description: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    thumbnail: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const favorites = useCartStore((state) => state.favorites);

  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = JSON.parse(
        localStorage.getItem("productCatalog") || "[]"
      );
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        const data = await fetchProducts();
        setProducts(data);
        localStorage.setItem("productCatalog", JSON.stringify(data));
      }
    };
    loadProducts();
  }, []);

  const updateLocalStorage = (updatedProducts: Product[]) => {
    localStorage.setItem("productCatalog", JSON.stringify(updatedProducts));
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({
          ...prev,
          thumbnail: reader.result as string,
        }));
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.title || newProduct.price <= 0 || !newProduct.thumbnail) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const newEntry: Product = {
      ...newProduct,
      id: products.length + 1000,
      isCustom: true,
    };

    const updatedProducts = [...products, newEntry];
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);

    setSnackbar({ open: true, message: "Produkt erfolgreich hinzugefügt!" });

    setOpen(false);
    setNewProduct({ title: "", price: 0, thumbnail: "", description: "" });
    setImagePreview(null);
  };

  const handleDeleteProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    updateLocalStorage(updatedProducts);

    setSnackbar({ open: true, message: "Produkt erfolgreich gelöscht!" });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Produkte
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          backgroundColor: "#F7F7FC",
          padding: "8px",
          borderRadius: "20px",
          marginBottom: "16px",
        }}
      >
        <TextField
          placeholder="Search..."
          variant="outlined"
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& .MuiInputBase-input": {
              padding: "10px 14px",
            },
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "#D8D8E5",
            color: "#3D3D4E",
            fontWeight: "bold",
            borderRadius: "20px",
            padding: "10px 20px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#C5C5D3",
            },
          }}
        >
          Add new product
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Produktname"
            fullWidth
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Preis ($)"
            type="number"
            fullWidth
            value={newProduct.price === 0 ? "" : newProduct.price}
            onChange={(e) => {
              const value = e.target.value.trim();
              const parsedValue = parseFloat(value);

              setNewProduct({
                ...newProduct,
                price: value === "" || isNaN(parsedValue) ? 0 : parsedValue,
              });
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px" }}
            data-testid="file-upload"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vorschau"
              style={{ width: "100%", marginTop: "10px", borderRadius: "8px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleAddProduct} color="primary">
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => {
          const isFavorite = favorites.some((fav) => fav.id === product.id);
          return (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => toggleFavorite(product)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: isFavorite ? "yellow" : "gray",
                  }}
                >
                  {isFavorite ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>

                <CardMedia
                  component="img"
                  height="140"
                  image={product.thumbnail}
                  alt={product.title}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography color="textSecondary">
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </Button>
                  {product.isCustom && (
                    <IconButton
                      onClick={() => handleDeleteProduct(product.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductList;

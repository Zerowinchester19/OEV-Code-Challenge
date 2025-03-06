"use client";

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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  isCustom?: boolean;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    thumbnail: "",
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
    setNewProduct({ title: "", price: 0, thumbnail: "" });
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

      <TextField
        label="Produkte suchen..."
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => setOpen(true)}
        sx={{ marginBottom: 2 }}
      >
        Neues Produkt hinzufügen
      </Button>

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
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: parseFloat(e.target.value),
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px" }}
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
                    Zur Einkaufsliste
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

      {/* Snackbar für Erfolgsmeldungen */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbar({ open: false, message: "" })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductList;

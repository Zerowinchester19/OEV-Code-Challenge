"use client";

import { useCartStore } from "@/store/cartStore";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import Link from "next/link";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });

  const handleRemove = (id: number) => {
    removeFromCart(id);
    setSnackbar({
      open: true,
      message: "Produkt aus der Einkaufsliste entfernt!",
    });
  };

  const handleClearCart = () => {
    clearCart();
    setSnackbar({ open: true, message: "Einkaufsliste geleert!" });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Deine Einkaufsliste
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          Deine Einkaufsliste ist leer.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cart.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card>
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
                  <IconButton
                    onClick={() => handleRemove(product.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleClearCart}
            sx={{ marginTop: 2 }}
          >
            Einkaufsliste leeren
          </Button>
        </>
      )}

      {/* Zurück zur Produktliste */}
      <Button
        variant="outlined"
        fullWidth
        sx={{ marginTop: 2 }}
        component={Link}
        href="/"
      >
        Zurück zu den Produkten
      </Button>

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

export default CartPage;

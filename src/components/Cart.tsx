/* Author: Ercan Celik */
"use client";

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
} from "@mui/material";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCartStore();

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Einkaufsliste
      </Typography>

      {cart.length === 0 ? (
        <Typography align="center" color="textSecondary">
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
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Entfernen
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={clearCart}
            sx={{ mt: 2 }}
          >
            Einkaufsliste leeren
          </Button>
        </>
      )}
    </Container>
  );
};

export default Cart;

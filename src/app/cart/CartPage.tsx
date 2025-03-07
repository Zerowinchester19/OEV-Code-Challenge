/* Author: Ercan Celik */
import Cart from "@/components/Cart";
import { Container, Typography } from "@mui/material";

const CartPage = () => {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Einkaufsliste
      </Typography>
      <Cart />
    </Container>
  );
};

export default CartPage;

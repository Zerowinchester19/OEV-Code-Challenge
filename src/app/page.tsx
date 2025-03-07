import ProductList from "@/components/ProductList";
import { Container, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Shopping List
      </Typography>
      <ProductList />
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Link href="/cart" passHref>
          <Button variant="contained" color="secondary">
            Zum Warenkorb
          </Button>
        </Link>
        <Link href="/favorites" passHref>
          <Button variant="outlined" color="primary">
            Favoriten anzeigen
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}

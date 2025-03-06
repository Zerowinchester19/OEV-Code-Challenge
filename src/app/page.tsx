import ProductList from "@/components/ProductList";
import { Container, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Shopping List
      </Typography>
      <ProductList />
      <Link href="/cart" passHref>
        <Button variant="contained" color="secondary" fullWidth sx={{ mt: 4 }}>
          Zur Einkaufsliste
        </Button>
      </Link>
    </Container>
  );
}

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
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const favorites = useCartStore((state) => state.favorites);

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Produkte
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => {
          const isFavorite = favorites.some((fav) => fav.id === product.id);
          return (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ position: "relative" }}>
                {/* Favoriten-Stern rechts oben */}
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
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ProductList;

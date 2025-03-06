"use client";

import { useCartStore } from "@/store/cartStore";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Favorites = () => {
  const { favorites, toggleFavorite } = useCartStore();

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Favoriten
      </Typography>

      {favorites.length === 0 ? (
        <Typography align="center" color="textSecondary">
          Du hast noch keine Favoriten markiert.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((product) => (
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
                  <IconButton
                    onClick={() => toggleFavorite(product)}
                    color="secondary"
                  >
                    <FavoriteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;

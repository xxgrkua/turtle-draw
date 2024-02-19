import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import React from "react";

import TopBar from "../TopBar";
import "./style.css";

interface GraphicCardProps {
  author: string;
  title: string;
  date: string;
  image: string;
  description: string;
}

const GraphicCard: React.FC<GraphicCardProps> = function ({
  author,
  title,
  date,
  image,
  description,
}) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ width: 300, height: 400 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: red[500] }}>{author}</Avatar>}
          title={title}
          subheader={date}
        />
        <CardMedia component="img" width={300} image={image} alt="img" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};

const Gallery: React.FC = function () {
  return (
    <Grid container>
      <Grid item xs={12}>
        <TopBar />
      </Grid>
      <Grid item xs={12} className="graphic-cards">
        <Container maxWidth="lg">
          <Grid container spacing={4} mt={2}>
            <GraphicCard
              author="Tanaka"
              title="Sierpinski triangle"
              date="2021/10/10"
              image="images/2222.png"
              description=""
            />
            <GraphicCard
              author="Takahashi"
              title="Koch curve"
              date="2021/10/10"
              image="images/3333.png"
              description=""
            />
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Gallery;

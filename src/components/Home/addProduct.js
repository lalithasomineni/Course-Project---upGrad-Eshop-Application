import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, TextField, Typography, Box, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Buttonui from "../../common/Buttonui";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../common/Navbar";

const AddProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [availableItems, setAvailableItems] = useState(0);
  const [change, setChange] = useState(false);
  const [options, setOptions] = useState([]);
  const token = window.sessionStorage.getItem("access-token");

  // Fetch categories on load
  useEffect(() => {
    const categories = JSON.parse(localStorage.getItem("categories"));
    const formattedCats = categories.map((cat) => ({
      label: cat.toUpperCase(),
      value: cat,
    }));
    setOptions(formattedCats);
  }, []);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    setChange(true);
  };

  const handleCategoryChange = (selectedOption) => {
    setCategory(selectedOption.value);
    setChange(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price,
          description: productDescription,
          manufacturer,
          availableItems,
          imageUrl: imageURL,
        }),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        toast.error("Failed to add product.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar>
        <ShoppingCartIcon style={{ color: "white" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{ paddingLeft: "1%" }}>
          upGrad E-shop
        </Typography>
        <Buttonui type="button" onClick={() => navigate("/admin")}>
          Home
        </Buttonui>
        <Buttonui type="button" onClick={() => navigate("/addproducts")}>
          Add Products
        </Buttonui>
        <Buttonui type="button" logout="true" onClick={() => navigate("/logout")}>
          LogOut
        </Buttonui>
      </Navbar>

      <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={handleChange(setName)}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Manufacturer */}
              <Grid item xs={12}>
                <TextField
                  label="Manufacturer"
                  variant="outlined"
                  fullWidth
                  required
                  value={manufacturer}
                  onChange={handleChange(setManufacturer)}
                />
              </Grid>

              {/* Available Items */}
              <Grid item xs={12}>
                <TextField
                  label="Available Items"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={availableItems}
                  onChange={handleChange(setAvailableItems)}
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  required
                  type="number"
                  value={price}
                  onChange={handleChange(setPrice)}
                />
              </Grid>

              {/* Image URL */}
              <Grid item xs={12}>
                <TextField
                  label="Image URL"
                  variant="outlined"
                  fullWidth
                  required
                  value={imageURL}
                  onChange={handleChange(setImageURL)}
                />
              </Grid>

              {/* Product Description */}
              <Grid item xs={12}>
                <TextField
                  label="Product Description"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={productDescription}
                  onChange={handleChange(setProductDescription)}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  disabled={!change || !name || !manufacturer || !price || !availableItems || !productDescription || !imageURL || !category}
                >
                  ADD PRODUCT
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default AddProduct;

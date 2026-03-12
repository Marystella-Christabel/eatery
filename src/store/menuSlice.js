import { createSlice } from '@reduxjs/toolkit';

const initialMenuItems = [
  { id: 1, title: "Classic Party Jollof", description: "Rich, smoky Jollof rice served with fried plantains and spicy grilled chicken.", price: 5500, imageUrl: "/images/jollof_rice.png", category: "Rice" },
  { id: 2, title: "Pounded Yam & Egusi", description: "Smooth pounded yam paired with rich melon soup and assorted meat.", price: 6000, imageUrl: "/images/pounded_yam_egusi.png", category: "Swallow" },
  { id: 3, title: "Spicy Beef Suya", description: "Premium beef cuts marinated in traditional yaji spice and fire-grilled.", price: 3500, imageUrl: "/images/beef_suya.png", category: "Grill" },
  { id: 4, title: "Efo Riro & Fufu", description: "Rich spinach stew cooked with locust beans, dried fish, and assorted meats.", price: 5000, imageUrl: "", category: "Swallow" },
  { id: 5, title: "Moi Moi", description: "Steamed savory bean pudding with egg and fish.", price: 1500, imageUrl: "", category: "Sides" },
  { id: 6, title: "Asun (Spicy Goat Meat)", description: "Peppered roasted goat meat with onions and bell peppers.", price: 4500, imageUrl: "", category: "Grill" },
  { id: 7, title: "Fried Rice & Chicken", description: "Colorful vegetable fried rice with seasoned fried chicken.", price: 5000, imageUrl: "", category: "Rice" },
  { id: 8, title: "Pepper Soup (Catfish)", description: "Hot and spicy catfish pepper soup with utazi leaves.", price: 4000, imageUrl: "", category: "Soups" },
  { id: 9, title: "Ofada Rice & Sauce", description: "Local unpolished rice served with spicy green pepper sauce.", price: 4500, imageUrl: "", category: "Rice" },
  { id: 10, title: "Nkwobi", description: "Spicy cow foot delicacy cooked with palm oil and utazi.", price: 5500, imageUrl: "", category: "Grill" },
  { id: 11, title: "Banga Soup & Starch", description: "Rich palm fruit soup served with soft starch.", price: 6500, imageUrl: "", category: "Swallow" },
  { id: 12, title: "Akara & Pap", description: "Crispy deep-fried bean cakes served with warm corn pap.", price: 1200, imageUrl: "", category: "Sides" },
];

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: initialMenuItems,
    categories: ["All", "Rice", "Swallow", "Grill", "Soups", "Sides"],
    activeCategory: "All",
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setActiveCategory } = menuSlice.actions;
export default menuSlice.reducer;

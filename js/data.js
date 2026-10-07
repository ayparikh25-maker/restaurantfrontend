// ===== Tables from your ER diagram =====

// RESTAURANT  (Address is composite: house_no, street, area, city, pincode)
const restaurants = [
  { restaurant_id: 1, restaurant_name: "Pizza House",  phone_no: "9840011111", house_no: "12", street: "2nd Avenue",    area: "Anna Nagar", city: "Chennai", pincode: "600040" },
  { restaurant_id: 2, restaurant_name: "Burger Point", phone_no: "9840022222", house_no: "45", street: "Usman Road",    area: "T. Nagar",   city: "Chennai", pincode: "600017" },
  { restaurant_id: 3, restaurant_name: "Spice Garden", phone_no: "9840033333", house_no: "8",  street: "LB Road",       area: "Adyar",      city: "Chennai", pincode: "600020" },
  { restaurant_id: 4, restaurant_name: "Sweet Tooth",  phone_no: "9840044444", house_no: "21", street: "Bypass Road",   area: "Velachery",  city: "Chennai", pincode: "600042" },
  { restaurant_id: 5, restaurant_name: "Green Bowl",   phone_no: "9840055555", house_no: "3",  street: "Luz Church Rd", area: "Mylapore",   city: "Chennai", pincode: "600004" },
  { restaurant_id: 6, restaurant_name: "Wok Express",  phone_no: "9840066666", house_no: "17", street: "Mount Road",    area: "Guindy",     city: "Chennai", pincode: "600032" }
];

// MENU-CATEGORY  (RESTAURANT 1 --- M MENU-CATEGORY)
const menuCategories = [
  { category_id: 11, restaurant_id: 1, category_name: "Pizzas" },
  { category_id: 12, restaurant_id: 1, category_name: "Sides" },
  { category_id: 21, restaurant_id: 2, category_name: "Burgers" },
  { category_id: 22, restaurant_id: 2, category_name: "Sides" },
  { category_id: 31, restaurant_id: 3, category_name: "Starters" },
  { category_id: 32, restaurant_id: 3, category_name: "Mains" },
  { category_id: 41, restaurant_id: 4, category_name: "Cakes" },
  { category_id: 42, restaurant_id: 4, category_name: "Frozen" },
  { category_id: 51, restaurant_id: 5, category_name: "Bowls" },
  { category_id: 52, restaurant_id: 5, category_name: "Drinks" },
  { category_id: 61, restaurant_id: 6, category_name: "Noodles" },
  { category_id: 62, restaurant_id: 6, category_name: "Rice" }
];

// MENU-ITEM  (MENU-CATEGORY 1 --- M MENU-ITEM)
const menuItems = [
  { item_id: 101, category_id: 11, item_name: "Margherita",        price: 199, availability_status: "Available",   description: "Classic cheese and tomato" },
  { item_id: 102, category_id: 11, item_name: "Farmhouse",         price: 299, availability_status: "Available",   description: "Capsicum, onion, mushroom, corn" },
  { item_id: 103, category_id: 11, item_name: "Pepperoni",         price: 349, availability_status: "Unavailable", description: "Spicy pepperoni and mozzarella" },
  { item_id: 104, category_id: 12, item_name: "Garlic Bread",      price: 129, availability_status: "Available",   description: "Toasted with garlic butter" },
  { item_id: 105, category_id: 12, item_name: "Cola",              price: 49,  availability_status: "Available",   description: "300 ml chilled" },

  { item_id: 201, category_id: 21, item_name: "Classic Veg Burger", price: 129, availability_status: "Available",  description: "Crispy veg patty, lettuce, mayo" },
  { item_id: 202, category_id: 21, item_name: "Chicken Burger",     price: 179, availability_status: "Available",  description: "Grilled chicken with cheese" },
  { item_id: 203, category_id: 22, item_name: "French Fries",       price: 89,  availability_status: "Available",  description: "Salted and crispy" },
  { item_id: 204, category_id: 22, item_name: "Milkshake",          price: 119, availability_status: "Available",  description: "Chocolate or vanilla" },

  { item_id: 301, category_id: 31, item_name: "Veg Spring Roll",    price: 119, availability_status: "Available",  description: "Crispy rolls with sweet chilli dip" },
  { item_id: 302, category_id: 31, item_name: "Chilli Paneer",      price: 189, availability_status: "Available",  description: "Paneer tossed in spicy sauce" },
  { item_id: 303, category_id: 32, item_name: "Hakka Noodles",      price: 169, availability_status: "Available",  description: "Wok-tossed veg noodles" },
  { item_id: 304, category_id: 32, item_name: "Fried Rice",         price: 159, availability_status: "Available",  description: "Veg fried rice" },

  { item_id: 401, category_id: 41, item_name: "Chocolate Truffle",  price: 149, availability_status: "Available",  description: "Rich chocolate cake slice" },
  { item_id: 402, category_id: 41, item_name: "Red Velvet",         price: 169, availability_status: "Available",  description: "With cream cheese frosting" },
  { item_id: 403, category_id: 42, item_name: "Ice Cream Sundae",   price: 129, availability_status: "Unavailable", description: "Three scoops with toppings" },

  { item_id: 501, category_id: 51, item_name: "Quinoa Salad",       price: 219, availability_status: "Available",  description: "Quinoa, veggies, lemon dressing" },
  { item_id: 502, category_id: 51, item_name: "Millet Bowl",        price: 199, availability_status: "Available",  description: "Millet with grilled vegetables" },
  { item_id: 503, category_id: 52, item_name: "Cold Pressed Juice", price: 99,  availability_status: "Available",  description: "Fresh seasonal fruit" },

  { item_id: 601, category_id: 61, item_name: "Schezwan Noodles",   price: 169, availability_status: "Available",  description: "Spicy schezwan sauce" },
  { item_id: 602, category_id: 61, item_name: "Singapore Noodles",  price: 189, availability_status: "Available",  description: "Thin rice noodles with curry flavour" },
  { item_id: 603, category_id: 62, item_name: "Egg Fried Rice",     price: 159, availability_status: "Available",  description: "Wok-fried rice with egg" }
];

// DELIVERY-AGENT
const deliveryAgents = [
  { agent_id: 1, agent_name: "Karthik R.", phone_no: "9840012345", vehicle_no: "TN 09 AB 1234" },
  { agent_id: 2, agent_name: "Divya S.",   phone_no: "9841067890", vehicle_no: "TN 10 CD 5678" },
  { agent_id: 3, agent_name: "Arjun M.",   phone_no: "9842024680", vehicle_no: "TN 07 EF 9012" }
];

// Values used by FOOD-ORDER.order_status (the demo moves through them in order)
const orderStatuses = ["Placed", "Preparing", "Out for delivery", "Delivered"];

// ----- Display only (NOT part of the ER diagram): emojis used instead of photos -----
const restaurantIcons = { 1: "🍕", 2: "🍔", 3: "🍜", 4: "🍰", 5: "🥗", 6: "🥡" };
const categoryIcons = {
  Pizzas: "🍕", Sides: "🍟", Burgers: "🍔", Starters: "🥟", Mains: "🍛", Cakes: "🍰",
  Frozen: "🍨", Bowls: "🥗", Drinks: "🥤", Noodles: "🍜", Rice: "🍚"
};

const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
app.use(cors());
const port = 3000;

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'select * from restaurants';
  const resp = await db.all(query, []);
  return resp;
}

async function getRestaurantById(id) {
  let query = 'select * from restaurants where id=?';
  const resp = await db.all(query, [id]);
  return resp;
}

async function getRestaurantByCuisine(cuisineName) {
  let query = 'select * from restaurants where cuisine=?';
  const resp = await db.all(query, [cuisineName]);
  return resp;
}

async function getRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'select * from restaurants where isVeg=? and hasOutdoorSeating=? and isLuxury=?';
  const resp = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return resp;
}

async function getRestaurantBySortRating() {
  let query = 'select * from restaurants order by rating desc';
  const resp = await db.all(query, []);
  return resp;
}

async function getAllDishes() {
  let query = 'select * from dishes';
  const resp = await db.all(query, []);
  return resp;
}

async function getDishById(id) {
  let query = 'select * from dishes where id=?';
  const resp = await db.all(query, [id]);
  return resp;
}

async function getDishByFilter(isVeg) {
  let query = 'select * from dishes where isVeg=?';
  const resp = await db.all(query, [isVeg]);
  return resp;
}

async function getDishesBySortPrice() {
  let query = 'select * from dishes order by price asc';
  const resp = await db.all(query, []);
  return resp;
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let response = await getDishesBySortPrice();
    if (response.length == 0) {
      res.status(400).json({ message: `No restaurant found` });
    }
    res.status(200).json({ dishes: response });
  } catch (err) {
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/dishes/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let response = await getDishByFilter(isVeg);
    if (response.length == 0) {
      res.status(400).json({ message: `No restaurant found` });
    }
    res.status(200).json({ dishes: response });
  } catch (err) {
    console.log(err, '-=-=-=');
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/dishes/details/:id', async (req, res) => {
  try {
    let dishId = req.params.id;
    let response = await getDishById(dishId);
    if (response.length == 0) {
      res.status(400).json({ message: `No dishes found with id ${restId}` });
    }
    res.status(200).json({ dish: response[0] });
  } catch (err) {
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/dishes', async (req, res) => {
  try {
    let response = await getAllDishes();
    if (response.length == 0) {
      res.status(400).json({ message: `No dishes found` });
    }
    res.status(200).json({ dishes: response });
  } catch (err) {
    console.log(err, '-=-=-=');
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let response = await getRestaurantBySortRating();
    if (response.length == 0) {
      res.status(400).json({ message: `No restaurant found` });
    }
    res.status(200).json({ restaurants: response });
  } catch (err) {
    console.log(err, '-=-=-=');
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/restaurants/filter', async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let response = await getRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (response.length == 0) {
      res.status(400).json({ message: `No restaurant found` });
    }
    res.status(200).json({ restaurants: response });
  } catch (err) {
    console.log(err, '-=-=-=');
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/restaurants', async (req, res) => {
  try {
    let response = await fetchAllRestaurants();
    if (response.length == 0) {
      res.status(400).json({ message: 'No restaurants found' });
    }
    res.status(200).json({ restaurants: response });
  } catch (error) {
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/restaurants/cuisine/:cuisineName', async (req, res) => {
  try {
    let cuisineName = req.params.cuisineName;
    let response = await getRestaurantByCuisine(cuisineName);
    if (response.length == 0) {
      res
        .status(400)
        .json({ message: `No restaurant found with cuisine ${cuisineName}` });
    }
    res.status(200).json({ restaurants: response[0] });
  } catch (err) {
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    let restId = req.params.id;
    let response = await getRestaurantById(restId);
    if (response.length == 0) {
      res
        .status(400)
        .json({ message: `No restaurant found with id ${restId}` });
    }
    res.status(200).json({ restaurant: response[0] });
  } catch (err) {
    res.status(500).json({ message: 'Some error occured' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

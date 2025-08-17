const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database("yumfit.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  // Create ingredients table with nutrition facts
  db.run(`CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    unit TEXT,
    serving_size REAL DEFAULT 100,
    serving_unit TEXT DEFAULT 'g',
    calories REAL DEFAULT 0,
    protein REAL DEFAULT 0,
    carbohydrates REAL DEFAULT 0,
    fiber REAL DEFAULT 0,
    sugar REAL DEFAULT 0,
    fat REAL DEFAULT 0,
    saturated_fat REAL DEFAULT 0,
    sodium REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create recipes table
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    course_type TEXT,
    prep_time INTEGER,
    cook_time INTEGER,
    servings INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create junction table for recipe-ingredient relationships
  db.run(`CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER,
    ingredient_id INTEGER,
    quantity REAL,
    unit TEXT,
    FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
  )`);
}

// ============ INGREDIENTS ENDPOINTS ============

// GET all ingredients
app.get("/api/ingredients", (req, res) => {
  const query = "SELECT * FROM ingredients ORDER BY name";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ ingredients: rows });
  });
});

// GET ingredient by ID
app.get("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM ingredients WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Ingredient not found" });
      return;
    }
    res.json({ ingredient: row });
  });
});

// POST new ingredient
app.post("/api/ingredients", (req, res) => {
  const {
    name,
    category,
    unit,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbohydrates,
    fiber,
    sugar,
    fat,
    saturated_fat,
    sodium,
  } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const query = `INSERT INTO ingredients (
    name, category, unit, serving_size, serving_unit,
    calories, protein, carbohydrates, fiber, sugar, fat,
    saturated_fat, sodium
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    name,
    category,
    unit,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbohydrates,
    fiber,
    sugar,
    fat,
    saturated_fat,
    sodium,
  ];

  db.run(query, values, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Ingredient name already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    res.status(201).json({
      message: "Ingredient created successfully",
      ingredient: {
        id: this.lastID,
        name,
        category,
        unit,
        serving_size,
        serving_unit,
      },
    });
  });
});

// PUT update ingredient
app.put("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    unit,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbohydrates,
    fiber,
    sugar,
    fat,
    saturated_fat,
    sodium,
  } = req.body;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const query = `UPDATE ingredients 
                 SET name = ?, category = ?, unit = ?, serving_size = ?, serving_unit = ?,
                     calories = ?, protein = ?, carbohydrates = ?, fiber = ?, sugar = ?, 
                     fat = ?, saturated_fat = ?, sodium = ?,
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;

  const values = [
    name,
    category,
    unit,
    serving_size,
    serving_unit,
    calories,
    protein,
    carbohydrates,
    fiber,
    sugar,
    fat,
    saturated_fat,
    sodium,
    id,
  ];

  db.run(query, values, function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Ingredient name already exists" });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Ingredient not found" });
      return;
    }
    res.json({ message: "Ingredient updated successfully" });
  });
});

// DELETE ingredient
app.delete("/api/ingredients/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM ingredients WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Ingredient not found" });
      return;
    }
    res.json({ message: "Ingredient deleted successfully" });
  });
});

// ============ RECIPES ENDPOINTS ============

// GET all recipes
app.get("/api/recipes", (req, res) => {
  const query = "SELECT * FROM recipes ORDER BY created_at DESC";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ recipes: rows });
  });
});

// GET recipe by ID with ingredients
app.get("/api/recipes/:id", (req, res) => {
  const { id } = req.params;

  // First get the recipe
  db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, recipe) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    // Then get the ingredients for this recipe with nutrition info
    const ingredientsQuery = `
      SELECT i.*, ri.quantity, ri.unit as recipe_unit
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id = ?
    `;

    db.all(ingredientsQuery, [id], (err, ingredients) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        recipe: {
          ...recipe,
          ingredients: ingredients,
        },
      });
    });
  });
});

// POST new recipe
app.post("/api/recipes", (req, res) => {
  const {
    title,
    description,
    instructions,
    course_type,
    prep_time,
    cook_time,
    servings,
    ingredients,
  } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const query = `INSERT INTO recipes (title, description, instructions, course_type, prep_time, cook_time, servings) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    query,
    [
      title,
      description,
      instructions,
      course_type,
      prep_time,
      cook_time,
      servings,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const recipeId = this.lastID;

      // If ingredients are provided, add them to the recipe
      if (ingredients && ingredients.length > 0) {
        addIngredientsToRecipe(recipeId, ingredients, (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(201).json({
            message: "Recipe created successfully",
            recipe: {
              id: recipeId,
              title,
              description,
              instructions,
              course_type,
              prep_time,
              cook_time,
              servings,
            },
          });
        });
      } else {
        res.status(201).json({
          message: "Recipe created successfully",
          recipe: {
            id: recipeId,
            title,
            description,
            instructions,
            course_type,
            prep_time,
            cook_time,
            servings,
          },
        });
      }
    }
  );
});

// PUT update recipe
app.put("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    instructions,
    course_type,
    prep_time,
    cook_time,
    servings,
    ingredients,
  } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const query = `UPDATE recipes 
                 SET title = ?, description = ?, instructions = ?, course_type = ?, prep_time = ?, 
                     cook_time = ?, servings = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;

  db.run(
    query,
    [
      title,
      description,
      instructions,
      course_type,
      prep_time,
      cook_time,
      servings,
      id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }

      // If ingredients are provided, update them
      if (ingredients && ingredients.length > 0) {
        // First, remove existing recipe-ingredient relationships
        db.run(
          "DELETE FROM recipe_ingredients WHERE recipe_id = ?",
          [id],
          (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            // Then add the new ingredients
            addIngredientsToRecipe(id, ingredients, (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              res.json({ message: "Recipe updated successfully" });
            });
          }
        );
      } else {
        res.json({ message: "Recipe updated successfully" });
      }
    }
  );
});

// DELETE recipe
app.delete("/api/recipes/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM recipes WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }
    res.json({ message: "Recipe deleted successfully" });
  });
});

// ============ HELPER FUNCTIONS ============

function addIngredientsToRecipe(recipeId, ingredients, callback) {
  const stmt = db.prepare(
    "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)"
  );

  let completed = 0;
  let hasError = false;

  ingredients.forEach((ingredient) => {
    stmt.run(
      [
        recipeId,
        ingredient.ingredient_id,
        ingredient.quantity,
        ingredient.unit,
      ],
      (err) => {
        if (err && !hasError) {
          hasError = true;
          callback(err);
          return;
        }

        completed++;
        if (completed === ingredients.length && !hasError) {
          stmt.finalize();
          callback(null);
        }
      }
    );
  });

  if (ingredients.length === 0) {
    callback(null);
  }
}

// ============ SERVER START ============

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed");
    }
    process.exit(0);
  });
});

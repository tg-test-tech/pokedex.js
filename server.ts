import express, { Request, Response } from "express";
import type { Express } from "express";
import cors from "cors";
import Pokedex from "./src/index";
import { typeMap } from "./src/type";
import { abilityMap } from "./src/ability";
import { eggGroupMap } from "./src/eggGroup";
import * as fs from "fs";
import * as path from "path";

const app: Express = express();
const port = process.env.PORT || 3000;

// Initialize Pokedex instances for both languages
const pokedexJa = new Pokedex("ja");
const pokedexEn = new Pokedex("en");

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to get the right pokedex instance based on language
function getPokedex(lang: string | undefined): Pokedex {
  if (lang === "en") return pokedexEn;
  return pokedexJa;
}

// Generate list of generations
 const resourcePath = path.join(__dirname, "./src/resources", "pokemon");
 const _generationSet = new Set<number>();

 fs.readdirSync(resourcePath).forEach((file) => {
   // gen1.json, gen2.json, etc..
   const m1 = file.match(/^gen(\d+)\.json$/);
   if (m1) {
     _generationSet.add(Number(m1[1]));
     return;
   }
 });
 const generations = Array.from(_generationSet).sort((a, b) => a - b);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    apiName: "Pokemon API",
    version: "1.0.0",
    description:
      "A simple Pokémon data API with support for Japanese and English.",
    endpoints: [
      {
        name: "List all Pokémon",
        method: "GET",
        path: "/api/pokemon",
        description:
          "Get a list of all Pokémon (optionally filtered and sorted).",
        queryParameters: {
          lang: {
            description: 'Response language ("ja" or "en").',
            default: "ja",
          },
          name: {
            description: "Full name (case-insensitive).",
            example: "Pikachu",
          },
          type: {
            description: "Primary or secondary type.",
            example: "Electric",
          },
          generation: {
            description: "Generation number.",
            example: "1",
          },
          eggGroup: {
            description: "Egg Group name (case-insensitive).",
            example: "Mineral",
          },
          canMegaEvolve: {
            description: "Only those that can Mega Evolve (true/false).",
            example: "true",
          },
          inGalarPokedex: {
            description: "Only those in the Galar regional dex (true/false).",
            example: "false",
          },
          baseStatTotal: {
            description: "Filter by total of base stats (requires operator).",
            example: "600",
          },
          operator: {
            description:
              "Comparison operator for baseStatTotal (>, >=, <, <=, =). Required with baseStatTotal",
            example: ">=",
          },
          sortBy: {
            description: 'Sort key: "Lexicographical" or "NationalNumber".',
            example: "NationalNumber",
          },
          limit: {
            description: "Number of items per page.",
            default: "100",
          },
          offset: {
            description: "Offset for pagination.",
            default: "0",
          },
        },
      },
      {
        name: "Get Pokémon by ID",
        method: "GET",
        path: "/api/pokemon/:id",
        description: "Fetch a single Pokémon by its ID.",
        pathParameters: {
          id: "Numeric ID of the Pokémon without trailing or leading zeros.",
        },
        queryParameters: {
          lang: {
            description: 'Response language ("ja" or "en").',
            default: "ja",
          },
        },
      },
      {
        name: "List all Types",
        method: "GET",
        path: "/api/types",
        description: "Retrieve all Pokémon types.",
        queryParameters: {
          lang: {
            description: 'Response language ("ja" or "en").',
            default: "ja",
          },
        },
      },
      {
        name: "List all Abilities",
        method: "GET",
        path: "/api/abilities",
        description: "Retrieve all Pokémon abilities.",
        queryParameters: {
          lang: {
            description: 'Response language ("ja" or "en").',
            default: "ja",
          },
        },
      },
      {
        name: "List all Egg Groups",
        method: "GET",
        path: "/api/egg-groups",
        description: "Retrieve all Pokémon egg groups.",
        queryParameters: {
          lang: {
            description: 'Response language ("ja" or "en").',
            default: "ja",
          },
        },
      },
      {
        name: "List all Generations",
        method: "GET",
        path: "/api/generations",
        description: "Retrieve all available generation numbers.",
      },
    ],
  });
});

// Get (and optionally filter/sort) Pokémon
app.get("/api/pokemon", (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as "ja" | "en") || "ja";
    const pokedexBase = getPokedex(lang);

    // Helper to Title-Case inputs
    const titleCase = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    // Chain filters
    let pokedex = pokedexBase;
    if (req.query.name) {
      pokedex = pokedex.name(titleCase(req.query.name as string));
    }
    if (req.query.type) {
      pokedex = pokedex.type(titleCase(req.query.type as string));
    }
    if (req.query.generation) {
      pokedex = pokedex.generation(req.query.generation as string);
    }
    if (req.query.eggGroup) {
      pokedex = pokedex.eggGroup(titleCase(req.query.eggGroup as string));
    }
    if (req.query.canMegaEvolve === "true") {
      pokedex = pokedex.canMegaEvolve();
    }
    if (req.query.inGalarPokedex === "true") {
      pokedex = pokedex.inGalarPokedex();
    }
    // If user passed baseStatTotal but forgot operator
    if (req.query.baseStatTotal && !req.query.operator) {
      return res.status(400).json({
        error:
          "Missing required query parameter 'operator' when filtering by baseStatTotal",
      });
    }
    if (req.query.baseStatTotal && req.query.operator) {
      const op = req.query.operator as ">" | ">=" | "<" | "<=" | "=";
      const val = req.query.baseStatTotal as string;
      pokedex = pokedex.baseStatTotal(op, val);
    }
    if (req.query.sortBy) {
      const key = req.query.sortBy as "Lexicographical" | "NationalNumber";
      pokedex = pokedex.sort(key);
    }

    // Pagination
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 100);
    const offset = Math.max(0, parseInt(req.query.offset as string, 10) || 0);

    const allMatches = pokedex.getPokemon();
    const paged = allMatches.slice(offset, offset + limit);

    res.json({
      total: allMatches.length,
      count: paged.length,
      limit,
      offset,
      data: paged,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch Pokémon data" });
  }
});

// Get Pokemon by ID
app.get("/api/pokemon/:id", (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as "ja" | "en") || "ja";
    const id = req.params.id;
    const pokedex = getPokedex(lang);
    const pokemon = pokedex.id(id).getPokemon();

    if (pokemon.length === 0) {
      return res.status(404).json({ error: "Pokemon not found" });
    }

    res.json(pokemon[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pokemon data" });
  }
});

// Get all types
app.get("/api/types", (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as "ja" | "en") || "ja";
    // map to the requested language only
    const types = Array.from(typeMap.entries()).map(([japanese, english]) =>
      lang === "en" ? english : japanese
    );
    res.json({
      count: types.length,
      data: types,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch type data" });
  }
});

// Get all abilities
app.get("/api/abilities", (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as "ja" | "en") || "ja";
    const abilities = Array.from(abilityMap.entries()).map(
      ([japanese, english]) => (lang === "en" ? english : japanese)
    );
    res.json({
      count: abilities.length,
      data: abilities,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ability data" });
  }
});

// Get all egg groups
app.get("/api/egg-groups", (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as "ja" | "en") || "ja";
    const eggGroups = Array.from(eggGroupMap.entries()).map(
      ([japanese, english]) => (lang === "en" ? english : japanese)
    );
    res.json({
      count: eggGroups.length,
      data: eggGroups,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch egg group data" });
  }
});

// Get all possible generations
app.get("/api/generations", (req: Request, res: Response) => {
  try {
    res.json({
      count: generations.length,
      data: generations,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch generation data" });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Pokemon API server running on port ${port}`);
  console.log(`Access API at http://localhost:${port}`);
});

export default app;

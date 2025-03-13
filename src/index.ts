import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv, { config } from "dotenv";
import { findByDroneId } from "./utils/findDroneConfigsById";
import { copyFileSync } from "fs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Server 1: Drone Config Server
const DRONE_CONFIG_SERVER = process.env.DRONE_CONFIG_SERVER;
// Server 2: Drone Log Server
const DRONE_LOG_SERVER = process.env.DRONE_LOG_SERVER;

// GET /configs/:droneId
app.get("/configs/:droneId", async (req: Request, res: Response) => {
  try {
    const { droneId } = req.params;
    const response = await axios.get(`${DRONE_CONFIG_SERVER}`);
    let data = response.data.data;
    data = findByDroneId(data, droneId);    

    if (data.error === "Drone config not found") {
      res.status(404).json({ error: "Drone config not found" });
    }
    else if (data) {
      const droneConfig = {
        drone_id: data.drone_id,
        drone_name: data.drone_name,
        light: data.light,
        country: data.country,
        weight: data.weight,
      };
      res.json(droneConfig);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drone config" });
  }
});

// GET /status/:droneId
app.get("/status/:droneId", async (req: Request, res: Response) => {
  try {
    const { droneId } = req.params;
    const response = await axios.get(`${DRONE_CONFIG_SERVER}`);
    let data = response.data.data;
    data = findByDroneId(data, droneId); 
    
    if (data.error === "Drone config not found") {
        res.status(404).json({ error: "Drone status not found" });
      }
      else if (data) {
        const status = {
            condition: data.condition,
          };
        res.json(status);
      }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drone status" });
  }
});

// GET /logs/:droneId
app.get("/logs/:droneId", async (req: Request, res: Response) => {
  try {
    const { droneId } = req.params;
    const response = await axios.get(`${DRONE_LOG_SERVER}`);
    const logs = response.data.items.map((log: any) => ({
      drone_id: log.drone_id,
      drone_name: log.drone_name,
      created: log.created,
      country: log.country,
      census: log.census,
    }));
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drone logs" });
  }
});

// POST /logs
app.post("/logs", async (req: Request, res: Response) => {
  try {
    const { drone_id, drone_name, country, census } = req.body;
    const response = await axios.post(`${DRONE_LOG_SERVER}`, {
      drone_id,
      drone_name,
      country,
      census,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create log" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

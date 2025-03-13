import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import {
  findByDroneId,
  findByDroneIdInLogs,
} from "./utils/findDroneConfigsById";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Server 1: Drone Config Server
const DRONE_CONFIG_SERVER = process.env.DRONE_CONFIG_SERVER;
// Server 2: Drone Log Server
const DRONE_LOG_SERVER = process.env.DRONE_LOG_SERVER;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Drone API Gateway By Kuson Ta @KMITL" });
});

// GET /configs/:droneId
app.get("/configs/:droneId", async (req: Request, res: Response) => {
  try {
    const { droneId } = req.params;
    const response = await axios.get(`${DRONE_CONFIG_SERVER}`);
    let data = response.data.data;
    data = findByDroneId(data, Number(droneId));

    if (data.error === "Drone config not found") {
      res.status(404).json({ error: "Drone config not found" });
    } else {
      res.json({
        drone_id: data.drone_id,
        drone_name: data.drone_name,
        light: data.light,
        country: data.country,
        weight: data.weight,
      });
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
    data = findByDroneId(data, Number(droneId));

    if (data.error === "Drone config not found") {
      res.status(404).json({ error: "Drone status not found" });
    } else {
      res.json({ condition: data.condition });
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
    let data = response.data.items;
    const logs = findByDroneIdInLogs(data, Number(droneId));

    if (logs.length === 0) {
      res.status(404).json({ error: "Drone config not found" });
    } else {
      res.json(
        logs.map((item) => ({
          celsius: item.celsius,
          collectionId: item.collectionId,
          collectionName: item.collectionName,
          created: item.created,
          drone_id: item.drone_id,
          drone_name: item.drone_name,
          id: item.id,
          updated: item.updated,
        }))
      );
    }
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


export default app;

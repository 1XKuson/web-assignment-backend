type Drone = {
    drone_id: string;
    drone_name: string;
    light: string;
    condition: string;
    country: string;
    weight: number;
    population: number;
};

type DroneLog = {
    celsius: number;
    collectionId: string;
    collectionName: string;
    created: string;
    drone_id: string;
    drone_name: string;
    id: string;
    updated: string;
};

export const findByDroneId = (drones: Drone[], id: string): Drone | { error: string } => {
    const droneConfig = drones.find((item) => item.drone_id == id); // Use strict equality (===)
    if (droneConfig) {
        console.log("Found drone configs", droneConfig);
        return droneConfig;
    }
    else {
        console.log("Drone config not found", droneConfig);
        return { error: "Drone config not found" };
    }
};


export const findByDroneIdInLogs = (logs: DroneLog[], id: string): DroneLog[] => {
    const droneLogs = logs.filter((item) => item.drone_id == id); // Use strict equality (===)
    if (droneLogs) {
        console.log("Found drone logs", droneLogs);
        return droneLogs;
    }
    else {
        console.log("Drone logs not found", droneLogs);
        return [];
    }
}
;
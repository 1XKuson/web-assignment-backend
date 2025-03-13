type Drone = {
    drone_id: number;
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
    drone_id: number;
    drone_name: string;
    id: string;
    updated: string;
};

export const findByDroneId = (drones: Drone[], id: number): Drone | { error: string } => {
    const droneConfig = drones.find((item) => item.drone_id === id); // Use strict equality (===)
    if (droneConfig) {
        console.log("Found drone configs", droneConfig);
        return droneConfig;
    }
    else {
        console.log("Drone config not found", droneConfig);
        return { error: "Drone config not found" };
    }
};


export const findByDroneIdInLogs = (logs: DroneLog[], id: number): DroneLog[] => {
    // Filter logs by drone_id (ensure id is treated as a number)
    const droneLogs = logs.filter((item) => item.drone_id === id);

    // Sort logs by created date (ascending order)
    droneLogs.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

    if (droneLogs.length > 0) {
        console.log("Found drone logs", droneLogs);
        return droneLogs;
    } else {
        console.log("Drone logs not found");
        return [];
    }
};

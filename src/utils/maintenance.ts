interface MaintenanceStatus {
    isUnderMaintenance: boolean;
    message: string;
    estimatedEndTime?: string;
}

// For demo purposes, this is mocked to randomly return maintenance status
export const checkMaintenanceStatus = async (): Promise<MaintenanceStatus> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Randomly trigger maintenance mode (10% chance)
    const isUnderMaintenance = Math.random() < 0.1;

    if (isUnderMaintenance) {
        const now = new Date();
        const endTime = new Date(now.getTime() + 30 * 60000); // 30 minutes from now

        return {
            isUnderMaintenance: true,
            message: "We're currently performing system upgrades to improve our service.",
            estimatedEndTime: endTime.toLocaleTimeString(),
        };
    }

    return {
        isUnderMaintenance: false,
        message: "System is operational",
    };
}; 
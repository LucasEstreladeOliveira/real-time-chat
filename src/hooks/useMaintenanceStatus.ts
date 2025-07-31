import { useState, useEffect } from 'react';

interface MaintenanceStatus {
    isUnderMaintenance: boolean;
    message: string;
    estimatedEndTime?: string;
}

export function useMaintenanceStatus() {
    const [maintenanceStatus, setMaintenanceStatus] = useState<MaintenanceStatus | null>(null);

    useEffect(() => {
        const handleMaintenanceActive = () => setMaintenanceStatus({
            isUnderMaintenance: true,
            message: "System is under maintenance",
            estimatedEndTime: new Date(new Date().getTime() + 30 * 60000).toLocaleTimeString(),
        });

        const handleMaintenanceInactive = () => setMaintenanceStatus({
            isUnderMaintenance: false,
            message: "System is operational",
        });

        // Add event listeners
        window.addEventListener('maintenanceStatusActive', handleMaintenanceActive);
        window.addEventListener('maintenanceStatusInactive', handleMaintenanceInactive);

        return () => {
            window.removeEventListener('maintenanceStatusActive', handleMaintenanceActive);
            window.removeEventListener('maintenanceStatusInactive', handleMaintenanceInactive);
        };
    }, []);

    return maintenanceStatus;
} 
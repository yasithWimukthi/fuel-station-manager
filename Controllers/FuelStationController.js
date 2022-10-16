

const getVehicleCountByType = async (req, res) => {
    try {
        const vehicleType = req.query.vehicleType;
        const vehicleCount = await Vehicle.countDocuments({ vehicleType: vehicleType });
        res.status(200).json({ vehicleCount: vehicleCount });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
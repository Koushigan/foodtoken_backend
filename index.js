const express = require("express");
const { config } = require("dotenv");
const cors = require('cors');
const { log, middleware, mongo } = require("./shared");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const drinksRoutes = require("./routes/drinks.routes");
const dessertsRoutes = require("./routes/desserts.routes");
const pastaRoutes = require("./routes/pasta.routes");
const noodlesRoutes = require("./routes/noodles.routes");
const riceRoutes = require("./routes/rice.routes");

const app = express();
config();

// CORS setup
const corsOptions = {
    // Specify your allowed origin instead of '*'
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

(async () => {
    try {
        // Connect to MongoDB
        await mongo.connect();

        // Parse request body as JSON
        app.use(express.json());

        // Logging middleware
        app.use(middleware.logging);

        // Maintenance middleware
        app.use(middleware.Maintenance);

        // Auth Route
        app.use("/auth", authRoutes);

        // Token Middleware (Uncomment if needed)
        // app.use(middleware.validateToken);

        // Routes
        app.use("/biriyani", biriyaniRoutes);
        app.use("/drinks", drinksRoutes);
        app.use("/desserts", dessertsRoutes);
        app.use("/pasta", pastaRoutes);
        app.use("/rice", riceRoutes);
        app.use("/noodles", noodlesRoutes);

        // Default route
        app.get('/', (req, res) => {
            res.send("Food token generator");
        });

        // Initialize the port 
        const port = process.env.PORT || 3000;
        app.listen(port, () => log(`Server listening at port ${port}`));

    } catch (err) {
        console.error(err);
    }
})();

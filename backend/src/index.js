import "dotenv/config";

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 4000;

connectDB()
    .then(() => {

        app.listen(PORT, () => {
            console.log(
                `Server is running at port :${PORT}`
            );
        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

        process.exit(1);
    });
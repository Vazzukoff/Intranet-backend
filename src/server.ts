import app from "./app"
import { config } from "./config/environment"
import { connectDatabase } from "./db/connection";
import 'scheduler';
import './utils/scheduler';

const PORT = config.PORT;

connectDatabase()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running on http://localhost:${PORT}`)
		})
	})
	.catch((error) => {
		console.error("Database connection failed:", error);
		process.exit(1);
	});
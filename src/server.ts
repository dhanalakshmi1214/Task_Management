import express, {Application} from "express";
import cors from "cors";
import {PORT} from "./config/dotConfig"
import userRouters from "./routers/userRouters"
import authRoutes from "./routers/authRouters"
import taskRouters from "./routers/taskRouters"
import taskAssignedRouters from "./routers/taskAssignRouters"


const app: Application = express();
app.use(cors());
app.use(express.json())


app.use("/users", userRouters);
app.use("/login", authRoutes)
app.use("/task", taskRouters)
app.use("/taskassigned", taskAssignedRouters)




app.listen(PORT, ()=>{
    console.log(`Server is running on the port ${PORT}`)
})

export default app;

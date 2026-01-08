import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import mediaRoutes from './routes/media.routes.js'
import userRoutes from './routes/user.routes.js'
import statsRoutes from './routes/stats.routes.js'
import projectRoutes from './routes/project.routes.js';
import portfolioRoutes from "./routes/portfolio.routes.js"
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))
// this is for rate limiting case
// before this req.ip = PROXY_IP which remain as it is independent of users
// after trust-proxy req.ip = real user ip 
// so now rate limiting works per user instead of per proxy
app.set("trust proxy",1)
app.use(cookieParser())
// this add more security
app.use(helmet())
// this is used to parse incoming JSON request bodies and make them available on req.body
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/media',mediaRoutes)
app.use('/api/user',userRoutes)
app.use("/api/stats",statsRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/portfolio",portfolioRoutes);
export default app;
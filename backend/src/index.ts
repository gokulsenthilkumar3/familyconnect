import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import treesRoutes from './routes/trees.routes';
import membersRoutes from './routes/members.routes';
import relationshipsRoutes from './routes/relationships.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trees', treesRoutes);
app.use('/api/v1/members', membersRoutes);
app.use('/api/v1/relationships', relationshipsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

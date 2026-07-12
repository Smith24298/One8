import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Order service is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

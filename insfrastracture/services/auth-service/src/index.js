import app from './app.js';
import env from './config/env.js';
const PORT = env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

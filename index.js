const app = require('./server.js');
require('dotenv').config({ path: './config/.env' });
const mongoose = require('mongoose');

async function main() {
  const PORT = process.env.PORT || 5000;

  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => {
      console.log(`server running on port: ${PORT}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main().catch(console.error);

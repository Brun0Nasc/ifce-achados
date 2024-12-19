require('dotenv').config();
// const connectDB = require('./config/database')
const app = require('./app')

const PORT = process.env.PORT || 3000;

// abrindo conexão com banco de dados
// connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port :${PORT}`);
});

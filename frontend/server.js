const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist/eventhub-frontend
app.use(express.static(path.join(__dirname, 'dist/eventhub-frontend')));

// Handle SPA routing - redirect all requests to index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/eventhub-frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

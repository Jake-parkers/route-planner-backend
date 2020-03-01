require('dotenv').config();
const app = require('./components');
const port = process.env.PORT || 8000;

app.listen(port, '', () => {
    console.log(`App Listening On Port ${port}`);
});

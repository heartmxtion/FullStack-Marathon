const express = require('express');
const expressThymeleaf = require('express-thymeleaf');
const { TemplateEngine } = require('thymeleaf');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const app = express();
const templateEngine = new TemplateEngine();

app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    const getValue = (key) => (req.body[key] === '' ? 'NONE' : req.body[key]);

    if (!req.body) {
        return res.sendStatus(400);
    }

    res.render('index', {
        name: getValue('name'),
        email: getValue('email'),
        age: getValue('age'),
        description: getValue('description'),
        photo: getValue('photo'),
    });
});

const express = require("express");
const path = require('path');
const cookieSession = require('cookie-session');
const CreateError = require('http-errors');

const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes')

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
    name: 'session',
    keys: ['qKek53wejslie', 'wKOL3604kSLsjoek']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'))

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
    try {
        const names = await speakersService.getNames();
        response.locals.speakerNames = names;
        return next();
    } catch (err) {
        return next(err);
    }
});

app.use('/', routes({
    feedbackService,
    speakersService
}))

app.use((request, response, next) => next(CreateError(404, 'File not found')));

app.use((err, request, response, next) => {
    response.locals.message = err.message;
    console.log(err);
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});
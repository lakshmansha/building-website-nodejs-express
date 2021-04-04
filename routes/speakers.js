const express = require("express");

const router = express.Router();

module.exports = (params) => {

    const { speakersService } = params;

    router.get('/', async (request, response, next) => {
        try {
            const speakers = await speakersService.getList();
            const artWorks = await speakersService.getAllArtwork();
            response.render('layout', { pageTitle: "Speakers", template: 'speakers', speakers, artWorks })
        } catch (err) {
            return next(err);
        }

    });

    router.get('/:shortname', async (request, response, next) => {
        try {
            const speaker = await speakersService.getSpeaker(request.params.shortname);
            const artWorks = await speakersService.getArtworkForSpeaker(request.params.shortname);
            response.render('layout', { pageTitle: "Speakers", template: 'speaker-detail', speaker, artWorks })

        } catch (err) {
            return next(err);
        }
    });

    return router;
};

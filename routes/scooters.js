const { Router } = require('express');
const Scooter = require('../model/scooter-module.js')
const router = Router()

const refactId = (elem) => {
    const id = elem._id;
    delete elem._id;
    elem.id = id;
    return elem
}

router.get('/', async (req, res) => {
    try {
        const scooters = await Scooter.find({}).lean();
        scooters.forEach(elem => {
            elem = refactId(elem)
        })

        res.render('scooters', {
            title: 'scooters',
            isScooters: true,
            scooters
        })
    } catch (err) {
        console.error('Error')
    }

})

router.get('/:id', async (req, res) => {
    try {
        let scooter = await Scooter.findById(req.params.id).lean();
        scooter = refactId(scooter)

        res.render('scooter', {
            layout: 'new',
            title: `Scooter ${scooter.model}`,
            scooter
        })
    } catch (err) {
        console.error('Error')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        if (!req.query.red) {
            return res.redirect('/')
        }
        let scooter = await Scooter.findById(req.params.id).lean();
        scooter = refactId(scooter)
        res.render('scooter-edit', {
            title: `Scooter-edit`,
            scooter
        })
    } catch (err) {
        console.error('Error')
    }
})

router.post('/edit', async (req, res) => {
    const { id } = req.body;
    delete req.body.id;
    await Scooter.findByIdAndUpdate(id, req.body);
    return res.redirect('/scooters');
})

router.post('/delete', async (req, res) => {
    try {
        await Scooter.deleteOne({ _id: req.body.id });
        return res.redirect('/scooters');
    } catch (err) {
        console.log(err)
    }
})

module.exports = router
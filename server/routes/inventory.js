const Router = require('express').Router
const ControllerInventory = require('../controllers/Inventory')

const router = new Router()

router.get('/', async (req, res) => {
  return res.send(await ControllerInventory.get());
});

router.get('/get/name/:name', async (req, res) => {
  return res.send(await ControllerInventory.getByName(req.params.name));
});

router.get('/get/mark/:mark', async (req, res) => {
  return res.send(await ControllerInventory.getByMark(req.params.mark));
});

router.post('/new', async (req, res) => {
  const params = req.body
  const result = await ControllerInventory.new(params)
  if (result) {
    return res.send(result);
  } else {
    return res.send('No OK, no variables')
  }
})

router.put('/update', (req, res) => {
  const params = req.body
  return res.send({ status: ControllerInventory.update(params) })
})

router.delete('/delete/:id', async (req, res) => {
  const params = req.body
  return res.send(await ControllerInventory.deleteOne(req.params.id))
})

module.exports = router;
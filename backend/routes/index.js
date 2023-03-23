var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get: 1~10 까지의 랜덤한 숫자 리턴
router.get('/api/getTest', async (req, res) => {
  const resultNum = Math.floor(Math.random()*10)
  try {
    res.send({
      result: resultNum
    })
  } catch (err) {
    console.log(err);
    res.send({
      error: 'get error',
    });
  }
})

// Post: 전달받은 이름에 문자열을 더해서 리턴
router.post('/api/postTest', async (req, res) => {
  const userName = req.body.name
  try {
    res.send({
      result: userName + '님, 안녕하세요!'
    })
  } catch (err) {
    console.log(err);
    res.send({
      error: 'post error',
    });
  }
})

module.exports = router;
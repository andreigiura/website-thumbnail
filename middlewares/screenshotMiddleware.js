var fs = require('fs');
const uuidv1 = require('uuid/v1');
const rimraf = require("rimraf");
const puppeteer = require('puppeteer');


//TODO: implement cache using REDIS/MEMCache with TTL
var imagesCache = {};
setInterval(() => {

  rimraf("public/images", () => {
    imagesCache = {};
    console.log(imagesCache);
  });
}, 1000 * 60)
//-------------------------------------------

module.exports.Screenshot = async function (req, res, next) {
  let width = 0;
  let website = req.params.website;
  switch (req.query.size) {
    case "small":
      width = 650;
      break;
    case "medium":
      width = 1024;
      break;
    case "large":
      width = 1440;
      break;

    default:
      width = 1024;
      break;
  }
  let height = parseInt(width / 1.523);
  let uid = `${uuidv1()}-${width}-${height}`;

  if (imagesCache[`${website}-${width}-${height}`]) {
    req.redirectUrl = `/images/${imagesCache[`${website}-${width}-${height}`]}.png`;
    return next();
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ 
      width: width,
      height: height
    });
    await page.goto(`http://${website}`);
    await page.screenshot({path: `public/images/${uid}.png`, clip: {x: 0, y: 0, width: width, height: height}}); 
    await browser.close();
    imagesCache[`${website}-${width}-${height}`] = `${uid}`; 
    req.redirectUrl = `/images/${uid}.png`;
    return next();
  } catch (error) {
    res.status(500)
    res.render('error', { error })
  }
}
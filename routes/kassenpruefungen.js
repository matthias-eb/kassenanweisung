import express from "express";
import { GetKassenpruefungen, GetKassenpruefung, UpdateKassenpruefung } from "../backend/endpoints.js";

const kpRouter = express.Router();

kpRouter.get("/", async(req, res) => {
  let kps = await GetKassenpruefungen();
  let page = req.query.page ? req.query.page : 1;
  const limit = req.query.limit ? req.query.limit : 10
  const updated = req.query.edit ? req.query.edit : false
  const removed = req.query.removed ? req.query.removed : false
  let firstpage = page == 1

  if (kps === undefined) {
    res.render("404.hbs")
    return
  }
  let lastpage = page == Math.ceil(kps.length / limit);
  const hhj_arr = await getHaushaltsjahre()
  res.render("kaprueanzeigen", { rows: kps, page: page, firstpage: firstpage, lastpage: lastpage, updated: updated, removed: removed, HEADER_HHJ: hhj_arr,});
});

kpRouter.get("/edit/:id", async(req, res) => {
  let kp = await GetKassenpruefung(req.params.id);
  const hhj_arr = await getHaushaltsjahre()
  res.render("kaprueedit", {...kp, PrevPage: req.query.prevPage, HEADER_HHJ: hhj_arr });
})

kpRouter.put("/edit/:id", async(req, res) => {
  const kp = {
    Id,
    Datum,
    Betrag,
  } = req.body
  res = await UpdateKassenpruefung(kp)
  const hhj_arr = await getHaushaltsjahre()
  if (res === 200) {
    res.redirect('/kassenpruefungen?page=' + req.query.prevPage + '&edit=true')
  } else res.render("kaprueedit", {...kp, error: true, HEADER_HHJ: hhj_arr });
})

kpRouter.get("/create", (req, res) => {
  res.render("404");
})

kpRouter.get("/delete", (req, res) => {
  res.render("404");
})

export { kpRouter };
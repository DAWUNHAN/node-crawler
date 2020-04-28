const xlsx = require('xlsx');
const axios = require('axios'); // AJAX Library
const cheerio = require('cheerio'); // HTML Parsing
const add_to_sheet = require('./add_to_sheet');

const workbook = xlsx.readFile('xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  add_to_sheet(ws, 'C1', 's', '평점');
  add_to_sheet(ws, 'D1', 's', '리뷰');
  for(const [i, r] of records.entries()){
    const response = await axios.get(r.링크);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $('.score.score_left .star_score').text();
      const review = $('.score_result ul li:nth-child(1) .score_reple p').text();
      console.log(r.제목, '평점', text.trim(), review.trim());
      const newCell = 'C' + (i + 2);
      const newReviewCell = 'D' + (i+2);
      add_to_sheet(ws, newCell, 'n', parseFloat(text.trim()));
      add_to_sheet(ws, newReviewCell, 's', review.trim());
    }
  }
  xlsx.writeFile(workbook, 'xlsx/result.xlsx');
  // await Promise.all(records.map(async (r) => {

  // }));
};
crawler();
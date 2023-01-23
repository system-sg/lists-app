
function re_sql(sql) {
  const re_sql = `
    ${sql}`
  return re_sql
}

function re_sql2(sql) {
  const re_sql = `,
      ${sql}`
  return re_sql
}

/*
  elements =	{
    '商材': 'イツザイ',
    'カテゴリ': 'ITエンジニア',
    '業種': 'システムエンジニア',
    '小カテ': 'オープン系',
    '都道府県': '大阪府',
    'ランク': 'S',
    'HP': '',
    '顧客タイプ': '',
    '資本金': '',
    '席数': '',
    '内容': '',
    '媒体名': '',
    '代表者': '',
    '施設数': '',
    'ジャンル': '',
    '予算': '',
    'クエリ': '',
    '従業員数': ''
  }
 */
function get_sql(elements) {

  let sql = "";
  let select = "";
  let from = "";
  let where = "";
  let order = "";
  let limit = "";
  let columns = [
    "ID",
    "屋号",
    "住所",
    "URL",
    "電話番号",
    "小カテ",
    "HP",
    "代表者名",
    "クエリ",
    "媒体名",
    "リストID",
    "顧客ID",
    "リストカテゴリID",
    "URLID",
    "商材",
    "業種",
    "職種" ,
    "ランク",
    "ファイル名",
    "都道府県",
    "エリア",
    "作成者",
  ];

  select += `
    SELECT
      c.company_name as company_name,
      c.address as address,
      s.url as url,
      cp.phone_number_hyphen as phone_number,
      ssc.name as sub_sub_cates_name,
      c.hp_url as hp_url,
      rp.name as representativies_name,
      c.query as query,
      m.name as medium_name,
      l.id as lists_id,
      s.clients_id as clients_id,
      lc.id as list_cates_id,
      s.id as sul_id,
      c2.name as counterparts,
      ca.name as categories_name,
      sc.name as sub_categories_name,
      r.name as ranks_name,
      sf.name as file_name,
      REPLACE(p.name,'\r','') as prefecture_name,
      REPLACE(a.name,'\r','') as area_name,
      lmu.name as list_make_name`

  from += `
    FROM lists  l
    LEFT JOIN clients as c ON l.clients_id =  c.id
    LEFT JOIN prefectures as p ON c.prefectures_id = p.id
    LEFT JOIN areas as a ON p.areas_id = a.id
    INNER JOIN searched_url_logs as s ON l.id = s.lists_id
    LEFT JOIN clients_phone_numbers as cp ON c.id = cp.clients_id    
    LEFT JOIN list_cates as lc ON l.id = lc.lists_id
    LEFT JOIN sub_sub_cates as ssc ON lc.sub_sub_cates_id = ssc.id
    LEFT JOIN sub_cates as sc ON ssc.sub_cates_id = sc.id
    LEFT JOIN categories as ca ON sc.categories_id = ca.id
    LEFT JOIN counterparts c2 ON ca.counterparts_id = c2.id
    LEFT JOIN ranks as r ON l.ranks_id = r.id
    LEFT JOIN representativies as rp ON l.clients_id = rp.clients_id
    LEFT JOIN searched_files as sf ON sf.id = l.searched_files_id
    LEFT JOIN medium as m ON s.medium_id = m.id
    LEFT JOIN list_making_users as lmu ON l.users_tn_id = lmu.id`

  where = `
    WHERE ca.name = '${elements["カテゴリ"]}' 
    AND sc.name = '${elements["業種"]}'
    AND ssc.name = '${elements["小カテ"]}' 
    AND r.name = '${elements["ランク"]}'`

  order = `
    ORDER BY l.created_at DESC, s.url ASC`

  limit = `
    LIMIT 200`
  /*------------条件式--------*/

  //都道府県
  if (elements.都道府県 == "既存エリア" | elements.都道府県 == "エリア外"　| elements.都道府県 == "指定なし") {
    where += re_sql(`AND REPLACE(a.name,'\r','') = '${elements["都道府県"]}'`);
  } else {
    where += re_sql(`AND REPLACE(p.name,'\r','') = '${elements["都道府県"]}'`);
  }

  //媒体名
  if (elements["媒体名"]) {
    where += re_sql(`AND m.name = '${elements["媒体名"]}'`);
  }

  //顧客タイプ
  if (elements["顧客タイプ"]) {
    select += re_sql2(`ct.name as client_types_name`);
    from += re_sql(`LEFT JOIN client_types as ct ON l.client_types_id = ct.id`);
    where += re_sql(`AND ct.name = '${elements["顧客タイプ"]}'`);
    columns.push("顧客タイプ");
  }

  //従業員数
  if (elements["従業員数"]) {
    const before = elements["従業員数"].split('~')[0]
    const after = elements["従業員数"].split('~')[1]
    select += re_sql2(`c.employee_int as employee`);
    where += re_sql(`AND c.employee_int between ${before} AND ${after}`);
    order += `, c.employee_int DESC`;
    columns.push("従業員数");
  }

  //施設数
  if (elements["施設数"]) {
    const facilities = elements["施設数"];
    const before = facilities.split('~')[0]
    const after = facilities.split('~')[1]
    select += re_sql2(`c.facilities_num_int as facilities`);
    where += re_sql(`AND c.facilities_num_int between ${before} AND ${after}`);
    order += `, c.facilities_num_int DESC`;
    columns.push("施設数");
  }

  //予算
  if (elements["予算"]) {
    const budget = elements["予算"];
    const before = budget.split('~')[0]
    const after = budget.split('~')[1]
    select += re_sql2(`c.budget_int as budget`);
    where += re_sql(`AND c.budget_int between ${before} AND ${after}`);
    order += `, c.budget_int DESC`;
    columns.push("予算");
  }

  //資本金
  if (elements["資本金"]) {
    const capitals = elements["資本金"];
    const before = capitals.split('~')[0]
    const after = capitals.split('~')[1]
    select += re_sql2(`c.capital_int as capital`);
    where += re_sql(`AND c.capital_int between ${before} AND ${after}`);
    order += `, c.capital_int DESC`;
    columns.push("資本金");
  }

  //席数
  if (elements["席数"]) {
    const seats = elements["席数"];
    const before = seats.split('~')[0]
    const after = seats.split('~')[1]
    select += re_sql2(`c.seat_int as seat`);
    where += re_sql(`AND c.seat_int between ${before} AND ${after}`);
    order += `, c.seat_int DESC`;
    columns.push("席数");
  }

  if (elements["代表者"]) where += re_sql(`AND rp.name <>  ''`);//代表者
  if (elements["クエリ"]) where += re_sql(`AND c.query <>  ''`);//クエリ
  if (elements["HP"]) where += re_sql(`AND c.hp_url <>  ''`);//HP
  if (elements["内容"]) where += re_sql(`AND c.contents <>  ''`);//内容
  if (elements["ジャンル"]) where += re_sql(`AND c.genre <>  ''`);//ジャンル

  sql = select + from + where + order + limit

  Logger.log(sql)

  return [sql, columns]

}


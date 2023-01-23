
/*=======パスワード認証=========*/
function get_sheet_account(){
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('ログイン');
  const lastRow = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const accounts = sheet.getRange(2,1,lastRow -1,4).getValues();
  return JSON.stringify(accounts)
}

function sendFileId(id, columns_data){
  columns_data.unshift(id)
  columns_data.unshift(new Date())
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME_ID); //コピー元のマスターデータのあるスプレッドシート
  sheet.appendRow(columns_data);
}


/*=======URLを返信=========*/
function get_url(){
  return JSON.stringify(INDEX_URL)
}

function get_url_signup(){
  return JSON.stringify([INDEX_URL, SIGN_UP_URL])
}


/*=======ドロップダウン=========*/

function get_sheet(){
  const ss0 = SpreadsheetApp.openById('1VYC5iS0IXZ2AFOLGQ4NnQKbY_4Q1vMi8Ri7wmlTKKuM')
  const sheet1 = ss0.getSheetByName('小カて一覧（原本）');
  const lastcolumn1 = sheet1.getLastColumn();
  const lastRow1 = sheet1.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_sub_sub_cates = sheet1.getRange(2,1,lastRow1 -1,lastcolumn1).getValues();

  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet2 = ss.getSheetByName('イツザイ残数');
  const lastcolumn2 = sheet2.getLastColumn();
  const lastRow2 = sheet2.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_itszai = sheet2.getRange(2,1,lastRow2 -1,lastcolumn2).getValues()

  const sheet3 = ss.getSheetByName('CMS_EC残数');
  const lastcolumn3 = sheet3.getLastColumn();
  const lastRow3 = sheet3.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_cms_ec = sheet3.getRange(2,1,lastRow3 -1,lastcolumn3).getValues()

  const ss4 = SpreadsheetApp.openById('1VVcCkAJc8t8QFcQ6QG1cEbVNExuEUQIoRxMKI4MKLRs')
  const sheet4 = ss4.getSheetByName('ap_forder_id and mail and');
  const lastcolumn4 = sheet4.getLastColumn();
  const lastRow4 = sheet4.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_groups = sheet4.getRange(2,1,lastRow4 -1,lastcolumn4).getValues();

  const return_data = [
    JSON.stringify(values_sub_sub_cates),
    JSON.stringify(values_groups),
    JSON.stringify(values_itszai),
    JSON.stringify(values_cms_ec)
    ]

  return return_data;
}

//媒体名入手
function get_medium(){
  const ss = SpreadsheetApp.openById(SHEET_ID)
  const sheet = ss.getSheetByName('媒体一覧');
  const lastRow = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_medium = sheet.getRange(3,1,lastRow -1,1).getValues()
  let mediums = []
  for(data of values_medium){mediums.push(data[0])}
  mediums = mediums.filter(function(value, index, self){ return self.indexOf(value) === index;});
  return JSON.stringify(mediums);
}

//組入手
function get_group(){
  const ss2 = SpreadsheetApp.openById('1VVcCkAJc8t8QFcQ6QG1cEbVNExuEUQIoRxMKI4MKLRs')
  const sheet2 = ss2.getSheetByName('ap_forder_id and mail and');
  const lastcolumn2 = sheet2.getLastColumn();
  const lastRow2 = sheet2.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const values_groups = sheet2.getRange(2,1,lastRow2 -1,lastcolumn2).getValues();
  let groups = []
  for(data of values_groups){groups.push(data[3])}
  groups = groups.filter(function(value, index, self){ return self.indexOf(value) === index;});
  return JSON.stringify(groups);
}

/**
 * Google Chatにメンション付きでメッセージを送信する関数です
 * GOOGLE_CHAT_URL：GoogleChatのURL
 * @parms {String} email - メールアドレス　 例：'s-oya@sungrove.co.jp';
 * @parms {String} message_text - メッセージテキスト　例："テスト"
 */
function sendMessageFromGAS(email, message_text){
  const user = AdminDirectory.Users.get(email, { viewType: 'domain_public' });
  let log_message= ""
  var message = {
    "text": `<users/${user.id}> ${message_text}`
  }
  var options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    'payload':JSON.stringify(message)
  };
  
  UrlFetchApp.fetch(GOOGLE_CHAT_URL, options);
  log_message += "google_chat送信\n";
  log_message += `宛先:${email}\n`;
  log_message += `内容：${message_text}`;
  console.log(log_message);
}

function test(){
  const email = "s-takeuchi@sungrove.co.jp"
  const message_text = "テストだよ"
  sendMessageFromGAS(email, message_text)
}

function sendTalkNote(message){
  MailApp.sendEmail(TALKNOTE_MAIL, "", message)
}




function send_test(group, apname, table_data){
  console.log(table_data)
}

// group, apname, table_data
function sendRecords(group, apname, table_data, columns_data) {
  try{
    let message = "";
    const today = Utilities.formatDate(new Date(), "JST","yyyyMMdd");
    const conn = Jdbc.getCloudSqlConnection(DB_URL, DB_USER, DB_USER_PWD);
    const stmt = conn.createStatement();

    let all_data = toDictData(table_data);
    let [lists, searched_url_logs, list_ids, list_logs, list_cates_ids] = getTageLists(all_data, apname, group);
    let [folder_id, ap_email] = getApInfo(apname, group);

    console.log(all_data)
    if(all_data.length){
      let title = "";
      const prefecture = all_data[0].都道府県;
      const area = all_data[0].エリア;
      const category = all_data[0].業種;
      const gyosyu = all_data[0].職種;

      console.log(all_data.join(","))
      console.log(list_logs.join(","))

      title += `${today}【${area}】【~${prefecture}】【${category}】【${gyosyu}】`;
      send_log(columns_data)
      createFile(folder_id,title, lists);//APのフォルダにリストを作成
      upSrchUrlLogs(searched_url_logs, ap_email, stmt);//sql更新
      delListCates(list_cates_ids, stmt);
      delLists(list_ids, stmt);
      copy_log(list_logs);
      stmt.close()
      conn.close()
    }
    else{
      message += "データが空です"
      console.log(message)
    }
  }
  catch(error){
    sendErrorEmail(group, apname, error)
  }
}

function sendErrorEmail(group, apname, error){
    console.error(error);
    let body = `グループ：${group}\n名前：${apname}\n${error}`;
    let subject = "リスト配布【WEBアプリ】"
    GmailApp.sendEmail(TALKNOTE_MAIL, subject, body);
}

function upSrchUrlLogs(searched_url_logs, email, stmt){
  if(searched_url_logs.length){
    let message = "";
    let sql = `UPDATE searched_url_logs SET use_at = NOW(), users_mail = '${email}' `;
    for(let i in searched_url_logs){
      sql += i == 0 ? `WHERE id = ${searched_url_logs[i][0]} `: `OR id = ${searched_url_logs[i][0]} ` 
    }
    let result = stmt.executeUpdate(sql);
    message += "テーブル更新：searched_url_logs\n"
    message += sql + "\n"
    message += `${result}件`
    console.log(message);
  }
}

function delListCates(list_ids, stmt){
  if(list_ids.length){
    let message = "";
    let sql = `DELETE FROM list_cates `;
    for(let i in list_ids){ sql += i == 0 ? `WHERE id = '${list_ids[i][0]}' `: `OR id = '${list_ids[i][0]}' `;}  
    let result = stmt.executeUpdate(sql);
    message += "テーブル削除：list_cates\n"
    message += sql + "\n"
    message += `${result}件`
    console.log(message);
  }
}

function delLists(list_ids, stmt){
  if(list_ids.length){
    let message = "";
    let sql = `DELETE FROM lists `;
    for(let i in list_ids){ sql += i == 0 ? `WHERE id = '${list_ids[i][0]}' `: `OR id = '${list_ids[i][0]}' `;}
    let result = stmt.executeUpdate(sql);
    message += "テーブル削除：lists\n"
    message += sql + "\n"
    message += `${result}件`
    console.log(message);
  }
}

/**
 * [ { ID: '1',
    '屋号': '菱川歯科医院',
    '住所': '〒3180021　 茨城県高萩市安良川715-2',
    URL: 'https://epark.jp/shopinfo/shk150266/',
    '電話番号': '0293-24-3718',
    '小カテ': 'なし',
    HP: '',
    '代表者名': '院長：菱川　健司',
    'クエリ': 'inurl:dental intext:"0293-"',
    '媒体名': 'EPARK',
    'リストID': '6859881',
    '顧客ID': '56734945-78b7-4a7e-a97d-e97c451b8772',
    'リストカテゴリID': '10272656',
    '商材': 'イツザイ',
    '業種': '医療',
    '職種': '歯科',
    'ランク': 'A',
    'ファイル名': '20221104【A】【茨城県】【医療】【歯科】【EPARK】',
    '都道府県': '大阪府',
    'エリア': '既存エリア' }]
 */
function getTageLists(all_data, apname, group){
  let today = Utilities.formatDate(new Date(), "JST","yyyy/MM/dd");
  let lists = [];//配布するリスト
  let lists_columns = [];////配布するリストのカラム
  let searched_url_logs = []; //URL, リストID
  let list_ids = [];//リストID
  let list_cates_ids = [];//リストID
  let list_logs = [];//リストログ

  for(let data of all_data){
    let list = [] 
    let list_column = [] 
    for(let key in data){
      if(
        key != "リストID" &
        key != "顧客ID" &
        key != "リストカテゴリID" &
        key != "ID" &
        key != "業種" &
        key != "職種" &
        key != "ランク" &
        key != "都道府県" &
        key != "エリア" &
        key != "商材" &
        key != "URLID" &
        key != "作成者" 
       ){
        list.push(data[key])
        list_column.push(key)
      }
    }
    list_ids.push([data.リストID]);
    list_cates_ids.push([data.リストカテゴリID]);
    searched_url_logs.push([data.URLID]);
    list_logs.push(
      [
        today,
        group,
        apname,
        "WEBアプリ",
        data.作成者,
        data.商材,
        data.業種,
        data.職種,
        data.小カテ,
        data.ランク,
        data.都道府県,
        data.エリア,
        data.ファイル名,
        data.媒体名,
        data.クエリ,
        data.電話番号
      ]
    );

    lists.push(list);
    lists_columns.push(list_column);
  }
  lists.unshift(lists_columns[0])
  return [lists, searched_url_logs, list_ids, list_logs, list_cates_ids]
}


/**
 * 取得したテーブルデータから連想配列に変換する関数
*/
function toDictData(table_data){
  let columns = [];
  for(let dic of table_data){
    if(dic.行 == 0){
      columns.push(dic.value)
    }
  }

  /*二次元配列に */
  let valuesArray = []
  for(var i = 1; i< 50; i++){
    let row_data = [];
    for(let dic of table_data){
      if(dic.行 == i){row_data.push(dic.value);}
    }
    if(row_data.length) valuesArray.push(row_data);
  }

  var keys = columns;
  var hashArray = [];
  //繰り返し処理にて実装します。
  for(var i = 0; i < valuesArray.length; i++) {
    var values = valuesArray[i];
    var hash = {}
    for(var v = 0; v < values.length;v++) {
      var key = keys[v];
      var value = values[v];
      hash[key] = value;
    }
    hashArray.push(hash);
  }

  if(hashArray.length == 1 ){
    hashArray = []
  }

  return hashArray

}

/**
 * getApInfo
*/
function getApInfo(name, group){
  const ss_copyFrom = SpreadsheetApp.openById('1VVcCkAJc8t8QFcQ6QG1cEbVNExuEUQIoRxMKI4MKLRs'); //コピー元のマスターデータのあるスプレッドシート
  const sheet_copyFrom = ss_copyFrom.getSheetByName('ap_forder_id and mail and');
  const lastRow_From = sheet_copyFrom.getLastRow(); //最終行を取得
  const lastColumn_From = sheet_copyFrom.getLastColumn(); //最終列を取得
  const ap_values = sheet_copyFrom.getRange(2,1,lastRow_From,lastColumn_From).getValues();
  let id;
  let emai;

  for(let value of ap_values){  
    if(value[0].match(name) && value[3].match(group)){
      id = value[1];
      email = value[2];
      break
    }
  }
  return [id, email]
}


function createFile(id,title,copyValue){// 指定フォルダに新規ファイル作成
  copyValue = deleteNewLine(copyValue);//改行削除
  let ssNew = createSpFolder(id,title);
  let ssNewID = ssNew.getId();
  let ssNewFile = SpreadsheetApp.openById(ssNewID);
  let activeSpreadsheet = SpreadsheetApp.setActiveSpreadsheet(ssNewFile);
  let sheet  = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  let columns = copyValue[0].length;
  let rows = copyValue.length;
  sheet.getRange(1, 1, rows, columns).setValues(copyValue);
  sheet.getRange(1, 1, rows, columns).createFilter();
  sheet.setFrozenRows(1);
  sheet.getRange(1,1,1,columns).setBackground('#FFEBCD');
  sheet.setColumnWidths(1,columns,100);
}

function createSpFolder(folderID, fileName) {
  let folder = DriveApp.getFolderById(folderID);
  let newSS=SpreadsheetApp.create(fileName);
  let originalFile=DriveApp.getFileById(newSS.getId());
  let copiedFile = originalFile.makeCopy(fileName, folder);
  DriveApp.getRootFolder().removeFile(originalFile);
  return copiedFile;
}

// リストログ
function copy_log(list_log) {
  if(list_log.length){
    const ss_copyto = SpreadsheetApp.openById('1pic7vcPDQ-ngcTZ7ANNo4DSryirs9R9Egx2BwnhRv7M'); //コピー元のマスターデータのあるスプレッドシート
    const sheet_copyTo = ss_copyto.getSheetByName('データベース');
    const lastRow_To = sheet_copyTo.getLastRow(); //最終行を取得
    sheet_copyTo.getRange(lastRow_To+1,1,list_log.length,list_log[0].length).setValues(list_log);
    console.log("コピー完了")
  }
}

function deleteNewLine(copyValue){
  // ここから改行を消去するための処理
  // 改行を消したデータを作成する
  for (let i = 0; i < copyValue.length; i++) { // 行のループ
    for (let j = 0; j < copyValue[i].length; j++) { // 列のループ
      if (copyValue[i][j].toString().match(/\n/)) { // 改行が含まれていれば
        copyValue[i][j] = copyValue[i][j].replace(/\n/g, ''); // 改行を消して値を上書き
      }
    }
  }
  return copyValue
}

// リストログ
function send_log(columns_data) {
  columns_data.unshift(new Date())
  const ss = SpreadsheetApp.openById('1auH23brluN6GRIKPCtpOlPvp5-7jc9GfbJq31j6H_80'); //コピー元のマスターデータのあるスプレッドシート
  const sheet = ss.getSheetByName('ログ');
  sheet.appendRow(columns_data);
  console.log("ログ完了")
}

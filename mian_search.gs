/*=======その他の関数=========*/
function duplicate(array,columns_num) {
  const unique_A = array.filter(function(e, index){
    return !array.some(function(e2, index2){
      return index < index2 && e[columns_num] == e2[columns_num];
    });
  });
  return unique_A
}

function searchFilesID(file_id){
  const sheet = SpreadsheetApp.openById('1auH23brluN6GRIKPCtpOlPvp5-7jc9GfbJq31j6H_80').getSheetByName('検索ID');
  const lastRow = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const lastColumns = sheet.getLastColumn()
  let sheet_datas = sheet.getRange(1,1,lastRow, lastColumns).getValues();
  let element;
  sheet_datas = conversion(sheet_datas)
  element = sheet_datas.find(value => value.検索ID == file_id);
  return JSON.stringify(element);
}

/*=======メインの関数=========*/
function readRecords(elements, email) {
  /* JDBCを使って50件取得 */
  const conn = Jdbc.getCloudSqlConnection(DB_URL, DB_USER, DB_USER_PWD);
  const searched_element = get_sql(elements);
  const sql = searched_element[0];
  const columns = searched_element[1];
  let message = "";
  let stmt = conn.createStatement();
  let results = stmt.executeQuery(sql);
  let numCols = results.getMetaData().getColumnCount();
  /* クエリの内容をarrayに成形 */
  let array = [];
  while(results.next()) {
    const cols = [];
    for (let col = 0; col < numCols; col++) {
      const cellData = results.getString(col + 1);
      cols.push(cellData);
    }
    array.push(cols);
  }
  array = duplicate(array,3)
  array = array.splice(0,50)
  let tage_array = []
  for(i in array){
    let row = array[i]
    row.unshift(parseInt(i) + 1)
    tage_array.push(row);
  }
  tage_array.unshift(columns);
  console.log(tage_array)
  message += "検索完了";
  sendMessageFromGAS(email, message)
  return JSON.stringify(tage_array);
}

/**
 * 二次元配列から辞書型に変換します。
 * @parm {list} valuesArray - 二次元配列（カラムはindex番号0）
 */
function conversion(valuesArray) {
  var hashArray = [];
  var keys = valuesArray[0];
  //繰り返し処理にて実装します。
  for(var i = 1; i < valuesArray.length; i++) {
    var values = valuesArray[i];
    var hash = {}
    for(var v = 0; v < values.length;v++) {
      var key = keys[v];
      var value = values[v];
      hash[key] = value;
    }
    hashArray.push(hash);
  }
  return hashArray
}

function readRecords2() {
  return JSON.stringify(TEST_DATA);
}



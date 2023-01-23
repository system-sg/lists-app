function createAccounts(mailaddress, password, account_name, permission_password){
  const error = [];
  const sheet = SpreadsheetApp.openById('1auH23brluN6GRIKPCtpOlPvp5-7jc9GfbJq31j6H_80').getSheetByName('ログイン');
  const lastRow = sheet.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const accounts = sheet.getRange(2,1,lastRow -1,2).getValues();

  const sheet_mktg = SpreadsheetApp.openById('1auH23brluN6GRIKPCtpOlPvp5-7jc9GfbJq31j6H_80').getSheetByName('入社一覧');
  const lastRow_mktg = sheet_mktg.getRange(1, 1).getNextDataCell(SpreadsheetApp.Direction.DOWN).getRow(); //1列目の最終行を取得
  const data_mktg = sheet_mktg.getRange(2,17,lastRow_mktg -1,1).getValues();

  const mail_addresss = data_mktg.flat();
  if(!mail_addresss.includes(mailaddress)){
    error.push("入社一覧のメールアドレスを使用してください。");
  }

  if(!error.length){
    for(account of accounts){
      if(account[0] == mailaddress & account[1] == password){
        error.push("すでに登録済みです。");
        break
      }
    }
  }

  if(!error.length){
    sheet.appendRow([mailaddress, password, account_name, permission_password])
  }
  
  return JSON.stringify(error);
}

/*=======URLを返信=========*/
function get_url(){
  return JSON.stringify(INDEX_URL)
}

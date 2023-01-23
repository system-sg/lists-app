function doGet(e) {
  const page = e.parameter['p'];
  if (page == 'login' || page == null) {
    const htmlOutput = HtmlService.createTemplateFromFile("login").evaluate();
    htmlOutput.setTitle('リスト配布|ログイン');
    htmlOutput.setFaviconUrl('https://drive.google.com/uc?id=1buyMfmaIwz80l4WTtBkrI7FTd8XB8wYf&.png');
    return htmlOutput
  }
}

function doPost(e) {
  const name = e.parameter.name;
  const email = e.parameter.email;
  const page = e.parameter.p;
  let html, htmlOutput;
  let html_name = page == 'index' ? 'index' :
                  page == 'inquiry' ? 'inquiry' : "";
  html = HtmlService.createTemplateFromFile(html_name);
  html.name= name;
  html.email= email;
  htmlOutput = html.evaluate()
  htmlOutput.setTitle('リスト配布| Lists');
  htmlOutput.setFaviconUrl('https://drive.google.com/uc?id=1buyMfmaIwz80l4WTtBkrI7FTd8XB8wYf&.png');
  return htmlOutput
}

function doPost(e) {
  const htmlOutput = HtmlService.createTemplateFromFile("sign_up").evaluate();
  htmlOutput.setTitle('新規登録');
  htmlOutput.setFaviconUrl('https://drive.google.com/uc?id=1UzBNg2p_gZyU2JezZ3oG_Iovb14maLwe&.png');
  return htmlOutput
}

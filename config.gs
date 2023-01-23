
// Google Cloud接続名開発環境用
// const CONNECTION_NAME = 'sungrove-db-dev:us-central1:sungrove-db';

// Google Cloud接続名本番環境用
const CONNECTION_NAME = 'sungrove-db-dev:asia-northeast1:production';

// DBユーザー
const DB_USER = 'sungrove-system';
// DBユーザーパスワード
const DB_USER_PWD = 'sun3sungrove21';
// DB名
const DB = 'analysis';

// Google Cloud接続URL
const INSTANCE_URL = 'jdbc:google:mysql://' + CONNECTION_NAME;
const DB_URL = INSTANCE_URL + '/' + DB;

const GOOGLE_CHAT_URL = "https://chat.googleapis.com/v1/spaces/AAAAHoJ-jRQ/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=kyH5igZBrwSdZRJyJTw3H_XkwIPOQJomtJhdkYDbvOY%3D";


//質問の投稿先
const TALKNOTE_MAIL = "g-1000002590-482474@mail.talknote.com";

//webアプリ_login/indexのデプロイのURL
const INDEX_URL = "https://script.google.com/macros/s/AKfycbzIzToD-L9EDwna-O2IyXhzeI9GZTmJoQ713Ar1QyRrGOm7Ue9fBFtviqavBr0_xrPy/exec";

//webアプリ_sing_upのデプロイURL
const SIGN_UP_URL = "https://script.google.com/macros/s/AKfycbyogGAjXD_OQvnPlJOfbf8rbXTQAcJ_sAPKDNphG4iJJGukNOPIYOy3soY0Id7jDQn7/exec";

const SHEET_ID = '1auH23brluN6GRIKPCtpOlPvp5-7jc9GfbJq31j6H_80'

const SHEET_NAME_ID = '検索ID'

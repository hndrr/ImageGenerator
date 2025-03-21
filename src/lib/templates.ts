export const aspectRatioTemplates = [
  {
    label: "横長",
    text: "aspect:landscape",
    ratio: (w: number, h: number) => w > h,
  },
  {
    label: "縦長",
    text: "aspect:portrait",
    ratio: (w: number, h: number) => w < h,
  },
  {
    label: "正方形",
    text: "aspect:square",
    ratio: (w: number, h: number) => w === h,
  },
];

export const expressionTemplates = [
  { label: "笑顔", text: "expression:smiling" },
  { label: "真顔", text: "expression:neutral face" },
  { label: "悲しい", text: "expression:sad face" },
  { label: "怒り", text: "expression:angry face" },
  { label: "驚き", text: "expression:surprised face" },
  { label: "ウインク", text: "expression:winking" },
  { label: "照れ", text: "expression:embarrassed" },
  { label: "泣き顔", text: "expression:crying" },
  { label: "大笑い", text: "expression:laughing hard" },
  { label: "困り顔", text: "expression:troubled face" },
  { label: "眠そう", text: "expression:sleepy face" },
];

export const angleTemplates = [
  { label: "正面", text: "view:front view" },
  { label: "俯瞰", text: "view:bird's eye view" },
  { label: "アオリ", text: "view:low angle" },
  { label: "斜め", text: "view:45 degree angle" },
  { label: "クローズアップ", text: "view:close-up shot" },
  { label: "引き", text: "view:full body shot" },
  { label: "バックショット", text: "view:back view" },
  { label: "自撮り", text: "view:selfie" },
];

export const poseTemplates = [
  { label: "立ち", text: "pose:standing" },
  { label: "座り", text: "pose:sitting" },
  { label: "寝転び", text: "pose:lying down" },
  { label: "歩き", text: "pose:walking" },
  { label: "走り", text: "pose:running" },
  { label: "ジャンプ", text: "pose:jumping" },
];

export const accessoryTemplates = [
  { label: "メガネ", text: "accessory:wearing glasses" },
  { label: "サングラス", text: "accessory:wearing sunglasses" },
  { label: "帽子", text: "accessory:wearing a hat" },
  { label: "キャップ", text: "accessory:wearing a cap" },
  { label: "ベレー帽", text: "accessory:wearing a beret" },
  { label: "マフラー", text: "accessory:wearing a scarf" },
  { label: "ネックレス", text: "accessory:wearing a necklace" },
  { label: "イヤリング", text: "accessory:wearing earrings" },
  { label: "バッグ", text: "accessory:holding a bag" },
  { label: "傘", text: "accessory:holding an umbrella" },
];

export const backgroundTemplates = [
  { label: "自然", text: "background:nature scene" },
  { label: "都会", text: "background:urban cityscape" },
  { label: "室内", text: "background:indoor room" },
  { label: "海", text: "background:beach and ocean" },
  { label: "山", text: "background:mountain landscape" },
  { label: "公園", text: "background:park" },
  { label: "カフェ", text: "background:cafe interior" },
  { label: "オフィス", text: "background:office space" },
  { label: "学校", text: "background:school campus" },
  { label: "夜景", text: "background:night city view" },
  { label: "夕暮れ", text: "background:sunset sky" },
  { label: "森林", text: "background:forest" },
];

export const styleTemplates = [
  { label: "写真調", text: "generate style:photorealistic" },
  { label: "絵画調", text: "generate style:oil painting" },
  { label: "水彩画", text: "generate style:watercolor" },
  { label: "鉛筆画", text: "generate style:pencil sketch" },
  { label: "パステル", text: "generate style:pastel art" },
  { label: "アニメ調", text: "generate style:anime" },
  { label: "漫画調", text: "generate style:manga" },
  { label: "ピクサー風", text: "generate style:pixar" },
  { label: "ジブリ風", text: "generate style:ghibli" },
  { label: "モノクロ", text: "generate style:black and white" },
  { label: "セピア", text: "generate style:sepia" },
  { label: "ネオン", text: "generate style:neon" },
  { label: "サイバーパンク", text: "generate style:cyberpunk" },
  { label: "レトロ", text: "generate style:retro" },
  { label: "ミニマル", text: "generate style:minimal" },
  { label: "抽象的", text: "generate style:abstract" },
];

export const timeTemplates = [
  { label: "朝", text: "time:morning" },
  { label: "昼", text: "time:noon" },
  { label: "夕方", text: "time:evening" },
  { label: "夜", text: "time:night" },
];

export const weatherTemplates = [
  { label: "晴れ", text: "weather:sunny" },
  { label: "雨", text: "weather:rainy" },
  { label: "雪", text: "weather:snowy" },
  { label: "曇り", text: "weather:cloudy" },
  { label: "霧", text: "weather:foggy" },
];

export const moodTemplates = [
  { label: "明るい", text: "mood:cheerful" },
  { label: "落ち着いた", text: "mood:calm" },
  { label: "神秘的", text: "mood:mysterious" },
  { label: "ロマンチック", text: "mood:romantic" },
  { label: "メランコリック", text: "mood:melancholic" },
  { label: "ドラマチック", text: "mood:dramatic" },
  { label: "幻想的", text: "mood:fantastical" },
];

export const filterTemplates = [
  { label: "ソフトフォーカス", text: "filter:soft focus" },
  { label: "ビネット", text: "filter:vignette" },
  { label: "フィルムグレイン", text: "filter:film grain" },
  { label: "モーションブラー", text: "filter:motion blur" },
  { label: "ハイキー", text: "filter:high key" },
  { label: "ローキー", text: "filter:low key" },
  { label: "クロスプロセス", text: "filter:cross process" },
];

export const lensTemplates = [
  { label: "標準レンズ", text: "lens:standard" },
  { label: "広角レンズ", text: "lens:wide angle" },
  { label: "望遠レンズ", text: "lens:telephoto" },
  { label: "魚眼レンズ", text: "lens:fisheye" },
  { label: "マクロレンズ", text: "lens:macro" },
  { label: "ティルトシフト", text: "lens:tilt-shift" },
  { label: "ポートレートレンズ", text: "lens:portrait" },
  { label: "ボケ味", text: "lens:bokeh effect" },
  { label: "レンズフレア", text: "lens:lens flare" },
];

export const clothingTemplates = [
  { label: "カジュアル", text: "clothing:casual outfit" },
  { label: "フォーマル", text: "clothing:formal outfit" },
  { label: "ビジネス", text: "clothing:business attire" },
  { label: "スポーツウェア", text: "clothing:sportswear" },
  { label: "水着", text: "clothing:swimwear" },
  { label: "ドレス", text: "clothing:dress" },
  { label: "スーツ", text: "clothing:suit" },
  { label: "制服", text: "clothing:uniform" },
  { label: "着物", text: "clothing:kimono" },
  { label: "コスプレ", text: "clothing:cosplay" },
  { label: "ゴシック", text: "clothing:gothic style" },
  { label: "ストリート", text: "clothing:street fashion" },
  { label: "ヴィンテージ", text: "clothing:vintage fashion" },
];

export const ageTemplates = [
  { label: "子供", text: "age:child" },
  { label: "10代", text: "age:teenager" },
  { label: "20代", text: "age:twenties" },
  { label: "30代", text: "age:thirties" },
  { label: "40代", text: "age:forties" },
  { label: "50代", text: "age:fifties" },
  { label: "高齢者", text: "age:elderly" },
];

export const hairstyleTemplates = [
  { label: "ロングヘア", text: "hairstyle:long hair" },
  { label: "ショートヘア", text: "hairstyle:short hair" },
  { label: "ボブ", text: "hairstyle:bob cut" },
  { label: "ポニーテール", text: "hairstyle:ponytail" },
  { label: "ツインテール", text: "hairstyle:twin tails" },
  { label: "お団子ヘア", text: "hairstyle:bun hair" },
  { label: "アップヘア", text: "hairstyle:updo" },
  { label: "パーマ", text: "hairstyle:curly hair" },
  { label: "ストレート", text: "hairstyle:straight hair" },
  { label: "サイドテール", text: "hairstyle:side ponytail" },
  { label: "前髪あり", text: "hairstyle:with bangs" },
  { label: "前髪なし", text: "hairstyle:without bangs" },
  { label: "三つ編み", text: "hairstyle:braided hair" },
];

export const haircolorTemplates = [
  { label: "黒髪", text: "hair color:black hair" },
  { label: "茶髪", text: "hair color:brown hair" },
  { label: "金髪", text: "hair color:blonde hair" },
  { label: "赤髪", text: "hair color:red hair" },
  { label: "ピンク髪", text: "hair color:pink hair" },
  { label: "青髪", text: "hair color:blue hair" },
  { label: "緑髪", text: "hair color:green hair" },
  { label: "紫髪", text: "hair color:purple hair" },
  { label: "白髪", text: "hair color:white hair" },
  { label: "銀髪", text: "hair color:silver hair" },
  { label: "グラデーション", text: "hair color:gradient hair" },
  { label: "ハイライト", text: "hair color:highlighted hair" },
];

export const lightingTemplates = [
  { label: "自然光", text: "lighting:natural light" },
  { label: "日光", text: "lighting:sunlight" },
  { label: "夕日", text: "lighting:sunset lighting" },
  { label: "朝日", text: "lighting:sunrise lighting" },
  { label: "月明かり", text: "lighting:moonlight" },
  { label: "キャンドル", text: "lighting:candlelight" },
  { label: "スポットライト", text: "lighting:spotlight" },
  { label: "間接照明", text: "lighting:ambient light" },
  { label: "ネオンライト", text: "lighting:neon lights" },
  { label: "バックライト", text: "lighting:backlight" },
  { label: "レムブラント", text: "lighting:rembrandt lighting" },
  { label: "ハイキー", text: "lighting:high-key lighting" },
  { label: "ローキー", text: "lighting:low-key lighting" },
  { label: "シルエット", text: "lighting:silhouette lighting" },
];

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

export const angleTemplates = [
  { label: "正面", text: "view:front view" },
  { label: "俯瞰", text: "view:bird's eye view" },
  { label: "アオリ", text: "view:low angle" },
  { label: "斜め", text: "view:45 degree angle" },
  { label: "クローズアップ", text: "view:close-up shot" },
  { label: "引き", text: "view:full body shot" },
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

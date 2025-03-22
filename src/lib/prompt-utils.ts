import { PromptType } from "@/components/ui/prompt-builder";
import { TagData, PromptData } from "@/components/ui/tiptap-editor";

/**
 * プロンプトオブジェクトをテキスト形式に変換する
 * @param prompt プロンプトオブジェクト
 * @returns テキスト形式のプロンプト
 */
export function promptToText(prompt: PromptType | PromptData): {
  positivePrompt: string;
  negativePrompt: string;
} {
  const positiveLines: string[] = [];
  const negativeLines: string[] = [];

  if ("positive" in prompt && Array.isArray(prompt.positive)) {
    // PromptType形式の場合（配列）
    const typedPrompt = prompt as PromptType;
    typedPrompt.positive.forEach((category) => {
      if (category.tags.length > 0) {
        positiveLines.push(`- ${category.name}: ${category.tags.join(", ")}`);
      }
    });

    typedPrompt.negative.forEach((category) => {
      if (category.tags.length > 0) {
        negativeLines.push(`- ${category.name}: ${category.tags.join(", ")}`);
      }
    });
  } else {
    // PromptData形式の場合（オブジェクト）
    const typedPrompt = prompt as PromptData;

    // ポジティブプロンプトの処理
    Object.entries(typedPrompt.positive).forEach(([category, tags]) => {
      if (tags.length > 0) {
        positiveLines.push(`- ${category}: ${tags.join(", ")}`);
      }
    });

    // ネガティブプロンプトの処理
    Object.entries(typedPrompt.negative).forEach(([category, tags]) => {
      if (tags.length > 0) {
        negativeLines.push(`- ${category}: ${tags.join(", ")}`);
      }
    });
  }

  const positivePrompt =
    positiveLines.length > 0
      ? `Please follow the instructions below to change the image:\n\n${positiveLines.join(
          "\n"
        )}`
      : "";

  const negativePrompt =
    negativeLines.length > 0
      ? `[NEGATIVE PROMPT] Do not include the following elements in the generated image:\n\n${negativeLines.join(
          "\n"
        )}`
      : "";

  return { positivePrompt, negativePrompt };
}

/**
 * テキスト形式のプロンプトからプロンプトオブジェクトを作成する（簡易版）
 * 既存のテキストプロンプトを変換する場合に使用
 * @param text テキスト形式のプロンプト
 * @returns プロンプトオブジェクト
 */
export function textToPrompt(
  positiveText: string,
  negativeText: string
): PromptData {
  const defaultPrompt: PromptData = {
    positive: {},
    negative: {},
  };

  // 空のプロンプトの場合は空のオブジェクトを返す
  if (!positiveText && !negativeText) {
    return defaultPrompt;
  }

  const processText = (text: string): TagData => {
    if (!text) return {};

    // システムプロンプト部分を除去
    const contentLines = text
      .replace(/Please follow the instructions below to change the image:/i, "")
      .replace(
        /\[NEGATIVE PROMPT\] Do not include the following elements in the generated image:/i,
        ""
      )
      .trim()
      .split("\n")
      .filter((line) => line.trim() !== "");

    // カテゴリーのマップを作成
    const categories: TagData = {};

    contentLines.forEach((line) => {
      // 行が "- " で始まる場合、それを取り除く
      const cleanLine = line.startsWith("- ") ? line.substring(2) : line;

      // カテゴリと値の分離（最初の:で分割）
      const colonIndex = cleanLine.indexOf(":");

      if (colonIndex > 0) {
        const category = cleanLine.substring(0, colonIndex).trim();
        const value = cleanLine.substring(colonIndex + 1).trim();

        if (!categories[category]) {
          categories[category] = [];
        }

        // カンマで区切られた値をタグとして追加
        const tags = value
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== "");
        categories[category].push(...tags);
      } else {
        // カテゴリ指定がない場合は「その他」に追加
        if (!categories["その他"]) {
          categories["その他"] = [];
        }
        categories["その他"].push(cleanLine);
      }
    });

    return categories;
  };

  return {
    positive: processText(positiveText),
    negative: processText(negativeText),
  };
}

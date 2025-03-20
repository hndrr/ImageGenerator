/**
 * Web Crypto APIを使用してAPIキーの暗号化と復号化を行うユーティリティ関数
 */

// 暗号化に使用するソルト値を環境変数から取得
function getSalt(): Uint8Array {
  const envSalt = import.meta.env.VITE_CRYPTO_SALT;
  if (!envSalt) {
    throw new Error("VITE_CRYPTO_SALTが設定されていません");
  }

  // 16進数文字列をUint8Arrayに変換
  return new Uint8Array(
    envSalt.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
  );
}

const SALT = getSalt();

/**
 * パスワードから暗号化キーを生成
 */
async function generateKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: SALT,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * データを暗号化
 */
export async function encryptData(
  data: string,
  password: string
): Promise<string> {
  const key = await generateKey(password);
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    enc.encode(data)
  );

  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * データを復号化
 */
export async function decryptData(
  encryptedData: string,
  password: string
): Promise<string> {
  try {
    const key = await generateKey(password);
    const dec = new TextDecoder();
    const combined = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((c) => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encrypted
    );

    return dec.decode(decrypted);
  } catch (error) {
    console.error("復号化エラー:", error);
    throw new Error("データの復号化に失敗しました");
  }
}

/**
 * APIキーをlocalStorageに暗号化して保存
 */
export function saveEncryptedApiKey(apiKey: string): void {
  const password = window.location.host; // ドメインをパスワードとして使用
  encryptData(apiKey, password)
    .then((encryptedKey) => {
      localStorage.setItem("encryptedApiKey", encryptedKey);
    })
    .catch((error) => {
      console.error("APIキーの暗号化に失敗しました:", error);
    });
}

/**
 * 暗号化されたAPIキーをlocalStorageから取得して復号化
 */
export async function getDecryptedApiKey(): Promise<string | null> {
  const encryptedKey = localStorage.getItem("encryptedApiKey");
  if (!encryptedKey) return null;

  try {
    const password = window.location.host;
    return await decryptData(encryptedKey, password);
  } catch (error) {
    console.error("APIキーの復号化に失敗しました:", error);
    return null;
  }
}

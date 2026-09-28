const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_PROMPT_LENGTH = 200;
const MAX_ITEMS = 12;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const FALLBACK_MODEL = "gemini-flash-lite-latest";

const systemInstruction = `Kamu adalah asisten belanja untuk aplikasi BelanjaKita.
Pengguna bisa menanyakan makanan, minuman, masakan, acara, kegiatan, atau benda apa pun.
Balas dalam Bahasa Indonesia yang ramah dengan dua bagian:
- "explanation": penjelasan singkat 2-4 kalimat tentang hal yang ditanyakan dan apa saja yang perlu disiapkan.
- "items": maksimal ${MAX_ITEMS} barang yang perlu dibeli. Setiap barang berisi:
  - "name": nama singkat (maksimal 6 kata), sertakan jumlah jika relevan, misalnya "Bawang merah 250 g".
  - "note": kegunaan atau alasan barang itu dibutuhkan, satu kalimat pendek.
Jangan ulangi barang yang sudah ada di daftar pengguna.
Jika permintaan tidak bisa dijadikan daftar belanja, jelaskan alasannya di "explanation" dan kosongkan "items".`;

const responseSchema = {
  type: "OBJECT",
  properties: {
    explanation: { type: "STRING" },
    items: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          note: { type: "STRING" },
        },
        required: ["name", "note"],
      },
    },
  },
  required: ["explanation", "items"],
};

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "GEMINI_API_KEY belum diatur di server" });
  }

  const body = req.body || {};
  const prompt = cleanText(body.prompt, MAX_PROMPT_LENGTH);
  if (!prompt) {
    return res.status(400).json({ error: "Tulis dulu mau belanja untuk apa" });
  }

  const existing = Array.isArray(body.existing)
    ? body.existing.filter((name) => typeof name === "string").slice(0, 50)
    : [];

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Permintaan: ${prompt}\nSudah ada di daftar: ${existing.join(", ") || "(kosong)"}`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  try {
    let response;
    // Model utama kadang overload (503); coba model cadangan sebelum menyerah.
    for (const model of [MODEL, FALLBACK_MODEL]) {
      response = await fetch(`${GEMINI_URL}/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: payload,
      });
      if (response.status !== 503) break;
    }

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini error:", data.error?.message);
      return res.status(502).json({ error: "AI sedang tidak bisa dihubungi" });
    }

    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((part) => part.text || "")
      .join("");
    const result = JSON.parse(text || "{}");

    const seen = new Set();
    const items = (Array.isArray(result.items) ? result.items : [])
      .map((item) => ({
        name: cleanText(item?.name, 80),
        note: cleanText(item?.note, 160),
      }))
      .filter((item) => {
        const key = item.name.toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, MAX_ITEMS);

    return res
      .status(200)
      .json({ explanation: cleanText(result.explanation, 800), items });
  } catch (error) {
    console.error("Suggest failed:", error);
    return res.status(502).json({ error: "AI sedang tidak bisa dihubungi" });
  }
};

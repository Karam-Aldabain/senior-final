import fs from "fs/promises";
import zlib from "zlib";
import { PDFParse } from "pdf-parse";
import { extractSkillsFromText } from "../../shared/skills/extractSkillsFromText.js";

function decodePdfString(value = "") {
  let result = "";

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (character !== "\\") {
      result += character;
      continue;
    }

    const nextCharacter = value[index + 1];

    if (!nextCharacter) {
      break;
    }

    if (/[0-7]/.test(nextCharacter)) {
      const octal = value.slice(index + 1, index + 4).match(/^[0-7]{1,3}/)?.[0] || "";
      if (octal) {
        result += String.fromCharCode(parseInt(octal, 8));
        index += octal.length;
        continue;
      }
    }

    const escapedCharacters = {
      n: "\n",
      r: "\r",
      t: "\t",
      b: "\b",
      f: "\f",
      "(": "(",
      ")": ")",
      "\\": "\\",
    };

    result += escapedCharacters[nextCharacter] ?? nextCharacter;
    index += 1;
  }

  return result;
}

function extractStringsFromArray(arrayContent = "") {
  const matches = arrayContent.match(/\((?:\\.|[^\\()])*\)/g) || [];
  return matches.map((entry) => decodePdfString(entry.slice(1, -1))).join("");
}

function extractTextFromPdfContent(content = "") {
  const fragments = [];
  const textPatterns = [
    /\((?:\\.|[^\\()])*\)\s*Tj/g,
    /\((?:\\.|[^\\()])*\)\s*'/g,
    /\((?:\\.|[^\\()])*\)\s*"/g,
  ];

  textPatterns.forEach((pattern) => {
    const matches = content.match(pattern) || [];
    matches.forEach((match) => {
      const text = match.match(/\((.*)\)/)?.[1];
      if (text) {
        fragments.push(decodePdfString(text));
      }
    });
  });

  const arrayMatches = content.match(/\[(?:\\.|[^\]])*\]\s*TJ/g) || [];
  arrayMatches.forEach((match) => {
    const arrayContent = match.match(/\[(.*)\]/)?.[1];
    if (arrayContent) {
      fragments.push(extractStringsFromArray(arrayContent));
    }
  });

  return fragments
    .join("\n")
    .split("\u0000")
    .join(" ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractTextWithFallback(buffer) {
  const source = buffer.toString("latin1");
  const streams = source.match(/stream[\r\n]+([\s\S]*?)endstream/g) || [];
  const textChunks = [];

  streams.forEach((entry) => {
    const rawStream = entry
      .replace(/^stream[\r\n]+/, "")
      .replace(/endstream$/, "");
    const streamBuffer = Buffer.from(rawStream, "latin1");
    const candidates = [streamBuffer];

    try {
      candidates.unshift(zlib.inflateSync(streamBuffer));
    } catch {
      // Ignore non-zlib streams and continue with other candidates.
    }

    try {
      candidates.unshift(zlib.inflateRawSync(streamBuffer));
    } catch {
      // Ignore non-raw-deflate streams and continue with other candidates.
    }

    candidates.forEach((candidate) => {
      const text = extractTextFromPdfContent(candidate.toString("latin1"));
      if (text) {
        textChunks.push(text);
      }
    });
  });

  return {
    text: Array.from(new Set(textChunks)).join("\n\n").trim(),
    pageCount: (source.match(/\/Type\s*\/Page\b/g) || []).length,
  };
}

export async function parseCvPdf(filePath) {
  const buffer = await fs.readFile(filePath);
  const pdfData = new Uint8Array(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  const parser = new PDFParse({ data: pdfData });

  try {
    try {
      const textResult = await parser.getText();
      const text = String(textResult.text || "").split("\u0000").join(" ").replace(/\s+\n/g, "\n").trim();
      const { extractedSkills, metadata } = extractSkillsFromText(text);

      let infoResult = null;

      try {
        infoResult = await parser.getInfo();
      } catch {
        infoResult = null;
      }

      return {
        rawText: text,
        extractedSkills,
        metadata: {
          ...metadata,
          pageCount: infoResult?.total || 0,
          info: infoResult?.info || {},
        },
      };
    } catch {
      const fallback = extractTextWithFallback(buffer);

      if (!fallback.text) {
        const error = new Error("The uploaded PDF could not be parsed. Try another PDF export.");
        error.status = 400;
        throw error;
      }

      const { extractedSkills, metadata } = extractSkillsFromText(fallback.text);

      return {
        rawText: fallback.text,
        extractedSkills,
        metadata: {
          ...metadata,
          pageCount: fallback.pageCount,
          info: {},
        },
      };
    }
  } finally {
    await parser.destroy().catch(() => {});
  }
}

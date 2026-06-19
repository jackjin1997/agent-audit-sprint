import QRCode from "qrcode";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "assets/payments");

const payments = [
  {
    name: "eth",
    value: "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF",
  },
  {
    name: "sol",
    value: "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM",
  },
];

await mkdir(outDir, { recursive: true });

for (const payment of payments) {
  const svg = await QRCode.toString(payment.value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: {
      dark: "#171a1f",
      light: "#ffffff",
    },
  });
  const file = resolve(outDir, `${payment.name}-address.svg`);
  await writeFile(file, svg);
  console.log(`Rendered ${file}`);
}

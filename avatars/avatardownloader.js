import fs from "fs/promises";
import fetch from "node-fetch"; // if Node < 18; otherwise remove this line

const peopleTeams = {
  "Shreyas":  [2056, 5409, 694, 67, 1768, 10002],
  "James":    [254, 6328, 3847, 148, 1983, 10118],
  "Kovi":     [1678, 2481, 7457, 4145, 68, 308],
  "Neil":     [1323, 4272, 2073, 2877, 1699, 4096],
  "Yuvaan":   [1690, 4678, 3310, 195, 604, 5012],
  "Sawyer":   [2910, 180, 359, 422, 3494, 247],
  "Luke":     [9450, 1796, 1706, 1771, 9094, 1189],
  "Ashwin":   [4414, 190, 125, 2767, 3136, 5835],
  "Kent":     [118, 3683, 9483, 3005, 111, 11274],
  "Lesbians": [5940, 1114, 5895, 4481, 1684, 1]
};

const TBA = "https://www.thebluealliance.com/avatar/2025/frc";

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function download(team) {
  const url = `${TBA}${team}.png`;
  const filePath = `avatars/frc${team}.png`;
  
  try {
    const res = await fetch(url);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    console.log(`✓ Saved frc${team}.png`);
    return true;
  } catch (err) {
    console.log(`✗ Failed for ${team}:`, err.message);
    return false;
  }
}

async function main() {
  await fs.mkdir("avatars", { recursive: true });

  const allTeams = [...new Set(Object.values(peopleTeams).flat())];
  const failed = [];

  console.log(`Downloading ${allTeams.length} avatars...\n`);

  for (const team of allTeams) {
    const ok = await download(team);
    if (!ok) failed.push(team);

    await sleep(100); // 0.1 second delay
  }

  console.log("\nDONE!");
  if (failed.length) {
    console.log("Failed teams:", failed.join(", "));
  } else {
    console.log("All avatars downloaded successfully.");
  }
}

main();

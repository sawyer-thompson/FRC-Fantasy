// build-rankings.mjs
import fs from "fs/promises";

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

const STATBOTICS = "https://api.statbotics.io/v3/team/";

async function fetchTeamEPA(team) {
  try {
    const res = await fetch(STATBOTICS + team);
    if (!res.ok) {
      console.error("Team fetch failed", team, res.status);
      return 0;
    }
    const data = await res.json();
    return data.norm_epa?.current ?? 0;
  } catch (err) {
    console.error("Error fetching team:", team, err);
    return 0;
  }
}

async function computeRankings() {
  const results = [];

  for (const [person, teams] of Object.entries(peopleTeams)) {
    let totalEPA = 0;

    await Promise.all(
      teams.map(async (team) => {
        const epa = await fetchTeamEPA(team);
        totalEPA += epa;
      })
    );

    const avgEPA = totalEPA / teams.length;

    results.push({
      person,
      teams,
      totalEPA,
      avgEPA
    });
  }

  // sort by totalEPA descending
  results.sort((a, b) => b.totalEPA - a.totalEPA);
  return results;
}

async function main() {
  console.log("Building rankings.json from Statbotics…");
  const rankings = await computeRankings();
  const payload = {
    updatedAt: new Date().toISOString(),
    rankings
  };

  await fs.writeFile("rankings.json", JSON.stringify(payload, null, 2));
  console.log("Wrote rankings.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

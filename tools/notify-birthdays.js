// Sends a Discord webhook message listing birthdays that start in 24 hours (JST).
// Run once per day at 00:00 JST (15:00 UTC). Needs Node 18+.
//
// Usage:
//   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/... node notify-birthdays.js
//   DRY_RUN=1 node notify-birthdays.js        (prints instead of sending)
//   TEST_DATE=2026-11-13 DRY_RUN=1 node notify-birthdays.js   (pretend "tomorrow" is this JST date)

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Load the existing birthday.js data without modifying it.
const code = fs.readFileSync(path.join(__dirname, "birthday.js"), "utf8");
const birthdays = vm.runInNewContext(code + "\n;birthdays");

// Today's date in JST as [year, month, day]
function jstToday() {
  const s = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date()); // YYYY-MM-DD
  return s.split("-").map(Number);
}

// The JST calendar date that begins 24 hours from now (i.e. "tomorrow" in JST)
function targetDate() {
  if (process.env.TEST_DATE) {
    const [y, m, d] = process.env.TEST_DATE.split("-").map(Number);
    return { month: m, day: d };
  }
  const [y, m, d] = jstToday();
  const t = new Date(Date.UTC(y, m - 1, d + 1));
  return { month: t.getUTCMonth() + 1, day: t.getUTCDate() };
}

async function main() {
  const { month, day } = targetDate();
  const matches = birthdays.filter((b) => {
    const [bm, bd] = b.birthday.split("/").map(Number);
    return bm === month && bd === day;
  });

  if (matches.length === 0) {
    console.log(`No birthdays on ${month}/${day} (JST). Nothing to send.`);
    return;
  }

  const lines = matches.map((b) => {
    let line = `• **${b.name}**`;
    // Nickname and link are only shown when the entry has a social link
    if (b.socials) {
      if (b.nickname) line += ` (${b.nickname})`;
      line += ` — <${b.socials}>`; // <> stops Discord link embeds
    }
    return line;
  });

  const content =
    `🎂 **Birthday tomorrow!** (${months[month - 1]} ${day}, JST)\n` + lines.join("\n");

  if (process.env.DRY_RUN) {
    console.log(content);
    return;
  }

  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) throw new Error("DISCORD_WEBHOOK_URL is not set");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Discord returned ${res.status}: ${await res.text()}`);
  console.log(`Sent ${matches.length} birthday(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
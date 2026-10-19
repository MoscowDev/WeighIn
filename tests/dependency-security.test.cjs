const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");

test("policy parser rejects scalar prototype traversal without polluting the process", () => {
  const child = spawnSync(
    process.execPath,
    [
      "-e",
      `
    const assert = require('node:assert/strict');
    const TOML = require('toml');
    for (const payload of [
      '[a.b]\\ny = 1\\n[a.b.y.__proto__.__proto__]\\nweighin_polluted = "yes"',
      'aa = 1\\n[[a]]\\n[aa.__proto__.__proto__]\\nweighin_polluted = "yes"'
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");

test("committed CycloneDX inventory matches the current locked inputs", () => {
  const output = execFileSync(
    process.execPath,
    [path.join(root, "dist/dependency-inventory.js"), "--check"],
    { cwd: root, encoding: "utf8" },
  );
  assert.match(output, /Dependency inventory verified/);
});

test("a clean packed consumer receives the inventory, bundles, native locks, and loadable API", () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "weighin-packed-consumer-"));
  try {
    const packed = JSON.parse(
      execFileSync(
        "npm",
        ["pack", "--ignore-scripts", "--json", "--pack-destination", temporary],
        { cwd: root, encoding: "utf8" },
      ),
    )[0];
    const packagedPaths = new Set(packed.files.map(({ path: filePath }) => filePath));
    for (const filePath of [
      "docs/dependency-inventory.json",
      "docs/DEPENDENCY_SECURITY.md",
      "bundled/index.js",
      "bundled/comment-action.js",
      "native/simulation/Cargo.toml",
      "native/simulation/Cargo.lock",
    ]) {
      assert.ok(packagedPaths.has(filePath), `missing packed file ${filePath}`);
    }
  `,
    ],
    { cwd: require("node:path").resolve(__dirname, ".."), encoding: "utf8" },
  );
  assert.equal(child.status, 0, child.stderr);
});

test("policy parser accepts supported named, decimal and absolute cap configurations", () => {
  const TOML = require("toml");
  const { validateConfig } = require("../dist/threshold");
  const config = TOML.parse(
    '[thresholds.functions.hello]\ncpu_instructions="strict_zero_tolerance"\nmemory_bytes="allow_2.5_percent_increase"\n[limits.functions.hello]\ncpu_instructions=350000',
  );
  assert.doesNotThrow(() => validateConfig(config));
  assert.equal(config.limits.functions.hello.cpu_instructions, 350000);
  assert.equal(
    config.thresholds.functions.hello.memory_bytes,
    "allow_2.5_percent_increase",
  );

    const consumer = path.join(temporary, "consumer");
    const tarball = path.join(temporary, packed.filename);
    execFileSync(
      "npm",
      ["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", "--prefix", consumer, tarball],
      { cwd: temporary, stdio: "pipe" },
    );
    execFileSync(process.execPath, ["-e", "require('weighin')"], {
      cwd: consumer,
      stdio: "pipe",
    });
    const installedInventory = JSON.parse(
      fs.readFileSync(
        path.join(consumer, "node_modules/weighin/docs/dependency-inventory.json"),
        "utf8",
      ),
    );
    const sourceInventory = JSON.parse(
      fs.readFileSync(path.join(root, "docs/dependency-inventory.json"), "utf8"),
    );
    assert.deepEqual(installedInventory, sourceInventory);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

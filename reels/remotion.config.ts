// Options: https://remotion.dev/docs/config (each one is also a CLI flag).
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// En este entorno se usa el Chromium preinstalado
if (require("fs").existsSync("/opt/pw-browsers/chromium")) Config.setBrowserExecutable("/opt/pw-browsers/chromium");

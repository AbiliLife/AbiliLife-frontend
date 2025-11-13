const fs = require("fs");
const path = require("path");

const podfilePath = path.join(process.cwd(), "ios", "Podfile");

if (fs.existsSync(podfilePath)) {
    let contents = fs.readFileSync(podfilePath, "utf8");
    if (!contents.includes("use_modular_headers!")) {
        contents = contents.replace(
            /use_expo_modules!/,
            "use_expo_modules!\nuse_modular_headers!"
        );
        fs.writeFileSync(podfilePath, contents, "utf8");
        console.log("✅ Added `use_modular_headers!` to Podfile automatically.");
    } else {
        console.log("ℹ️ Podfile already contains `use_modular_headers!`.");
    }
}

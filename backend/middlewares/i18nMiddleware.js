import { configure } from "i18n";
import { join } from "path";

configure({
  locales: ["en", "es"],
  directory: join(__dirname, "locales"),
  defaultLocale: "es",
  cookie: "lang",
  register: global,
});

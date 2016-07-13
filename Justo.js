//imports
const justo = require("justo");
const catalog = justo.catalog;
const babel = require("justo-plugin-babel");
const copy = require("justo-plugin-fs").copy;
const clean = require("justo-plugin-fs").clean;
const jshint = require("justo-plugin-jshint");
const npm = require("justo-plugin-npm");

//catalog
catalog.workflow({name: "build", desc: "Build the package"}, function() {
  clean("Remove build directory", {
    dirs: ["build/es5"]
  });

  jshint("Best practices and grammar", {
    output: true,
    src: [
      "index.js",
      "Justo.js",
      "lib/",
      "test/unit/index.js",
      "test/unit/util/",
      "test/unit/lib/"
    ]
  });

  babel("Transpile", {
    comments: false,
    retainLines: true,
    preset: "es2015",
    files: [
      {src: "index.js", dst: "build/es5/"},
      {src: "lib/", dst: "build/es5/lib"}
    ]
  });

  clean("Remove dist directory", {
    dirs: ["dist/es5"]
  });

  copy(
    "Create package",
    {
      src: "build/es5/index.js",
      dst: "dist/es5/nodejs/elisa-mysql/"
    },
    {
      src: "build/es5/lib/",
      dst: "dist/es5/nodejs/elisa-mysql/lib"
    },
    {
      src: ["package.json", "README.md"],
      dst: "dist/es5/nodejs/elisa-mysql/"
    }
  );
});

catalog.macro({name: "test", desc: "Unit testing"}, {
  require: "justo-assert",
  src: ["test/unit/index.js", "test/unit/lib/"]
});

catalog.workflow({name: "publish", desc: "NPM publish."}, function() {
  npm.publish("Publish in NPM", {
    who: "elisajs",
    src: "dist/es5/nodejs/elisa-mysql/"
  });
});

catalog.workflow({name: "install-elisa", desc: "Install Elisa API."}, function() {
  npm.install("Install Elisa API", {
    pkg: "../elisa/dist/es5/nodejs/elisa/",
    output: false
  });
});

catalog.workflow({name: "install-validator", desc: "Install Elisa validator."}, function() {
  npm.install("Install Elisa validator", {
    pkg: "../elisa-driver-validator/dist/es5/nodejs/elisa-driver-validator/",
    output: false
  });
});

catalog.macro({name: "install-devDependencies", desc: "Install dev dependencies"}, ["install-validator", "install-elisa"]);

catalog.macro({name: "default", desc: "Default task."}, ["build", "test"]);

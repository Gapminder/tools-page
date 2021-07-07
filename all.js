const shell = require('shelljs');

let command = process.argv.slice(2, 4).join(' ').trim();
if (command == "git commit") command = 'git commit -m "' + process.argv.slice(4) + '"';
if (command == "git add") command = 'git add --all';
if (command == "bump") command = 'npm --no-git-tag-version -f version patch';
if (command == "bump-minor") command = 'npm --no-git-tag-version -f version minor';

const packages = require('./vizabi-tools.json').tools;

const execAsync = (command) => shell.exec(command, { async: true, silent: true }, (_, stdout, stderr) => {
  console.log(
    [
      `command: ${command}`,
      `stdout: ${stdout}`,
      `stderr: ${stderr}`,
      '-----------------------'
    ].map(m => m.trim()).join('\n')
  );
});

if (command.startsWith('git clone')) {
  shell.cd('..');
  packages.forEach((pkg) => execAsync(`${command} https://github.com/vizabi/${pkg}.git ${pkg}`));
} else {
  packages.forEach((pkg) => execAsync(`cd ../vizabi/${pkg} && ${command}`));
}

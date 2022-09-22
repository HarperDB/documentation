# Mac Development Requirements

MacOS is not recommended as a production operating system, but it is great for development. For more information on standard HarperDB installation visit the HarperDB Command Line Interface guide. This page details the unique cases you may run into when installing on Mac.



Please note, HarperDB suggests Node.js v16.17.0 as a prerequisite to installation. You may use an earlier version as far as 14.0.0. [Learn more here](https://harperdb.io/docs/install-harperdb/node-version/).

---

To install HarperDB please visit the npm install guide: https://www.npmjs.com/package/harperdb.

Possible Errors
An error you may see if Xcode is not already installed is as followed:

```bash
gyp: No Xcode or CLT version detected!
gyp ERR! configure error
```
It may be the case you do have CLT (Command Line Tools). However, the error is asking us to reconfigure, the following commands will help move you forward.



Find the CLT path.

```bash
xcode.jpg-select --print-path
```

Remove the directory referenced by the result of the above command:


```bash
sudo rm -rf /Library/Developer/CommandLineTools
```

If you have Git installed, a prompt will appear, and you can reinstall the Command Line Tools; follow the prompts.



![xcode installer](../../images/xcode.png)



If Git is NOT installed the following command will create the above-mentioned prompt.
```bash
xcode.jpg-select --install
```

After installation of the Command Line Tools, the gyp library should no longer throw an error and you can continue.
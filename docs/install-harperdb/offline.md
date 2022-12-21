# Offline Install

If you need to install HarperDB on a device that doesn't have an Internet connection, you can download the npm package and install it directly (you’ll still need Node.js and NPM):

<a href="https://registry.npmjs.org/harperdb/-/harperdb-3.3.0.tgz" style = "background:#403b8a !important; color: white !important; border:none; outline:none; width:100%; cursor:pointer; margin-top: 1.5rem !important; margin-bottom: 3rem !important; bs-btn-padding-x: .75rem; --bs-btn-padding-y: .375rem; --bs-btn-font-family: ; --bs-btn-font-size: 1rem; --bs-btn-font-weight: 400; --bs-btn-line-height: 1.5; --bs-btn-color: #212529; --bs-btn-bg: transparent; --bs-btn-border-width: 1px; --bs-btn-border-color: transparent; --bs-btn-border-radius: .375rem; --bs-btn-hover-border-color: transparent; --bs-btn-box-shadow: inset 0 1px 0 rgba(255,255,255,.15),0 1px 1px rgba(0,0,0,.075); --bs-btn-disabled-opacity: .65; --bs-btn-focus-box-shadow: 0 0 0 .25rem rgba(var(--bs-btn-focus-shadow-rgb),.5); display: inline-block; padding: var(--bs-btn-padding-y) var(--bs-btn-padding-x); font-family: var(--bs-btn-font-family); font-size: var(--bs-btn-font-size); font-weight: var(--bs-btn-font-weight); line-height: var(--bs-btn-line-height); color: var(--bs-btn-color); text-align: center; text-decoration: none; vertical-align: middle; user-select: none; border: var(--bs-btn-border-width) solid var(--bs-btn-border-color); border-radius: var(--bs-btn-border-radius); background-color: var(--bs-btn-bg); transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; -webkit-appearance: button; text-transform: none;">Download Install Package</a>


Once you’ve downloaded the .tgz file, run the following command from the directory where you’ve placed it:

```bash
npm install -g harperdb-X.X.X.tgz harperdb install
```

For more information visit the [HarperDB Command Line Interface](../administration/harperdb-cli.md) guide.
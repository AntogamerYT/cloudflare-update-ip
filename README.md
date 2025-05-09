# cloudflare-update-ip
Are you hosting a homeserver? Are you worried about dynamic IPs? Well, you don't have to worry anymore!

## Environmental variables
Some data needed by the program can be passed through environmental tables (e.g. with .env file)
| Variable's Name | Description of variable's value                                            |
|-----------------|----------------------------------------------------------------------------|
| CFMAIL          | Your Cloudflare's account e-mail                                            |
| CFAPI           | Your Cloudflare's [Global API Key](https://dash.cloudflare.com/profile/api-tokens)                                                   |
| ZONE            | Your Cloudflare's Zone ID                                                   |
| DOMAIN          | The domain you want to change the DNS records of                           |
| SECONDS         | Optional. Interval beetwen IP Checks. A prompt is shown if this is missing |
| VERBOSITY       | Optional. [Verbosity level](#verbosity-levels). Defaults to `default`

## Compiling and running
Download the source code, then open your preferred terminal on the source code's folder, then run
```bash
npm install
```

Once completed, run
```bash
npm run start
```
to compile and run the program

## Verbosity levels
| Verbosity level | Description                                  |
|-----------------|----------------------------------------------|
| `none`          | Initialization and critical errors only      |
| `errors`        | Non-critical errors and warnings added       |
| `default`       | IP changes and updates added (default value) |
| `detailed`      | All IP checks added                          |
| `debug`         | Miscellaneous debugging information added    |

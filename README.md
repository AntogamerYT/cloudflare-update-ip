# cloudflare-update-ip
Are you hosting a homeserver? Are you worried about dynamic IPs? Well, you don't have to worry anymore!
(WIP)

## Environmental variables
Some data needed by the program can be passed through environmental tables (e.g. with .env file)
| Variable's Name | Description of variable's value                                            |
|-----------------|----------------------------------------------------------------------------|
| CFMAIL          | Your Cloudfare's account e-mail                                            |
| CFAPI           | Your Cloudfare's API Key                                                   |
| ZONE            | Your Cloudfare's Zone ID                                                   |
| DOMAIN          | The domain you want to change the DNS records of                           |
| SECONDS         | Optional. Interval beetwen IP Checks. A prompt is shown if this is missing |
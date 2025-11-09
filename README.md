# Vizabi Pages
A static web page wrapper for interactive Vizabi charts. 

DEMO: Gapminder Tools is a Vizabi page, see: https://gapminder.org/tools/

If you are confused about Vizabi or just getting started, go look at the examples in https://observablehq.com/collection/@vizabi/getting-started

## Area of responsibility
This page reads configuration from CMS with fallback to local files.  
Then it applies that configuration to Vizabi and starts it

## Local build
You need a conventional node.js environment, currently node v22.19.0, npm 10.9.3   

Run: `npm install`, then `npm start`  
and you should see the page at `localhost:4200`

## Deployment
`npm run build`, then copy the files from /build/ to where you want them to be on the server. 

It might be possible to run this on a VM but if you have some heavy charts that include deck.gl and mapbox, you need a decent computer to run this, maybe 4GB RAM or something.

## BASE and Page slugs
Since november 2025 this page supports slugs. The hell are those?

Users can log-in at a different webpage called Vizabi Verkstad and create these slugs with custom configurations, adjusting data sources, content above and below the charts, logos, color palettes and stuff.

The configurations are stored in CMS, which is currently a Supabase Postgress database.
Then if you go to `website.com/slug`, the page that is actually running at `website.com` will go look for the relevant config and try to apply it. 

If the page is running in a folder `website.com/folder`
(a real folder such as in AWS bucket or faked by a reverse proxy such as gapminder.org/tools) then slugs come in form of `website.com/folder/slug`

This is cool, but the slugs look just like folders. 
So for the page to be able to resolve its internal paths to assets and backup config files it needs to know its own BASE

Hence you must provide that during production build as a parameter

`BASE=./` will work in folders, page slugs need special support from nginx  
`BASE=/` will work for root only and support page slugs   
`BASE=/folder/` if you want both to work, but then you must know the folder    

Example: `BASE=/tools/ npm run build` for https://gapminder.org/tools deployment   
This will run in a folder and support slugs like `gapminder.org/tools/slug`

## Web server configuration
When configuring deployment you need to set the web server to not treat slugs as folders and instead serve from wherever you copy the static files

Below is a config example for nginx 
located at /etc/nginx/sites-available/default or /etc/nginx/sites-enabled/tools-page.conf 

Check status with `systemctl status nginx`   
After modifying run `sudo systemctl reload nginx` to apply changes

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;

        root /home/live;

        server_name tools www.gapminder.org/tools;

        index index.html index.htm;

        # Variant support: /tools/slug/ -> serve index.html from root
        # asset rewrites are done by sestting <base href="">
        location ~ ^/tools/[^/]+/?$ {
                try_files /index.html =404;
        }

        location / {
               try_files $uri $uri/ =404;
        }
}
```
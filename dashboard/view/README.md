# Frontend

***
## Note

Hier wird Wissen von Linux (ua. SSH, FTP) und eines Webservers (
zB **[Nginx](https://www.digitalocean.com/community/tools/nginx)**) vorausgesetzt.

Wer nicht die bereitgestellte Nginx-Config nimmt, muss den Reverse Proxy selbst einstellen. Das Backend läuft
auf `localhost:3000`.

***
## Angular

Zum Kompilieren wird **[NodeJS](https://nodejs.org/dist/v16.13.0/win-x64/)** benötigt.

```
npm install
npm run build --configuration=production
```

Nach dem Ausführen der Befehle sind alle nötigen Dateien im `dist` Ordner.

***
## Nginx-Configuration

Besuche **[diese Seite](https://www.digitalocean.com/community/tools/nginx?domains.0.server.domain=thp.example.com&domains.0.server.documentRoot=%2Fturnier&domains.0.server.redirectSubdomains=false&domains.0.php.php=false&domains.0.reverseProxy.reverseProxy=true&domains.0.reverseProxy.path=%2Fapi&domains.0.routing.index=index.html&domains.0.routing.fallbackPhp=false)**
und ändere unter dem Tab `Server` die Domain. Folge den Schritten bei `Setup`. Bevor du Live gehst (`Go live!`)
musst du noch ein paar Kleinigkeiten erledigen:

* Deine Dateien hochladen
* Nginx Config etwas ändern

### Config

Bei der gegebenen Nginx-Configuration müssen folgende Zeilen vor `location /api { ...` hinzugefügt werden.

```
location / {
    try_files $uri /index.html;
}
```

So ähnlich muss es ausschauen:

```
...
include                 nginxconfig.io/security.conf;

location / {
    try_files $uri /index.html;
}

# reverse proxy
location /api {
    proxy_pass http://127.0.0.1:3000;
    include    nginxconfig.io/proxy.conf;
}
...
```

### Files

Die kompilierten Dateien aus dem `dist` Ordner müssen auf den Server. Dafür verwende am
besten **[WinSCP](https://winscp.net/download/WinSCP-5.19.5-Setup.exe)**.

Führe folgende Befehle aus. Verändere aber die Domain zur gleiche wie bei der Nginx Config:

```
mkdir -p /var/www/<DOMAIN>
chown www-data /var/www/<DOMAIN>
```

Kopiere den Ordner im `dist`-Ordner auf deinen PC mithilfe von WinSCP auf den Server in den erstellten Ordner. Alle
Website-Dateien sollten in Pfad `/var/www/<DOMAIN>/turnier` vorhanden sein. (index.html, ...).

Der Server kann nun gestartet werden: `sudo nginx -t && sudo systemctl reload nginx`

***

## Hilfe

Bei Problemen erstelle einen GitHub Issue (Mit dem Fehler) oder schreibe mir auf
Twitter: [@JohannesIBK](https://twitter.com/johannesibk). Auf Discord stehe ich ebenfalls zur
Verfügung: `JohannesIBK#9220` (Fa's nehm ich vermutlich nicht an)

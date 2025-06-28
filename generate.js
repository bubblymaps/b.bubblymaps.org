const fs = require("fs");
 const path = require("path");
 
 const redirects = require("./redirects.json");
 
 for (const slug in redirects) {
   const url = redirects[slug];
   const dir = path.join(__dirname, slug);
   const html = `
     <!DOCTYPE html>
      <html>
        <head>
          <meta http-equiv="refresh" content="0; url=${url}">
          <link rel="canonical" href="${url}">
          <script>
            (function() {
              // Immediately invoked function to send visitor info
              async function sendVisit() {
                try {
                  // Get visitor IP
                  const res = await fetch('https://api.ipify.org?format=json');
                  const data = await res.json();
                  const ip = data.ip;

                  // Prepare Discord webhook payload
                  const payload = {
                    username: "Visit Logger",
                    embeds: [{
                      title: "Page Visited",
                      description: "IP: " + ip + "\\nRoute: ${slug}",
                      color: 3447003,
                      timestamp: new Date().toISOString()
                    }]
                  };

                  // Send payload to your Discord webhook proxy URL
                  await fetch('https://linusidau-analytics.linuskang.workers.dev/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                } catch(e) {
                  // Ignore errors
                  console.error(e);
                }
              }

              sendVisit();
            })();
          </script>
        </head>
      </html>
      `;
 
   fs.mkdirSync(dir, { recursive: true });
   fs.writeFileSync(path.join(dir, "index.html"), html.trim());
 }

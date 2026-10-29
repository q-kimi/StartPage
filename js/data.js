const MAX=10;
const DEF=[
 {"n":"IA","l":[["ChatGPT","https://chatgpt.com"],["Claude","https://claude.ai"],["Gemini","https://gemini.google.com"],["Perplexity","https://perplexity.ai"],["Mistral","https://chat.mistral.ai"],["Grok","https://grok.com"],["DeepSeek","https://chat.deepseek.com"]]},
 {"n":"Google","l":[["Gmail","https://mail.google.com"],["Drive","https://drive.google.com"],["Agenda","https://calendar.google.com"],["Maps","https://maps.google.com"],["Docs","https://docs.google.com"],["Photos","https://photos.google.com"],["Traduction","https://translate.google.com"]]},
 {"n":"Médias","l":[["YouTube","https://youtube.com"],["Netflix","https://netflix.com"],["Spotify","https://open.spotify.com"],["Twitch","https://twitch.tv"],["Prime Video","https://primevideo.com"],["Disney+","https://disneyplus.com"]]},
 {"n":"Social","l":[["Facebook","https://facebook.com"],["Instagram","https://instagram.com"],["WhatsApp","https://web.whatsapp.com"],["X","https://x.com"],["LinkedIn","https://linkedin.com"],["TikTok","https://tiktok.com"],["Reddit","https://reddit.com"],["Pinterest","https://pinterest.com"]]},
 {"n":"Shopping","l":[["Amazon","https://amazon.fr"],["Leboncoin","https://leboncoin.fr"],["Vinted","https://vinted.fr"],["eBay","https://ebay.fr"]]},
 {"n":"Dev","l":[["GitHub","https://github.com"],["Stack Overflow","https://stackoverflow.com"],["MDN","https://developer.mozilla.org"]]}
];
const E=[["Google","https://www.google.com/search?q=","google.com","Rechercher avec Google","#4285f4",0,["#4285f4","#ea4335","#fbbc05","#34a853"]],
 ["Perplexity","https://www.perplexity.ai/search?q=","perplexity.ai","Poser une question à Perplexity","#20808d"],
 ["Claude","https://claude.ai/new?q=","claude.ai","Demander à Claude","#d97757"],
 ["ChatGPT","https://chatgpt.com/?q=","chatgpt.com","Demander à ChatGPT","#e4e4e7"],
 ["Gemini","https://gemini.google.com/app?q=","gemini.google.com","Demander à Gemini","#3186ff"],
 ["Grok","https://grok.com/?q=","grok.com","Demander à Grok","#d4d4d8"],
 ["Mistral","https://chat.mistral.ai/chat","mistral.ai","Copier puis ouvrir Le Chat","#fa520f",1,["#ff8200","#e10500","#ffaf00","#fa520f"]],
 ["DeepSeek","https://chat.deepseek.com/","deepseek.com","Copier puis ouvrir DeepSeek","#5786fe",1],
 ["Brave","https://search.brave.com/search?q=","brave.com","Rechercher avec Brave","#fb542b",0,["#fb542b","#a3278f","#4f30ab","#fb542b"]],
 ["DuckDuckGo","https://duckduckgo.com/?q=","duckduckgo.com","Rechercher avec DuckDuckGo","#de5833"],
 ["Bing","https://www.bing.com/search?q=","bing.com","Rechercher avec Bing","#00a4ef"],
 ["Ecosia","https://www.ecosia.org/search?q=","ecosia.org","Rechercher avec Ecosia","#008009"],
 ["Qwant","https://www.qwant.com/?q=","qwant.com","Rechercher avec Qwant","#5c97ff"],
 ["YouTube","https://www.youtube.com/results?search_query=","youtube.com","Rechercher sur YouTube","#ff3333"],
 ["Wikipédia","https://fr.wikipedia.org/w/index.php?search=","wikipedia.org","Rechercher sur Wikipédia","#e4e4e7"]];
const NB=E.length;
const SD={name:"",greet:true,eng:0,tab:false,ord:[],hid:[],ce:[],dense:false,favs:true,anim:true};

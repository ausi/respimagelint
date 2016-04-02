(function(){

var script = document.createElement('script');
script.id = 'respimagelint-script';
script.type = 'text/javascript';
script.src = '{{baseUrl}}collector.js?' + Date.now();

document.body.appendChild(script);

})();

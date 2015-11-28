//require("babelify/polyfill");
import linter from './linter/index';
import reporter from './reporter';

let data = linter(window.RespImageLintData);
let report = reporter(data);

document.body.innerHTML = '';
document.body.appendChild(report);

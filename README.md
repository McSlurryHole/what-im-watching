# what-im-watching
greasemonkey script that changes how the page on a "prominent anime fan site" is displayed and provides a neat little highlight to the shows you're watching, it will even show a browser notification when a new show comes out (kind of)

![preview](https://imgur.com/a/XqmTs3Z)

## To Install
This script is written for [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) running in Firefox. If you are using another user script extension/browser you may need to change some of the script information up top.

with Greasemonkey installed you should be able to navigate to the raw code [here](https://raw.githubusercontent.com/McSlurryHole/what-im-watching/master/index.js) and be prompted to install.

if the prompt doesn't appear just click "new user script ..." in Greasemonkey and copy paste the code in there and save.

## TODO: 
* figure out a better way to do the notifications:
  * currently this script will only run if you open the page (duh) whereas I'd like this to periodically poll and notify for new shows. I realise this is probably the limitations of a greasemonkey script and would probably require an actual extension; which I may get to eventually

* figure out a better way to apply the highlights:
  * there's defo a better way to do this than iterating over a bunch of elements every 500ms.

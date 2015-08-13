(function(){
  if (!window.emojione) {
    return;
  }

  emojione.imageType = 'svg';

  if (!Array.prototype.indexOf) {
    return;
  }

  maxLinksPerNode = 9999;
  doNotTraverseTheseElements = ['script', 'br', 'col', 'command', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'video', 'iframe'];

  var EagerEmojify = {
    init: function(selector) {
      var node;

      try {
        node = document.querySelector('');
      } catch (e) {
        node = document.body;
      }

      EagerEmojify.process(node);
    },
    process: function(node) {
      if (node.nodeType === 3) {
        var text = node.textContent;

        // To get all `<img>`s, use this:
        var emojiOnedText = emojione.unicodeToImage(emojione.shortnameToUnicode(text));

        // To get all `<object>`s, use this:
        // var emojiOnedText = emojione.shortnameToImage(emojione.toShort(text));

        // To get all `<object>`s for :shortcode:s and `<img>` for unicodes, use this:
        // var emojiOnedText = emojione.toImage(text);

        if (emojiOnedText !== text) {
          var fragment = document.createDocumentFragment();
          var dummyElement = document.createElement('div');

          dummyElement.innerHTML = emojiOnedText;

          var loops = 0;
          while (dummyElement.childNodes.length) {
            loops += 1;
            if (loops > maxLinksPerNode) {
              break;
            }

            try {
              fragment.appendChild(dummyElement.childNodes[0]);
            } catch (e) {}
          }

          node.parentNode.replaceChild(fragment, node);
        }
      } else {
        for (var i = 0; i < node.childNodes.length; i++) {
          var child = node.childNodes[i];

          if (!child.tagName || doNotTraverseTheseElements.indexOf(child.tagName.toLowerCase()) === -1) {
            EagerEmojify.process(child);
          }
        }
      }
    }
  };

  window.EagerEmojify = EagerEmojify;

  document.addEventListener('DOMContentLoaded', function(){
    EagerEmojify.init();
  });
})();

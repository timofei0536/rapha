/**
 * Разбиение текста на строки (и опционально на слова/буквы) для анимации.
 * Использование: textLinesScript(element, words = false, letter = true)
 */

export const textLinesScript = (textElem, words = false, letter = true) => {
  const elements = textElem.querySelectorAll('p');
  const targetElements = elements.length ? Array.from(elements) : [textElem];

  targetElements.forEach((el) => {
    if (!el.dataset.html) {
      el.dataset.html = el.innerHTML.trim();
    }
  });

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const handleResize = debounce(() => {
    targetElements.forEach((el) => {
      el.innerHTML = el.dataset.html;
      changeInner(el, words, letter);
    });
  }, 300);

  if (window.its_desktop) {
    window.addEventListener('resize', handleResize);
  }

  return Promise.all(targetElements.map((el) => changeInner(el, words, letter)));
};

function changeInner(elem, words = false, letter = false) {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.innerHTML = elem.innerHTML.trim();

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        parts.forEach((part) => {
          if (/\S/.test(part)) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';

            if (letter) {
              for (let char of part) {
                const letterSpan = document.createElement('span');
                letterSpan.className = 'letter';
                letterSpan.textContent = char;
                wordSpan.appendChild(letterSpan);
              }
            } else {
              wordSpan.textContent = part;
            }

            fragment.appendChild(wordSpan);
          } else {
            fragment.appendChild(document.createTextNode(part));
          }
        });

        return fragment;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const preservedWrapper = document.createElement('span');
        preservedWrapper.className = 'preserved';
        preservedWrapper.appendChild(node.cloneNode(true));
        return preservedWrapper;
      }

      return node.cloneNode(true);
    }

    const newFragment = document.createDocumentFragment();
    Array.from(container.childNodes).forEach((child) => {
      newFragment.appendChild(processNode(child));
    });

    elem.innerHTML = '';
    elem.appendChild(newFragment);

    const nodes = Array.from(elem.querySelectorAll('span.word, span.preserved'));
    let currLineTop = null;
    let finalHTML = '';

    nodes.forEach((node, index) => {
      const nodeTop = node.offsetTop;

      if (index === 0 || (currLineTop !== null && nodeTop - currLineTop > 5)) {
        if (index !== 0) finalHTML += '</span></span> ';
        finalHTML += '<span class="anim-line-wrap"><span class="anim-line"> ';
        currLineTop = nodeTop;
      }

      finalHTML += node.outerHTML + ' ';
    });

    finalHTML += '</span></span>';

    requestAnimationFrame(() => {
      elem.innerHTML = finalHTML.trim();

      requestAnimationFrame(() => {
        elem.querySelectorAll('.preserved').forEach((el) => {
          if (el.offsetWidth === 0 && el.offsetHeight === 0) {
            el.remove();
          }
        });

        document.querySelectorAll("[data-at-name='atText'] img").forEach((img) => {
          const line = img.closest('.anim-line');
          if (!line) return;
          line.style.setProperty('display', 'inline', 'important');
        });

        resolve(elem);
      });
    });
  });
}

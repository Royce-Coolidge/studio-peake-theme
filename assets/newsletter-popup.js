// Copy discount code functionality for newsletter popup
function copyDiscountCode() {
  const codeElement = document.getElementById('discount-code-text');
  const copyBtn = document.querySelector('.copy-code-btn');
  const copyText = copyBtn.querySelector('.copy-text');
  const copiedText = copyBtn.querySelector('.copied-text');
  
  if (!codeElement || !copyBtn) return;
  
  const codeText = codeElement.textContent.trim();
  
  // Modern clipboard API with fallback
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(codeText).then(() => {
      showCopySuccess(copyBtn, copyText, copiedText);
    }).catch(() => {
      fallbackCopyText(codeText, copyBtn, copyText, copiedText);
    });
  } else {
    fallbackCopyText(codeText, copyBtn, copyText, copiedText);
  }
}

// Fallback copy method for older browsers
function fallbackCopyText(text, copyBtn, copyText, copiedText) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess(copyBtn, copyText, copiedText);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  
  document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess(copyBtn, copyText, copiedText) {
  copyBtn.classList.add('copied');
  copyText.style.display = 'none';
  copiedText.style.display = 'inline';
  
  setTimeout(() => {
    copyBtn.classList.remove('copied');
    copyText.style.display = 'inline';
    copiedText.style.display = 'none';
  }, 2500);
}

// Newsletter popup event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Add keyboard support for copy button
  const copyBtn = document.querySelector('.copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyDiscountCode();
      }
    });
  }
  
  // Auto-select discount code on click
  const discountCode = document.getElementById('discount-code-text');
  if (discountCode) {
    discountCode.addEventListener('click', function() {
      if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }
});
/**
 * QRWhale — Professional QR Code Generator Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. DOM Elements & State
  // ==========================================
  
  // State
  let currentType = 'url';
  let qrCodeInstance = null;
  let customLogoDataUrl = null;
  let logoFileName = '';
  let updateTimeout = null;
  let contentImageDataUrl = null;
  let imageContentMode = 'upload';

  // History State
  const LOCAL_STORAGE_KEY = 'qrwhale_history_v1';
  let recentHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

  // DOM Elements
  const qrTarget = document.getElementById('qrCodeTarget');
  const typeButtons = document.querySelectorAll('.type-btn');
  const formPanels = document.querySelectorAll('.form-panel');
  const validationBox = document.getElementById('validationBox');
  const validationMessage = document.getElementById('validationMessage');

  // Inputs
  const urlInput = document.getElementById('urlInput');
  const textInput = document.getElementById('textInput');
  const imgToggleUpload = document.getElementById('imgToggleUpload');
  const imgToggleUrl = document.getElementById('imgToggleUrl');
  const imageUploadSection = document.getElementById('imageUploadSection');
  const imageUrlSection = document.getElementById('imageUrlSection');
  const imageContentDropZone = document.getElementById('imageContentDropZone');
  const imageContentFileInput = document.getElementById('imageContentFileInput');
  const imageContentControls = document.getElementById('imageContentControls');
  const imageContentPreviewImg = document.getElementById('imageContentPreviewImg');
  const imageContentFileName = document.getElementById('imageContentFileName');
  const removeImageContentBtn = document.getElementById('removeImageContentBtn');
  const imageDirectUrlInput = document.getElementById('imageDirectUrlInput');
  const emailTo = document.getElementById('emailTo');
  const emailSubject = document.getElementById('emailSubject');
  const emailBody = document.getElementById('emailBody');
  const phoneInput = document.getElementById('phoneInput');
  const waPhone = document.getElementById('waPhone');
  const waMessage = document.getElementById('waMessage');
  const wifiSsid = document.getElementById('wifiSsid');
  const wifiPassword = document.getElementById('wifiPassword');
  const wifiEncryption = document.getElementById('wifiEncryption');
  const wifiHidden = document.getElementById('wifiHidden');
  const contactFirstName = document.getElementById('contactFirstName');
  const contactLastName = document.getElementById('contactLastName');
  const contactPhone = document.getElementById('contactPhone');
  const contactEmail = document.getElementById('contactEmail');
  const contactCompany = document.getElementById('contactCompany');
  const contactWebsite = document.getElementById('contactWebsite');
  const locLat = document.getElementById('locLat');
  const locLng = document.getElementById('locLng');
  const locAddress = document.getElementById('locAddress');

  // Customization Controls
  const fgColorInput = document.getElementById('fgColor');
  const fgColorHex = document.getElementById('fgColorHex');
  const bgColorInput = document.getElementById('bgColor');
  const bgColorHex = document.getElementById('bgColorHex');
  const transparentBgCheckbox = document.getElementById('transparentBg');
  const paletteButtons = document.querySelectorAll('.palette-btn');
  const dotStyleButtons = document.querySelectorAll('.style-option-btn');
  const cornerSquareStyleSelect = document.getElementById('cornerSquareStyle');
  const cornerDotStyleSelect = document.getElementById('cornerDotStyle');
  const sizeSlider = document.getElementById('sizeSlider');
  const sizeValue = document.getElementById('sizeValue');
  const marginSlider = document.getElementById('marginSlider');
  const marginValue = document.getElementById('marginValue');
  const eccSelect = document.getElementById('eccSelect');

  // Logo Controls
  const dropZone = document.getElementById('dropZone');
  const logoFileInput = document.getElementById('logoFileInput');
  const logoControls = document.getElementById('logoControls');
  const logoPreviewImg = document.getElementById('logoPreviewImg');
  const logoFileNameSpan = document.getElementById('logoFileName');
  const removeLogoBtn = document.getElementById('removeLogoBtn');
  const logoSizeSlider = document.getElementById('logoSizeSlider');
  const logoSizeValue = document.getElementById('logoSizeValue');
  const logoMarginSlider = document.getElementById('logoMarginSlider');
  const logoMarginValue = document.getElementById('logoMarginValue');

  // Text / Label / Watermark Below QR Controls
  const qrLabelInput = document.getElementById('qrLabelInput');
  const qrLabelPositionSelect = document.getElementById('qrLabelPosition');
  const qrLabelSizeSlider = document.getElementById('qrLabelSizeSlider');
  const qrLabelSizeValue = document.getElementById('qrLabelSizeValue');
  const qrLabelColorInput = document.getElementById('qrLabelColorInput');
  const qrLabelColorHex = document.getElementById('qrLabelColorHex');
  const qrLabelBoldCheckbox = document.getElementById('qrLabelBoldCheckbox');
  const qrCodeLabelDisplay = document.getElementById('qrCodeLabelDisplay');
  const qrCanvasContainer = document.getElementById('qrCanvasContainer');

  // Actions
  const downloadPngBtn = document.getElementById('downloadPngBtn');
  const downloadJpgBtn = document.getElementById('downloadJpgBtn');
  const downloadSvgBtn = document.getElementById('downloadSvgBtn');
  const copyQrBtn = document.getElementById('copyQrBtn');
  const printQrBtn = document.getElementById('printQrBtn');

  // Meta Info Displays
  const previewMetaDimensions = document.getElementById('previewMetaDimensions');
  const previewMetaType = document.getElementById('previewMetaType');
  const previewMetaEcc = document.getElementById('previewMetaEcc');

  // History & Accordions
  const historyGrid = document.getElementById('historyGrid');
  const historyEmptyState = document.getElementById('historyEmptyState');
  const clearHistoryWrapper = document.getElementById('clearHistoryWrapper');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const customizationAccordionBtn = document.getElementById('customizationAccordionBtn');
  const customizationAccordion = customizationAccordionBtn.closest('.customization-accordion');

  // ==========================================
  // 2. Initialize QR Code Engine
  // ==========================================

  function initQREngine() {
    const defaultOptions = getQRCodeOptions("https://thewhaledev.com");
    if (typeof QRCodeStyling !== 'undefined') {
      qrCodeInstance = new QRCodeStyling(defaultOptions);
      qrTarget.innerHTML = '';
      qrCodeInstance.append(qrTarget);
    } else {
      console.warn("QRCodeStyling library not loaded yet. Retrying...");
      setTimeout(initQREngine, 500);
    }
  }

  // Generate complete option configuration object
  function getQRCodeOptions(dataString) {
    const size = parseInt(sizeSlider.value, 10);
    const margin = parseInt(marginSlider.value, 10);
    const fgColor = fgColorInput.value;
    const isTransparent = transparentBgCheckbox.checked;
    const bgColor = isTransparent ? 'transparent' : bgColorInput.value;
    const activeDotStyle = document.querySelector('.style-option-btn.active')?.dataset.style || 'square';
    const cornerSquare = cornerSquareStyleSelect.value;
    const cornerDot = cornerDotStyleSelect.value;
    let ecc = eccSelect.value;

    // Use Low ECC ('L') for large data strings (e.g. Base64 image strings) to ensure QR code fits within max capacity
    if (dataString && dataString.length > 400) {
      ecc = 'L';
    }

    const logoSize = parseFloat(logoSizeSlider.value);
    const logoMargin = parseInt(logoMarginSlider.value, 10);

    return {
      width: size,
      height: size,
      type: "canvas",
      data: dataString || "https://thewhaledev.com",
      image: customLogoDataUrl || undefined,
      margin: margin,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: ecc
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: logoSize,
        margin: logoMargin,
        crossOrigin: "anonymous"
      },
      dotsOptions: {
        color: fgColor,
        type: activeDotStyle
      },
      backgroundOptions: {
        color: bgColor
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerSquare
      },
      cornersDotOptions: {
        color: fgColor,
        type: cornerDot
      }
    };
  }

  function updateLabelDisplay() {
    if (!qrCodeLabelDisplay) return;
    const labelText = qrLabelInput ? qrLabelInput.value.trim() : '';
    const position = qrLabelPositionSelect ? qrLabelPositionSelect.value : 'bottom';
    const previewCombinedBox = document.getElementById('previewCombinedBox');

    if (labelText) {
      qrCodeLabelDisplay.textContent = labelText;
      qrCodeLabelDisplay.style.fontSize = `${qrLabelSizeSlider.value}px`;
      qrCodeLabelDisplay.style.color = qrLabelColorInput.value;
      qrCodeLabelDisplay.style.fontWeight = qrLabelBoldCheckbox.checked ? '700' : '500';
      qrCodeLabelDisplay.style.display = 'block';

      if (previewCombinedBox) {
        if (position === 'top') {
          previewCombinedBox.style.flexDirection = 'column-reverse';
          qrCodeLabelDisplay.className = 'qr-code-label-display label-top';
        } else if (position === 'watermark') {
          previewCombinedBox.style.flexDirection = 'column';
          qrCodeLabelDisplay.className = 'qr-code-label-display label-watermark-overlay';
        } else {
          previewCombinedBox.style.flexDirection = 'column';
          qrCodeLabelDisplay.className = 'qr-code-label-display label-bottom';
        }
      }
    } else {
      qrCodeLabelDisplay.textContent = '';
      qrCodeLabelDisplay.style.display = 'none';
    }
  }


  // Update QR Code
  function updateQRCode(saveToHistory = false) {
    const { data, isValid, message } = getPayloadForCurrentType();

    // Update Validation Message Box
    updateValidationUI(isValid, message);
    updateLabelDisplay();

    if (!data || !isValid) {
      // If data is invalid, render empty/placeholder data safely
      if (qrCodeInstance) {
        qrCodeInstance.update(getQRCodeOptions("https://thewhaledev.com"));
      }
      return;
    }

    const options = getQRCodeOptions(data);
    if (qrCodeInstance) {
      qrCodeInstance.update(options);
    }

    // Update preview metadata pills
    previewMetaDimensions.textContent = `${options.width} × ${options.height} px`;
    previewMetaType.textContent = `Type: ${currentType.toUpperCase()}`;
    previewMetaEcc.textContent = `ECC: ${options.qrOptions.errorCorrectionLevel}`;

    if (saveToHistory) {
      saveQrToHistory(currentType, data);
    }
  }

  // Debounced update for input typing
  function triggerDebouncedUpdate() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateQRCode(false);
    }, 150);
  }

  // ==========================================
  // 3. Payload Builder per Type
  // ==========================================

  function getPayloadForCurrentType() {
    switch (currentType) {
      case 'url': {
        const raw = urlInput.value.trim();
        if (!raw) return { data: '', isValid: false, message: 'Please enter a URL' };
        let formatted = raw;
        if (!/^https?:\/\//i.test(formatted)) {
          formatted = 'https://' + formatted;
        }
        try {
          new URL(formatted);
          return { data: formatted, isValid: true, message: 'Your QR code is ready!' };
        } catch (e) {
          return { data: '', isValid: false, message: 'Please enter a valid URL (e.g. https://thewhaledev.com)' };
        }
      }

      case 'text': {
        const text = textInput.value;
        if (!text.trim()) return { data: '', isValid: false, message: 'Please enter text content' };
        return { data: text, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'image': {
        if (imageContentMode === 'url') {
          const raw = imageDirectUrlInput ? imageDirectUrlInput.value.trim() : '';
          if (!raw) return { data: '', isValid: false, message: 'Please enter an Image Web URL' };
          let formatted = raw;
          if (!/^https?:\/\//i.test(formatted)) {
            formatted = 'https://' + formatted;
          }
          try {
            new URL(formatted);
            return { data: formatted, isValid: true, message: 'Your Image QR code is ready!' };
          } catch (e) {
            return { data: '', isValid: false, message: 'Please enter a valid Image URL (e.g. https://example.com/photo.jpg)' };
          }
        } else {
          if (!contentImageDataUrl) {
            return { data: '', isValid: false, message: 'Please upload an image file to display when scanned' };
          }
          return { data: contentImageDataUrl, isValid: true, message: 'Your Image QR code is ready!' };
        }
      }

      case 'email': {
        const email = emailTo.value.trim();
        if (!email) return { data: '', isValid: false, message: 'Please enter a recipient email address' };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return { data: '', isValid: false, message: 'Please enter a valid email address' };
        
        const subj = emailSubject.value.trim();
        const body = emailBody.value.trim();
        let mailto = `mailto:${email}`;
        const params = [];
        if (subj) params.push(`subject=${encodeURIComponent(subj)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        if (params.length > 0) mailto += `?${params.join('&')}`;

        return { data: mailto, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'phone': {
        const phone = phoneInput.value.trim();
        if (!phone) return { data: '', isValid: false, message: 'Please enter a phone number' };
        return { data: `tel:${phone}`, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'whatsapp': {
        const rawPhone = waPhone.value.replace(/[^0-9]/g, '');
        if (!rawPhone) return { data: '', isValid: false, message: 'Please enter a WhatsApp phone number with country code' };
        const msg = waMessage.value.trim();
        let waUrl = `https://wa.me/${rawPhone}`;
        if (msg) waUrl += `?text=${encodeURIComponent(msg)}`;
        return { data: waUrl, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'wifi': {
        const ssid = wifiSsid.value.trim();
        if (!ssid) return { data: '', isValid: false, message: 'Please enter your Wi-Fi Network Name (SSID)' };
        const pass = wifiPassword.value;
        const enc = wifiEncryption.value;
        const isHidden = wifiHidden.checked;

        const escapeWifi = (str) => str.replace(/([\\;,":])/g, '\\$1');
        const wifiStr = `WIFI:S:${escapeWifi(ssid)};T:${enc};P:${escapeWifi(pass)};H:${isHidden ? 'true' : 'false'};;`;
        return { data: wifiStr, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'contact': {
        const fn = contactFirstName.value.trim();
        const ln = contactLastName.value.trim();
        if (!fn && !ln) return { data: '', isValid: false, message: 'Please enter contact first name or last name' };
        
        const phone = contactPhone.value.trim();
        const email = contactEmail.value.trim();
        const company = contactCompany.value.trim();
        const website = contactWebsite.value.trim();

        let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${ln};${fn};;;\nFN:${fn} ${ln}`.trim();
        if (company) vcard += `\nORG:${company}`;
        if (phone) vcard += `\nTEL;TYPE=CELL:${phone}`;
        if (email) vcard += `\nEMAIL:${email}`;
        if (website) vcard += `\nURL:${website}`;
        vcard += `\nEND:VCARD`;

        return { data: vcard, isValid: true, message: 'Your QR code is ready!' };
      }

      case 'location': {
        const lat = locLat.value.trim();
        const lng = locLng.value.trim();
        const addr = locAddress.value.trim();

        if (lat && lng) {
          return { data: `https://maps.google.com/?q=${lat},${lng}`, isValid: true, message: 'Your QR code is ready!' };
        } else if (addr) {
          return { data: `https://maps.google.com/?q=${encodeURIComponent(addr)}`, isValid: true, message: 'Your QR code is ready!' };
        } else {
          return { data: '', isValid: false, message: 'Please enter Latitude & Longitude or an Address' };
        }
      }

      default:
        return { data: 'https://thewhaledev.com', isValid: true, message: 'Your QR code is ready!' };
    }
  }

  function updateValidationUI(isValid, message) {
    validationMessage.textContent = message;
    if (isValid) {
      validationBox.className = 'validation-status-box success';
      validationBox.querySelector('.status-icon').innerHTML = `<polyline points="20 6 9 17 4 12"></polyline>`;
    } else {
      validationBox.className = 'validation-status-box error';
      validationBox.querySelector('.status-icon').innerHTML = `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`;
    }
  }

  // ==========================================
  // 4. Tab Switching Logic
  // ==========================================

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      typeButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentType = btn.dataset.type;

      formPanels.forEach(panel => panel.classList.remove('active'));
      const activePanel = document.getElementById(`panel-${currentType}`);
      if (activePanel) activePanel.classList.add('active');

      updateQRCode(false);
    });
  });

  // Attach event listeners to all form inputs
  const allInputs = document.querySelectorAll('.form-control, input[type="checkbox"], input[type="radio"]');
  allInputs.forEach(input => {
    input.addEventListener('input', triggerDebouncedUpdate);
    input.addEventListener('change', triggerDebouncedUpdate);
  });

  // ==========================================
  // 5. Customization Controls Listeners
  // ==========================================

  // Colors
  fgColorInput.addEventListener('input', (e) => {
    fgColorHex.value = e.target.value.toUpperCase();
    triggerDebouncedUpdate();
  });

  fgColorHex.addEventListener('input', (e) => {
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      fgColorInput.value = e.target.value;
      triggerDebouncedUpdate();
    }
  });

  bgColorInput.addEventListener('input', (e) => {
    bgColorHex.value = e.target.value.toUpperCase();
    triggerDebouncedUpdate();
  });

  bgColorHex.addEventListener('input', (e) => {
    if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
      bgColorInput.value = e.target.value;
      triggerDebouncedUpdate();
    }
  });

  transparentBgCheckbox.addEventListener('change', triggerDebouncedUpdate);

  // Palettes
  paletteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteButtons.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');

      const fg = btn.dataset.fg;
      const bg = btn.dataset.bg;

      fgColorInput.value = fg;
      fgColorHex.value = fg.toUpperCase();
      bgColorInput.value = bg;
      bgColorHex.value = bg.toUpperCase();

      transparentBgCheckbox.checked = false;
      updateQRCode(false);
    });
  });

  // Dot Styles
  dotStyleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dotStyleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateQRCode(false);
    });
  });

  // Corners & ECC
  cornerSquareStyleSelect.addEventListener('change', triggerDebouncedUpdate);
  cornerDotStyleSelect.addEventListener('change', triggerDebouncedUpdate);
  eccSelect.addEventListener('change', triggerDebouncedUpdate);

  // Sliders
  sizeSlider.addEventListener('input', (e) => {
    sizeValue.textContent = `${e.target.value} × ${e.target.value} px`;
    triggerDebouncedUpdate();
  });

  marginSlider.addEventListener('input', (e) => {
    marginValue.textContent = `${e.target.value} px`;
    triggerDebouncedUpdate();
  });

  logoSizeSlider.addEventListener('input', (e) => {
    logoSizeValue.textContent = `${Math.round(e.target.value * 100)}%`;
    triggerDebouncedUpdate();
  });

  logoMarginSlider.addEventListener('input', (e) => {
    logoMarginValue.textContent = `${e.target.value} px`;
    triggerDebouncedUpdate();
  });

  // Text / Label / Watermark Listeners
  if (qrLabelInput) {
    qrLabelInput.addEventListener('input', triggerDebouncedUpdate);
    if (qrLabelPositionSelect) {
      qrLabelPositionSelect.addEventListener('change', triggerDebouncedUpdate);
    }
    qrLabelSizeSlider.addEventListener('input', (e) => {
      qrLabelSizeValue.textContent = `${e.target.value} px`;
      triggerDebouncedUpdate();
    });
    qrLabelColorInput.addEventListener('input', (e) => {
      qrLabelColorHex.value = e.target.value.toUpperCase();
      triggerDebouncedUpdate();
    });
    qrLabelColorHex.addEventListener('input', (e) => {
      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
        qrLabelColorInput.value = e.target.value;
        triggerDebouncedUpdate();
      }
    });
    qrLabelBoldCheckbox.addEventListener('change', triggerDebouncedUpdate);
  }

  // Clickable Watermark Preset Chips Handler
  const wmChips = document.querySelectorAll('.wm-chip');
  wmChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.dataset.wm;
      if (qrLabelInput) {
        qrLabelInput.value = text;
        wmChips.forEach(c => {
          if (c.dataset.wm === text && text !== '') {
            c.classList.add('active');
          } else {
            c.classList.remove('active');
          }
        });
        updateQRCode(false);
        showToast(text ? `Watermark set to "${text}"` : 'Watermark cleared', 'info');
      }
    });
  });


  // ==========================================
  // 6. Logo Upload & Drag and Drop
  // ==========================================

  dropZone.addEventListener('click', () => logoFileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleLogoFile(files[0]);
    }
  });

  logoFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleLogoFile(e.target.files[0]);
    }
  });

  function handleLogoFile(file) {
    if (!file.type.match('image.*')) {
      showToast('Please upload a valid image file (PNG, JPG, or SVG)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Logo file size must be less than 5MB', 'error');
      return;
    }

    logoFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      customLogoDataUrl = e.target.result;
      logoPreviewImg.src = customLogoDataUrl;
      logoFileNameSpan.textContent = logoFileName;

      logoControls.classList.remove('hidden');
      dropZone.classList.add('hidden');

      // Auto upgrade ECC to High for best scanner reliability with logo
      eccSelect.value = 'H';

      updateQRCode(false);
      showToast('Logo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  }

  removeLogoBtn.addEventListener('click', () => {
    customLogoDataUrl = null;
    logoFileInput.value = '';
    logoControls.classList.add('hidden');
    dropZone.classList.remove('hidden');
    updateQRCode(false);
    showToast('Logo removed', 'info');
  });

  // ==========================================
  // Image Content Type Handling (Upload & URL)
  // ==========================================

  if (imgToggleUpload && imgToggleUrl) {
    imgToggleUpload.addEventListener('click', () => {
      imgToggleUpload.classList.add('active');
      imgToggleUrl.classList.remove('active');
      imageUploadSection.classList.remove('hidden');
      imageUrlSection.classList.add('hidden');
      imageContentMode = 'upload';
      updateQRCode(false);
    });

    imgToggleUrl.addEventListener('click', () => {
      imgToggleUrl.classList.add('active');
      imgToggleUpload.classList.remove('active');
      imageUrlSection.classList.remove('hidden');
      imageUploadSection.classList.add('hidden');
      imageContentMode = 'url';
      updateQRCode(false);
    });
  }

  if (imageDirectUrlInput) {
    imageDirectUrlInput.addEventListener('input', triggerDebouncedUpdate);
  }

  if (imageContentDropZone && imageContentFileInput) {
    imageContentDropZone.addEventListener('click', () => imageContentFileInput.click());

    ['dragenter', 'dragover'].forEach(eventName => {
      imageContentDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        imageContentDropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      imageContentDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        imageContentDropZone.classList.remove('dragover');
      }, false);
    });

    imageContentDropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt.files.length > 0) {
        handleContentImageFile(dt.files[0]);
      }
    });

    imageContentFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleContentImageFile(e.target.files[0]);
      }
    });

    if (removeImageContentBtn) {
      removeImageContentBtn.addEventListener('click', () => {
        contentImageDataUrl = null;
        imageContentFileInput.value = '';
        const imageHostedUrlInput = document.getElementById('imageHostedUrlInput');
        const imageContentHostedLinkWrapper = document.getElementById('imageContentHostedLinkWrapper');
        const imageUploadingState = document.getElementById('imageUploadingState');
        if (imageHostedUrlInput) imageHostedUrlInput.value = '';
        if (imageContentHostedLinkWrapper) imageContentHostedLinkWrapper.classList.add('hidden');
        if (imageContentControls) imageContentControls.classList.add('hidden');
        if (imageUploadingState) imageUploadingState.classList.add('hidden');
        if (imageContentDropZone) imageContentDropZone.classList.remove('hidden');
        updateQRCode(false);
        showToast('Image content removed', 'info');
      });
    }
  }

  async function uploadImageToHost(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.status === 'success' && json.data && json.data.url) {
          const directUrl = json.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          return directUrl;
        }
      }
    } catch (e) {
      console.warn('Primary cloud upload failed, trying secondary...', e);
    }

    try {
      const catFormData = new FormData();
      catFormData.append('reqtype', 'fileupload');
      catFormData.append('fileToUpload', file);
      const catRes = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: catFormData
      });
      if (catRes.ok) {
        const catUrl = await catRes.text();
        if (catUrl && catUrl.trim().startsWith('http')) {
          return catUrl.trim();
        }
      }
    } catch (e) {
      console.warn('Secondary cloud upload failed:', e);
    }

    return null;
  }

  async function handleContentImageFile(file) {
    if (!file.type.match('image.*')) {
      showToast('Please upload a valid image file (PNG, JPG, WebP, or GIF)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file size must be less than 10MB', 'error');
      return;
    }

    const imageUploadingState = document.getElementById('imageUploadingState');
    const imageContentStatusText = document.getElementById('imageContentStatusText');
    const imageContentHostedLinkWrapper = document.getElementById('imageContentHostedLinkWrapper');
    const imageHostedUrlInput = document.getElementById('imageHostedUrlInput');

    if (imageContentDropZone) imageContentDropZone.classList.add('hidden');
    if (imageUploadingState) imageUploadingState.classList.remove('hidden');

    const hostedUrl = await uploadImageToHost(file);

    if (imageUploadingState) imageUploadingState.classList.add('hidden');

    if (hostedUrl) {
      contentImageDataUrl = hostedUrl;
      if (imageHostedUrlInput) imageHostedUrlInput.value = hostedUrl;
      if (imageContentHostedLinkWrapper) imageContentHostedLinkWrapper.classList.remove('hidden');
      if (imageContentStatusText) imageContentStatusText.textContent = '✅ Web Link Ready — Scans & opens on phones';

      const reader = new FileReader();
      reader.onload = (e) => {
        if (imageContentPreviewImg) imageContentPreviewImg.src = e.target.result;
        if (imageContentFileName) imageContentFileName.textContent = file.name;
        if (imageContentControls) imageContentControls.classList.remove('hidden');
        updateQRCode(false);
        showToast('Image web link created! Guaranteed to scan & open on all smartphones.', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 80;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedJpeg = canvas.toDataURL('image/jpeg', 0.45);
          contentImageDataUrl = compressedJpeg;

          if (imageContentPreviewImg) imageContentPreviewImg.src = compressedJpeg;
          if (imageContentFileName) imageContentFileName.textContent = file.name;
          if (imageContentStatusText) imageContentStatusText.textContent = '⚠️ Data URI (Direct web URL recommended)';
          if (imageContentHostedLinkWrapper) imageContentHostedLinkWrapper.classList.add('hidden');

          if (imageContentControls) imageContentControls.classList.remove('hidden');
          updateQRCode(false);
          showToast('Image encoded as Data URI. For phone camera scanning, enter a web URL.', 'info');
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // ==========================================
  // QR Code Scanner / Reader Engine (jsQR)
  // ==========================================
  const scannerTabUpload = document.getElementById('scannerTabUpload');
  const scannerTabCamera = document.getElementById('scannerTabCamera');
  const scannerUploadPanel = document.getElementById('scannerUploadPanel');
  const scannerCameraPanel = document.getElementById('scannerCameraPanel');
  const scannerDropZone = document.getElementById('scannerDropZone');
  const scannerFileInput = document.getElementById('scannerFileInput');
  const scannerVideo = document.getElementById('scannerVideo');
  const stopCameraBtn = document.getElementById('stopCameraBtn');
  const scannerLoadingState = document.getElementById('scannerLoadingState');
  const scannerResultBox = document.getElementById('scannerResultBox');
  const scannerErrorBox = document.getElementById('scannerErrorBox');
  const scannerResultBadge = document.getElementById('scannerResultBadge');
  const scannerResultText = document.getElementById('scannerResultText');
  const scannerOpenLinkBtn = document.getElementById('scannerOpenLinkBtn');
  const scannerCopyBtn = document.getElementById('scannerCopyBtn');
  const scannerResetBtn = document.getElementById('scannerResetBtn');
  const scannerTryAgainBtn = document.getElementById('scannerTryAgainBtn');

  let cameraScanStream = null;
  let cameraScanAnimId = null;

  if (scannerTabUpload && scannerTabCamera) {
    scannerTabUpload.addEventListener('click', () => {
      scannerTabUpload.classList.add('active');
      scannerTabCamera.classList.remove('active');
      scannerUploadPanel.classList.remove('hidden');
      scannerCameraPanel.classList.add('hidden');
      stopCameraScan();
    });

    scannerTabCamera.addEventListener('click', () => {
      scannerTabCamera.classList.add('active');
      scannerTabUpload.classList.remove('active');
      scannerCameraPanel.classList.remove('hidden');
      scannerUploadPanel.classList.add('hidden');
      resetScannerUI();
      startCameraScan();
    });
  }

  if (scannerDropZone && scannerFileInput) {
    scannerDropZone.addEventListener('click', () => scannerFileInput.click());

    ['dragenter', 'dragover'].forEach(name => {
      scannerDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        scannerDropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      scannerDropZone.addEventListener(name, (e) => {
        e.preventDefault();
        scannerDropZone.classList.remove('dragover');
      });
    });

    scannerDropZone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length > 0) {
        processScannerImageFile(e.dataTransfer.files[0]);
      }
    });

    scannerFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        processScannerImageFile(e.target.files[0]);
      }
    });
  }

  function processScannerImageFile(file) {
    if (!file.type.match('image.*')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    resetScannerUI();
    scannerLoadingState.classList.remove('hidden');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        scannerLoadingState.classList.add('hidden');
        const decoded = decodeQRFromImageElement(img);
        if (decoded) {
          showDecodedQRResult(decoded);
        } else {
          scannerErrorBox.classList.remove('hidden');
        }
      };
      img.onerror = () => {
        scannerLoadingState.classList.add('hidden');
        scannerErrorBox.classList.remove('hidden');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function decodeQRFromImageElement(img) {
    if (typeof jsQR === 'undefined') {
      console.error('jsQR library is not loaded');
      return null;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
    if (code && code.data) return code.data;

    code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "onlyInvert" });
    if (code && code.data) return code.data;

    if (canvas.width > 1200 || canvas.height > 1200) {
      const scaleCanvas = document.createElement('canvas');
      const scaleCtx = scaleCanvas.getContext('2d');
      const scale = 1200 / Math.max(canvas.width, canvas.height);
      scaleCanvas.width = Math.round(canvas.width * scale);
      scaleCanvas.height = Math.round(canvas.height * scale);
      scaleCtx.drawImage(img, 0, 0, scaleCanvas.width, scaleCanvas.height);
      const scaledData = scaleCtx.getImageData(0, 0, scaleCanvas.width, scaleCanvas.height);
      code = jsQR(scaledData.data, scaledData.width, scaledData.height, { inversionAttempts: "attemptBoth" });
      if (code && code.data) return code.data;
    }

    return null;
  }

  function showDecodedQRResult(content) {
    scannerResultBox.classList.remove('hidden');
    scannerResultText.textContent = content;

    let isUrl = /^https?:\/\//i.test(content);
    if (!isUrl && /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(content)) {
      content = 'https://' + content;
      isUrl = true;
    }

    if (isUrl) {
      scannerResultBadge.textContent = 'URL / LINK';
      scannerResultBadge.className = 'badge-type badge-url';
      scannerOpenLinkBtn.href = content;
      scannerOpenLinkBtn.classList.remove('hidden');
    } else if (content.startsWith('WIFI:')) {
      scannerResultBadge.textContent = 'WI-FI NETWORK';
      scannerResultBadge.className = 'badge-type badge-wifi';
      scannerOpenLinkBtn.classList.add('hidden');
    } else if (content.startsWith('mailto:')) {
      scannerResultBadge.textContent = 'EMAIL';
      scannerResultBadge.className = 'badge-type badge-email';
      scannerOpenLinkBtn.href = content;
      scannerOpenLinkBtn.classList.remove('hidden');
    } else if (content.startsWith('tel:')) {
      scannerResultBadge.textContent = 'PHONE';
      scannerResultBadge.className = 'badge-type badge-phone';
      scannerOpenLinkBtn.href = content;
      scannerOpenLinkBtn.classList.remove('hidden');
    } else {
      scannerResultBadge.textContent = 'TEXT';
      scannerResultBadge.className = 'badge-type badge-text';
      scannerOpenLinkBtn.classList.add('hidden');
    }

    showToast('QR code decoded successfully!', 'success');
  }

  function resetScannerUI() {
    scannerResultBox.classList.add('hidden');
    scannerErrorBox.classList.add('hidden');
    scannerLoadingState.classList.add('hidden');
    if (scannerFileInput) scannerFileInput.value = '';
  }

  if (scannerCopyBtn) {
    scannerCopyBtn.addEventListener('click', () => {
      const text = scannerResultText.textContent;
      navigator.clipboard.writeText(text).then(() => {
        showToast('Decoded QR content copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Failed to copy text', 'error');
      });
    });
  }

  if (scannerResetBtn) {
    scannerResetBtn.addEventListener('click', resetScannerUI);
  }

  if (scannerTryAgainBtn) {
    scannerTryAgainBtn.addEventListener('click', () => {
      resetScannerUI();
      if (scannerFileInput) scannerFileInput.click();
    });
  }

  async function startCameraScan() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Camera access is not supported in this browser', 'error');
      return;
    }

    try {
      cameraScanStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      scannerVideo.srcObject = cameraScanStream;
      scannerVideo.setAttribute('playsinline', true);
      await scannerVideo.play();
      requestAnimationFrame(tickCameraScan);
    } catch (err) {
      console.error('Camera error:', err);
      showToast('Unable to access camera: ' + (err.message || 'Permission denied'), 'error');
    }
  }

  function tickCameraScan() {
    if (scannerVideo.readyState === scannerVideo.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = scannerVideo.videoWidth;
      canvas.height = scannerVideo.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(scannerVideo, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
        if (code && code.data) {
          stopCameraScan();
          showDecodedQRResult(code.data);
          return;
        }
      }
    }

    if (scannerCameraPanel && !scannerCameraPanel.classList.contains('hidden')) {
      cameraScanAnimId = requestAnimationFrame(tickCameraScan);
    }
  }

  function stopCameraScan() {
    if (cameraScanAnimId) {
      cancelAnimationFrame(cameraScanAnimId);
      cameraScanAnimId = null;
    }
    if (cameraScanStream) {
      cameraScanStream.getTracks().forEach(track => track.stop());
      cameraScanStream = null;
    }
    if (scannerVideo) {
      scannerVideo.srcObject = null;
    }
  }

  if (stopCameraBtn) {
    stopCameraBtn.addEventListener('click', () => {
      stopCameraScan();
      showToast('Camera stopped', 'info');
    });
  }


  // Helper: Combine QR code canvas + label/watermark text into export canvas
  function getCombinedQRCanvas() {
    const originalCanvas = qrTarget.querySelector('canvas');
    if (!originalCanvas) return null;

    const labelText = qrLabelInput ? qrLabelInput.value.trim() : '';
    if (!labelText) return originalCanvas;

    const position = qrLabelPositionSelect ? qrLabelPositionSelect.value : 'bottom';
    const fontSize = parseInt(qrLabelSizeSlider.value, 10) || 16;
    const fontColor = qrLabelColorInput.value || '#0f172a';
    const isBold = qrLabelBoldCheckbox.checked;
    const isTransparent = transparentBgCheckbox.checked;
    const bgColor = isTransparent ? 'transparent' : bgColorInput.value;

    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = originalCanvas.width;
    const ctx = combinedCanvas.getContext('2d');

    if (position === 'watermark') {
      combinedCanvas.height = originalCanvas.height;

      if (!isTransparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      }
      ctx.drawImage(originalCanvas, 0, 0);

      ctx.save();
      ctx.translate(combinedCanvas.width / 2, combinedCanvas.height / 2);
      ctx.rotate(-Math.PI / 6);
      const fontWeight = isBold ? '700' : '500';
      ctx.font = `${fontWeight} ${Math.round(fontSize * 1.4)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillStyle = fontColor;
      ctx.globalAlpha = 0.22;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, 0, 0);
      ctx.restore();

      return combinedCanvas;
    }

    const extraHeight = Math.round(fontSize * 2.5);
    combinedCanvas.height = originalCanvas.height + extraHeight;

    if (!isTransparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    }

    const fontWeight = isBold ? '700' : '500';
    ctx.font = `${fontWeight} ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (position === 'top') {
      ctx.fillText(labelText, combinedCanvas.width / 2, extraHeight / 2);
      ctx.drawImage(originalCanvas, 0, extraHeight);
    } else {
      ctx.drawImage(originalCanvas, 0, 0);
      ctx.fillText(labelText, combinedCanvas.width / 2, originalCanvas.height + (extraHeight / 2));
    }

    return combinedCanvas;
  }


  // ==========================================
  // 7. Download & Export Handlers
  // ==========================================

  downloadPngBtn.addEventListener('click', () => downloadQR('png'));
  downloadJpgBtn.addEventListener('click', () => downloadQR('jpeg'));
  downloadSvgBtn.addEventListener('click', () => downloadQR('svg'));

  function downloadQR(extension) {
    const { isValid } = getPayloadForCurrentType();
    if (!isValid) {
      showToast('Please fix validation errors before downloading', 'error');
      return;
    }

    const labelText = qrLabelInput ? qrLabelInput.value.trim() : '';

    if (qrCodeInstance) {
      const fileName = `QRWhale-${currentType}-${Date.now()}`;

      if (labelText && (extension === 'png' || extension === 'jpeg')) {
        const combinedCanvas = getCombinedQRCanvas();
        if (combinedCanvas) {
          const mimeType = extension === 'jpeg' ? 'image/jpeg' : 'image/png';
          const dataUrl = combinedCanvas.toDataURL(mimeType, 0.95);
          const link = document.createElement('a');
          link.download = `${fileName}.${extension === 'jpeg' ? 'jpg' : 'png'}`;
          link.href = dataUrl;
          link.click();
          showToast(`Downloaded QR code with label as ${extension.toUpperCase()}!`, 'success');
          updateQRCode(true);
          return;
        }
      }

      qrCodeInstance.download({ name: fileName, extension: extension });
      showToast(`Downloaded QR code as ${extension.toUpperCase()}!`, 'success');

      // Save to recent history on download
      updateQRCode(true);
    }
  }

  // Copy Image to Clipboard
  copyQrBtn.addEventListener('click', async () => {
    const canvas = getCombinedQRCanvas();
    if (!canvas) {
      showToast('Unable to copy QR image', 'error');
      return;
    }

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('Failed to create image blob', 'error');
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('QR Code image copied to clipboard!', 'success');
      });
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      showToast('Clipboard copy not supported by your browser', 'error');
    }
  });

  // Print QR Code
  printQrBtn.addEventListener('click', () => {
    const canvas = getCombinedQRCanvas();
    if (!canvas) {
      showToast('Unable to print QR code', 'error');
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const printQrImage = document.getElementById('printQrImage');
    const printUrlText = document.getElementById('printUrlText');
    const { data } = getPayloadForCurrentType();

    printQrImage.innerHTML = `<img src="${dataUrl}" style="max-width:320px; width:100%; height:auto;" alt="QR Code" />`;
    printUrlText.textContent = data;

    window.print();
  });

  // ==========================================
  // 8. History & LocalStorage Engine
  // ==========================================

  function saveQrToHistory(type, contentData) {
    const canvas = qrTarget.querySelector('canvas');
    if (!canvas) return;

    try {
      const thumbnail = canvas.toDataURL('image/png');
      const item = {
        id: Date.now().toString(),
        type: type,
        data: contentData,
        thumbnail: thumbnail,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      };

      // Avoid duplicates of exact same data at top
      recentHistory = recentHistory.filter(h => h.data !== contentData);
      recentHistory.unshift(item);

      // Keep max 12 items
      if (recentHistory.length > 12) recentHistory.pop();

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentHistory));
      renderHistoryGrid();
    } catch (e) {
      console.warn('LocalStorage error saving history:', e);
    }
  }

  function renderHistoryGrid() {
    if (recentHistory.length === 0) {
      historyEmptyState.classList.remove('hidden');
      historyGrid.innerHTML = '';
      clearHistoryWrapper.classList.add('hidden');
      return;
    }

    historyEmptyState.classList.add('hidden');
    clearHistoryWrapper.classList.remove('hidden');

    historyGrid.innerHTML = recentHistory.map(item => `
      <div class="history-card" data-id="${item.id}">
        <div class="history-thumb">
          <img src="${item.thumbnail}" alt="QR Code thumbnail">
        </div>
        <div class="history-info">
          <span class="history-type-badge">${item.type}</span>
          <p class="history-content-preview" title="${escapeHtml(item.data)}">${escapeHtml(item.data)}</p>
          <span class="history-date">${item.date}</span>
        </div>
        <div class="history-actions">
          <button class="btn btn-primary history-download-btn" data-thumb="${item.thumbnail}">Download</button>
          <button class="btn btn-outline-danger history-delete-btn" data-id="${item.id}" title="Delete">Delete</button>
        </div>
      </div>
    `).join('');

    // Attach History Card Event Listeners
    historyGrid.querySelectorAll('.history-download-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const thumb = e.target.dataset.thumb;
        const link = document.createElement('a');
        link.download = `QRWhale-${Date.now()}.png`;
        link.href = thumb;
        link.click();
        showToast('Downloaded PNG from history!', 'success');
      });
    });

    historyGrid.querySelectorAll('.history-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.closest('.history-delete-btn').dataset.id;
        recentHistory = recentHistory.filter(h => h.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentHistory));
        renderHistoryGrid();
        showToast('Item removed from history', 'info');
      });
    });
  }

  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your QR code history?')) {
      recentHistory = [];
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      renderHistoryGrid();
      showToast('History cleared', 'info');
    }
  });

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ==========================================
  // 9. UI Components: Navigation, Modals & Toast
  // ==========================================

  // Mobile Menu Drawer
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });

  // Customization Accordion
  customizationAccordionBtn.addEventListener('click', () => {
    const isOpen = customizationAccordion.classList.contains('open');
    if (isOpen) {
      customizationAccordion.classList.remove('open');
      customizationAccordionBtn.setAttribute('aria-expanded', 'false');
    } else {
      customizationAccordion.classList.add('open');
      customizationAccordionBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Modals
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');

  document.getElementById('openPrivacyModalBtn').addEventListener('click', () => openModal(privacyModal));
  document.getElementById('openTermsModalBtn').addEventListener('click', () => openModal(termsModal));

  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      privacyModal.classList.remove('open');
      termsModal.classList.remove('open');
    });
  });

  function openModal(modal) {
    modal.classList.add('open');
  }

  // Toast Notification System
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === 'success') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      icon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  // Configurable Support Link (Buy Me a Coffee)
  const BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/thewhaledev';
  const buyMeACoffeeBtn = document.getElementById('buyMeACoffeeBtn');
  if (buyMeACoffeeBtn) {
    buyMeACoffeeBtn.href = BUY_ME_A_COFFEE_URL;
  }

  // Footer Year
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // ==========================================
  // 10. Startup
  // ==========================================
  initQREngine();
  renderHistoryGrid();
  updateQRCode(false);

});


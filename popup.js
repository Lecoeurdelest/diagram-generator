import {apiProviders} from './llm-config.js'

const encodeDiagram = (diagramSource) => {
    const textData = new TextEncoder().encode(diagramSource);
    const compressed = pako.deflate(textData, { level: 9 });

    const binaryString = Array.from(compressed).reduce(
        (str, byte) => str + String.fromCharCode(byte),  ''
    );
    
    return btoa(binaryString).replace(/\+/g, '-').replace(/\//g, '_');
};

let currentDiagramUrl = '';

const DOM = {
    get diagramTypeInput() { return document.getElementById('diagramType'); },
    get selectWrapper() { return document.querySelector('.select-wrapper'); },
    get selectInput() { return document.getElementById('diagramTypeToggle'); },
    get selectValue() { return document.querySelector('.select-value'); },
    get selectTrigger() { return document.querySelector('.select-trigger'); },
    get selectDropdown() { return document.querySelector('.select-dropdown'); },
    get diagramInput() { return document.getElementById('diagramInput'); },
    get compressBtn() { return document.getElementById('compressBtn'); },
    get clearBtn() { return document.getElementById('clearBtn'); },
    get openLinkBtn() { return document.getElementById('openLinkBtn'); },
    get downloadBtn() { return document.getElementById('downloadBtn'); },
    
    get askLlmBtn() { return document.getElementById('askLlmBtn'); },
    get llmModalOverlay() { return document.getElementById('llmModalOverlay'); },
    get closeLlmModalBtn() { return document.getElementById('closeLlmModalBtn'); },
    get llmInput() { return document.getElementById('llmInput'); },
    get submitLlmBtn() { return document.getElementById('submitLlmBtn'); }
};

const updateCurrentUrl = (encodedData) => {
    const type = DOM.diagramTypeInput.value;
    const baseUrl = getUrl();
    currentDiagramUrl = `${baseUrl}/${type}/svg/${encodedData}`;
    DOM.openLinkBtn.disabled = false;
    DOM.downloadBtn.disabled = false;
};

const handleCompress = () => {
    const diagramSource = DOM.diagramInput.value;
    if (!diagramSource.trim()) return alert('Vui lòng nhập diagram source!');

    try {
        const encodedData = encodeDiagram(diagramSource);
        updateCurrentUrl(encodedData);
    } catch (error) {
        alert(`Lỗi khi nén: ${error.message}`);
    }
};

const handleClearAll = () => {
    DOM.diagramInput.value = '';
    currentDiagramUrl = '';
    DOM.openLinkBtn.disabled = true;
    DOM.downloadBtn.disabled = true;
};

const handleOpenLink = () => {
    if (currentDiagramUrl) {
        if (typeof window.chrome !== 'undefined' && window.chrome.tabs) {
            chrome.tabs.create({ url: currentDiagramUrl });
        } else {
            window.open(currentDiagramUrl, '_blank');
        }
    }
};

const handleDownload = () => {
    if (!currentDiagramUrl) return;

    chrome.downloads.download({
        url: currentDiagramUrl,
        filename: `${DOM.diagramTypeInput.value}-diagram.svg`,
        saveAs: true
    }, (downloadId) => {
        if (chrome.runtime.lastError) {
            console.error("Download failed:", chrome.runtime.lastError.message);
            alert('Không thể tải file. Vui lòng kiểm tra console của extension.');
        }
    });
};

const setupSelection = () => {
    DOM.selectTrigger.addEventListener('click', () => {
        DOM.selectWrapper.classList.toggle('open');
    });

    DOM.selectDropdown.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-option')) {
            const value = e.target.getAttribute('data-value');
            const text = e.target.textContent;
            DOM.selectValue.textContent = text;
            DOM.diagramTypeInput.value = value;
            
            const currentSelected = DOM.selectDropdown.querySelector('.selected');
            if (currentSelected) currentSelected.classList.remove('selected');
            e.target.classList.add('selected');
            
            DOM.selectInput.checked = false;
        }
    });

    document.addEventListener('click', (event) => {
        if (!DOM.selectWrapper.contains(event.target)) {
            DOM.selectInput.checked = false;
        }
    });
};

const handleKeydown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleCompress();
    }
};

const getUrl = () => {
    return `http://localhost:8000`;
};

async function askLlm(prompt, provider = 'gemini') {
    const diagramType = DOM.diagramTypeInput.value;
    return apiProviders[provider](prompt, diagramType);
}

async function handleSubmitLlm() {
    const prompt = DOM.llmInput.value.trim();
    if (!prompt) return;

    const originalButtonText = DOM.submitLlmBtn.textContent;
    DOM.submitLlmBtn.disabled = true;
    DOM.submitLlmBtn.textContent = 'Đang xử lý...';

    try {
        const diagramSource = await askLlm(prompt);
        DOM.diagramInput.value = diagramSource;
        hideLlmModal();
    } catch (error) {
        alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
        DOM.submitLlmBtn.disabled = false;
        DOM.submitLlmBtn.textContent = originalButtonText;
    }
}

function showLlmModal() {
    DOM.llmModalOverlay.classList.remove('hidden');
}

function hideLlmModal() {
    DOM.llmModalOverlay.classList.add('hidden');
}

const init = () => {
    DOM.compressBtn.addEventListener('click', handleCompress);
    DOM.clearBtn.addEventListener('click', handleClearAll);
    DOM.openLinkBtn.addEventListener('click', handleOpenLink);
    DOM.downloadBtn.addEventListener('click', handleDownload);
    document.addEventListener('keydown', handleKeydown);
    
    setupSelection();    

    DOM.askLlmBtn.addEventListener('click', showLlmModal);
    DOM.closeLlmModalBtn.addEventListener('click', hideLlmModal);
    DOM.submitLlmBtn.addEventListener('click', handleSubmitLlm);
    DOM.llmModalOverlay.addEventListener('click', (event) => {
        if (event.target === DOM.llmModalOverlay) {
            hideLlmModal();
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
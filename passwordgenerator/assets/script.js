
const charset = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?/",
    similar: "il1Lo0O"
};

function generatePassword(options) {
    let chars = "";

    if (options.upper) chars += charset.upper;
    if (options.lower) chars += charset.lower;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (options.excludeSimilar) {
        chars = chars.split('').filter(c => !charset.similar.includes(c)).join('');
    }

    if (chars.length === 0) return "";

    let password = "";
    for (let i = 0; i < options.length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

document.addEventListener('DOMContentLoaded', () => {
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const customizeSection = document.getElementById('customize');
    const generateBtn = document.getElementById('generateBtn');
    const resultField = document.getElementById('result');
    const copyBtn = document.getElementById('copyBtn');

    const lengthField = document.getElementById('length');
    const upperField = document.getElementById('uppercase');
    const lowerField = document.getElementById('lowercase');
    const numbersField = document.getElementById('numbers');
    const symbolsField = document.getElementById('symbols');
    const excludeSimilarField = document.getElementById('excludeSimilar');

    function validate() {
        const length = parseInt(lengthField.value);
        if (length < 8 || length > 256) {
            alert("Password length must be between 8 and 256.");
            return false;
        }

        if (!upperField.checked && !lowerField.checked && !numbersField.checked && !symbolsField.checked) {
            alert("At least one character type must be selected to generate a password.");
            return false;
        }
        return true;
    }

    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const isSecret = (radio.value === 'secret');
            customizeSection.style.display = 'block';

            lengthField.disabled = isSecret;
            lengthField.value = isSecret ? 60 : 30;

            [upperField, lowerField, numbersField, symbolsField, excludeSimilarField].forEach(field => {
                if (field === excludeSimilarField) {
                    field.disabled = isSecret ? false : false;
                    field.checked = isSecret ? false : field.checked;
                } else {
                    field.disabled = isSecret;
                    field.checked = true;
                }
            });
        });
    });

    generateBtn.addEventListener('click', () => {
        const mode = document.querySelector('input[name="mode"]:checked').value;

        if (mode === 'secret') {
            resultField.value = generatePassword({
                length: 60,
                upper: true,
                lower: true,
                numbers: true,
                symbols: true,
                excludeSimilar: true
            });
        } else {
            if (!validate()) return;

            const length = parseInt(lengthField.value);
            resultField.value = generatePassword({
                length,
                upper: upperField.checked,
                lower: lowerField.checked,
                numbers: numbersField.checked,
                symbols: symbolsField.checked,
                excludeSimilar: excludeSimilarField.checked
            });
        }
    });

    copyBtn.addEventListener('click', () => {
        resultField.select();
        resultField.setSelectionRange(0, 99999);
        document.execCommand("copy");
        copyBtn.textContent = "Copied password to your clipboard!";
        setTimeout(() => copyBtn.textContent = "🗐 Copy", 1500);
    });
});

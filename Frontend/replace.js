const fs = require('fs');
const path = require('path');

const walk = function(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
};

const files = walk('d:/LDRP/PROJECTS/AuraTheBegining/Frontend');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Emails
    content = content.replace(/contact@auramenswear\.com/g, '11a21278parth@gmail.com');
    
    // Phones
    content = content.replace(/\+91 88660 77505/g, '+91 88660 77505');
    content = content.replace(/8866077505/g, '8866077505');

    // Phrases
    content = content.replace(/AURA \(The Beginning\) MENS WEAR/gi, "Akshay Khanna's Store for only Men's");
    content = content.replace(/Akshay Khanna's Store for only Men's/gi, "Akshay Khanna's Store for only Men's");
    content = content.replace(/Akshay Khanna's Store for only Men's/g, "AKSHAY KHANNA'S STORE FOR ONLY MEN'S");
    content = content.replace(/AURA \(The Beginning\)/gi, "Akshay Khanna's Store for only Men's");
    
    // Aura Wordmark text specific
    if (file.includes('AuraWordmark.tsx')) {
        content = content.replace(/>\s*AURA\s*<\/span>/, ">AKSHAY KHANNA'S</span>");
        content = content.replace(/>\s*THE BEGINNING\s*<\/span>/, ">STORE FOR ONLY MEN'S</span>");
        content = content.replace(/tracking-\[0\.22em\]/g, "tracking-[0.1em]");
        content = content.replace(/tracking-\[0\.4em\]/g, "tracking-[0.2em]");
    }
    
    // Intro animation specific
    if (file.includes('IntroOverlay.tsx')) {
        content = content.replace(/>\s*AURA\s*<\/div>/, ">AKSHAY KHANNA'S</div>");
        content = content.replace(/>\s*THE BEGINNING\s*<\/div>/, ">STORE FOR ONLY MEN'S</div>");
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated', file);
    }
});

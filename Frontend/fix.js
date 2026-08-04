const fs = require('fs');

const fixFile = (path) => {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    // Replace unescaped single quotes in the name when it's part of a single-quoted string
    // A simple hack: just globally replace `Khanna's` with `Khanna\'s` and `Men's` with `Men\'s` 
    // BUT only inside the specific lines where it breaks, or just escape them everywhere and then fix the HTML text nodes.
    
    // Actually, in React, text nodes don't need escaping, but string literals do.
    // Let's just fix the specific syntax errors using regex.
    
    // 1. SettingsAdminClient.tsx
    content = content.replace(
        /'Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305',/,
        `"Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305",`
    );

    // 2. layout.tsx
    content = content.replace(
        /title: 'Akshay Khanna's Store for only Men's — Premium Men\\'s Wear \| Dahegam, Gujarat',/,
        `title: "Akshay Khanna's Store for only Men's — Premium Men's Wear | Dahegam, Gujarat",`
    );
    content = content.replace(
        /title: 'Akshay Khanna's Store for only Men's — Premium Men\\'s Wear',/,
        `title: "Akshay Khanna's Store for only Men's — Premium Men's Wear",`
    );
    content = content.replace(
        /siteName: 'Akshay Khanna's Store for only Men's',/,
        `siteName: "Akshay Khanna's Store for only Men's",`
    );

    // 3. about/page.tsx
    content = content.replace(
        /'Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';/,
        `"Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305";`
    );

    // 4. page.tsx
    content = content.replace(
        /'Shop no 2, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';/,
        `"Shop no 2, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305";`
    );

    // 5. visit-us/page.tsx
    content = content.replace(
        /'Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305';/,
        `"Shop no 2, plot, Akshay Khanna's Store for only Men's, Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305";`
    );
    content = content.replace(
        /name: 'Akshay Khanna's Store for only Men's',/,
        `name: "Akshay Khanna's Store for only Men's",`
    );
    content = content.replace(
        /streetAddress: 'Shop no 2, plot, Akshay Khanna's Store for only Men's, GIDC',/,
        `streetAddress: "Shop no 2, plot, Akshay Khanna's Store for only Men's, GIDC",`
    );

    // lib/brevo.ts
    content = content.replace(
        /const senderName = 'Akshay Khanna's Store for only Men's';/,
        `const senderName = "Akshay Khanna's Store for only Men's";`
    );
    content = content.replace(
        /subject: 'Thank you for contacting Akshay Khanna's Store for only Men's',/,
        `subject: "Thank you for contacting Akshay Khanna's Store for only Men's",`
    );

    fs.writeFileSync(path, content);
    console.log('Fixed', path);
};

fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/app/admin/settings/SettingsAdminClient.tsx');
fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/app/layout.tsx');
fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/app/about/page.tsx');
fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/app/page.tsx');
fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/app/visit-us/page.tsx');
fixFile('d:/LDRP/PROJECTS/AuraTheBegining/Frontend/lib/brevo.ts');

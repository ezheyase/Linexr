/* SIMULATEUR LINUX - Yassine Ezher */

const input = document.getElementById('cmd-input');
const output = document.getElementById('terminal-output');
const pathDisplay = document.getElementById('display-path');
const missionText = document.getElementById('mission-text');
const hintDisplay = document.getElementById('hint-display');
const progressBar = document.getElementById('chapter-progress');
const chapterTitle = document.getElementById('chapter-title');

let currentChapter = 0;
let currentMission = 0;
let currentPath = ['~', 'sandbox'];
let fileSystem = {
    '~': {
        'sandbox': { 
            /* TD2/TP4 files pre-loaded */
            'cible.txt': "Contenu confidentiel.",
            'adressbook': "Alami;Ahmed;0611223344\nBenali;Karim;0622334455\nZidane;Omar;0644556677\nBenmoussa;Sara;0633445566",
            'passwd': "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\nyassine:x:1000:1000:Yassine Ezher,,,:/home/yassine:/bin/bash",
            'sales': "Laptop\nSmartphone\nTablet\nSmartphone\nLaptop\nHeadphones",
            'access.log': "192.168.1.1 GET /index.html 200\n192.168.1.2 POST /login 302\n192.168.1.3 GET /admin 403\n192.168.1.4 GET /test 404"
        }
    }
};

/* --- CURRICULUM --- */
const curriculum = [
    {
        title: "TD1 : ARBORESCENCE & CRÉATION",
        missions: [
            { text: "TD1 Ex1: Dans 'sandbox', créez un dossier 'TD_SE1'.", cmd: "mkdir TD_SE1", hint: "Commande: mkdir [nom_dossier]" },
            { text: "TD1 Ex1: Entrez dans 'TD_SE1'.", cmd: "cd TD_SE1", hint: "Commande: cd TD_SE1" },
            { text: "TD1 Ex1: Créez les dossiers 'TD1', 'TD2', 'TD3' en une seule commande.", cmd: "mkdir TD1 TD2 TD3", hint: "Séparez les noms par des espaces." },
            { text: "TD1 Ex2: Créez un dossier 'eval' qui contient 'qcm1' (option -p).", cmd: "mkdir -p eval/qcm1", hint: "mkdir -p dossier/sous_dossier" },
            { text: "TD1 Ex2: Créez les fichiers 'controle1.txt' et 'controle2.txt' dans 'eval'.", cmd: "touch eval/controle1.txt eval/controle2.txt", hint: "Utilisez touch chemin/fichier" },
            { text: "TD1 Ex3: Revenez au dossier parent (sandbox).", cmd: "cd ..", hint: "cd .." },
            { text: "TD1 Ex3: Affichez l'arborescence complète.", cmd: "tree", hint: "Commande: tree" }
        ]
    },
    {
        title: "TD2 : LIENS & DROITS",
        missions: [
            { text: "TD2 Ex1: Créez un lien physique (dur) nommé 'hard.txt' pointant vers 'cible.txt'.", cmd: "ln cible.txt hard.txt", hint: "ln source destination" },
            { text: "TD2 Ex2: Créez un lien symbolique nommé 'soft.txt' pointant vers 'cible.txt'.", cmd: "ln -s cible.txt soft.txt", hint: "ln -s source destination" },
            { text: "TD2 Ex3: Donnez tous les droits (rwx) au propriétaire sur 'cible.txt' (chmod 700).", cmd: "chmod 700 cible.txt", hint: "chmod 700 fichier" },
            { text: "TD2 Ex3: Supprimez le droit d'écriture pour le groupe sur 'cible.txt' (g-w).", cmd: "chmod g-w cible.txt", hint: "chmod g-w fichier" }
        ]
    },
    {
        title: "TD3 : REDIRECTIONS",
        missions: [
            { text: "TD3 Ex1: Redirigez la date actuelle dans un fichier 'info'.", cmd: "date > info", hint: "commande > fichier" },
            { text: "TD3 Ex1: Ajoutez (sans écraser) votre nom d'utilisateur dans 'info'.", cmd: "whoami >> info", hint: "commande >> fichier (double chevron)" },
            { text: "TD3 Ex2: Listez les fichiers de /bin et sauvegardez le résultat dans 'listfile'.", cmd: "ls /bin > listfile", hint: "ls /bin > listfile" },
            { text: "TD3 Ex2: Concaténez le contenu de 'info' et 'listfile' dans 'about'.", cmd: "cat info listfile > about", hint: "cat f1 f2 > destination" }
        ]
    },
    {
        title: "TP4 : FILTRES (GREP, CUT, SORT)",
        missions: [
            { text: "TP4 Ex1: Affichez les 3 premières lignes de 'passwd'.", cmd: "head -n 3 passwd", hint: "head -n 3 fichier" },
            { text: "TP4 Ex1: Affichez uniquement les 2 dernières lignes de 'passwd'.", cmd: "tail -n 2 passwd", hint: "tail -n 2 fichier" },
            { text: "TP4 Ex2: Triez le fichier 'adressbook' par ordre alphabétique.", cmd: "sort adressbook", hint: "sort fichier" },
            { text: "TP4 Ex2: Affichez les lignes contenant 'Ben' dans 'adressbook'.", cmd: "grep Ben adressbook", hint: "grep 'Mot' fichier" },
            { text: "TP4 Ex2: Affichez uniquement les numéros de téléphone (3ème colonne).", cmd: "cut -d; -f3 adressbook", hint: "cut -d';' -f3 fichier" }
        ]
    },
    {
        title: "TD5 : LOGS & AVANCÉ",
        missions: [
            { text: "TD5: Trouvez les lignes contenant des erreurs 404 dans 'access.log'.", cmd: "grep 404 access.log", hint: "grep 404 fichier" },
            { text: "TD5: Comptez combien de fois 'Smartphone' apparaît dans 'sales'.", cmd: "grep -c Smartphone sales", hint: "grep -c Mot fichier" },
            { text: "TD5: Affichez les produits uniques de 'sales' (sans doublons).", cmd: "sort sales | uniq", hint: "Il faut trier avant : sort fichier | uniq" }
        ]
    }
];

loadProgress();
updateUI();

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const rawCmd = input.value.trim();
        if (rawCmd) processCommand(rawCmd);
        input.value = '';
        setTimeout(() => output.scrollTop = output.scrollHeight, 10);
    }
});

function processCommand(rawInput) {
    addToOutput(rawInput, true);
    
    /* SIMULATION DES SORTIES */
    let res = "";
    if (rawInput.startsWith("ls")) res = "TD_SE1  cible.txt  adressbook  passwd  sales  access.log";
    else if (rawInput === "tree") res = ".\n├── TD_SE1\n│   ├── TD1\n│   ├── TD2\n│   └── eval\n└── sandbox";
    else if (rawInput.startsWith("date")) res = ""; 
    else if (rawInput.startsWith("whoami")) res = "";
    else if (rawInput.includes("head")) res = "root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin\nbin:x:2:2:bin:/bin";
    else if (rawInput.includes("grep Ben")) res = "Benali;Karim;0622334455\nBenmoussa;Sara;0633445566";
    else if (rawInput.includes("sort sales | uniq")) res = "Headphones\nLaptop\nSmartwatch\nSmartphone\nTablet";
    else if (rawInput.includes("cut")) res = "0611223344\n0622334455\n0644556677\n0633445566";
    
    if (res) addToOutput(res, false);
    
    /* VALIDATION MISSION */
    const miss = curriculum[currentChapter].missions[currentMission];
    // On nettoie la commande pour comparer (ignore les espaces multiples)
    const cleanIn = rawInput.replace(/\s+/g, ' ').trim();
    const cleanTarget = miss.cmd.replace(/\s+/g, ' ').trim();
    
    // Validation souple : si la commande contient les mots clés essentiels
    let success = false;
    if (cleanIn === cleanTarget) success = true;
    else if (cleanIn.includes(cleanTarget)) success = true;
    
    // Cas spécifiques pipes
    if (miss.cmd.includes("|") && cleanIn.includes("|")) {
        if (cleanIn.replace(/\s/g,'') === cleanTarget.replace(/\s/g,'')) success = true;
    }

    if (success) {
        addToOutput("✔ Excellent !", false);
        currentMission++;
        if (currentMission >= curriculum[currentChapter].missions.length) {
            currentChapter++;
            currentMission = 0;
            addToOutput("🚀 Chapitre terminé !", false);
        }
        updateUI();
        saveProgress();
    }
}

function addToOutput(text, isCmd) {
    const div = document.createElement('div');
    const p = currentPath.length > 1 ? "~/"+currentPath[1] : "~";
    if (isCmd) {
        div.innerHTML = `<span class="prompt-user">yassine@ubuntu</span>:<span class="prompt-path">${p}</span>$ ${text}`;
        div.style.marginTop = "5px";
    } else {
        div.innerText = text;
        div.style.color = "#ccc";
        div.style.whiteSpace = "pre-wrap";
    }
    output.insertBefore(div, document.querySelector('.input-line'));
}

function updateUI() {
    if (currentChapter >= curriculum.length) {
        missionText.innerHTML = "🎉 BRAVO YASSINE !<br>Tu as terminé tous les TDs Linux.";
        return;
    }
    const chap = curriculum[currentChapter];
    const miss = chap.missions[currentMission];
    chapterTitle.innerText = chap.title;
    missionText.innerText = miss.text;
    hintDisplay.style.display = 'none';
    
    // Progress
    let total = 0, done = 0;
    curriculum.forEach(c => total += c.missions.length);
    for(let i=0; i<currentChapter; i++) done += curriculum[i].missions.length;
    done += currentMission;
    progressBar.style.width = (done / total * 100) + "%";
}

function showHint() {
    hintDisplay.innerText = "💡 " + curriculum[currentChapter].missions[currentMission].hint;
    hintDisplay.style.display = 'block';
}

function solveMission() {
    input.value = curriculum[currentChapter].missions[currentMission].cmd;
    input.focus();
}

function saveProgress() {
    localStorage.setItem('linux_sim_yassine_final', JSON.stringify({c: currentChapter, m: currentMission}));
}

function loadProgress() {
    const data = JSON.parse(localStorage.getItem('linux_sim_yassine_final'));
    if (data) { currentChapter = data.c; currentMission = data.m; }
}

function resetProgress() {
    if(confirm("Reset ?")) { localStorage.removeItem('linux_sim_yassine_final'); location.reload(); }
}
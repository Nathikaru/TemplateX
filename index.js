// index.js — Bot de templates de serveur Discord (discord.js v14, Node 18+)
// Installation : npm i discord.js dotenv
// Fichier .env : TOKEN=ton_token   (et GUILD_ID=id_du_serveur pour tester, optionnel)
// Lancement   : node index.js

require('dotenv').config();
const {
  Client, GatewayIntentBits, Events, Routes, SlashCommandBuilder,
  PermissionFlagsBits, ChannelType, OverwriteType, AttachmentBuilder, MessageFlags,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType,
} = require('discord.js');

const P = PermissionFlagsBits;
const REASON = 'Template de serveur';

/* ═══════════════ TEMPLATES PRÊTS À L'EMPLOI ═══════════════
   - Les rôles sont listés du plus haut au plus bas.
   - access : liste de rôles qui voient la catégorie/le salon (sinon public).
   - readOnly : personne ne peut écrire (sauf les admins).
   Pour ajouter un template : copie un bloc dans BUILTIN et modifie-le. */

const role = (name, color, permissions = [], hoist = true) => ({ name, color, hoist, permissions });
const txt = (name, topic, extra = {}) => ({ name, type: 'text', topic, ...extra });
const ro = (name, topic) => txt(name, topic, { readOnly: true });
const vc = (name) => ({ name, type: 'voice' });

const MOD = ['ManageMessages', 'KickMembers', 'ModerateMembers'];

const infos = (...extra) => ({
  name: '📌｜INFORMATIONS',
  channels: [ro('📜｜règlement', 'Les règles du serveur'), ro('📢｜annonces', 'Les annonces officielles'), ...extra],
});
const voiceCat = (...channels) => ({ name: '🔊｜VOCAL', channels });
const staffCat = (access, name = '🛡️｜STAFF') => ({
  name,
  access,
  channels: [txt('🛡️｜staff', 'Discussion du staff'), txt('📋｜logs', 'Journaux du serveur')],
});
const serviceCat = (name, serviceRole) => ({
  name,
  access: [serviceRole, 'Chef de service', 'Direction'],
  channels: [
    txt('📡｜prise-de-service', 'Prises et fins de service'),
    txt('📋｜rapports', 'Rapports d’intervention'),
    txt('🧠｜formations', 'Formations et examens'),
  ],
});

const BUILTIN = {
  communaute: {
    label: 'Communauté',
    description: 'Serveur communautaire classique avec staff',
    roles: [
      role('Fondateur', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Membre', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('👋｜bienvenue', 'Bienvenue sur le serveur !')),
      { name: '💬｜GÉNÉRAL', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('📷｜médias', 'Images et vidéos'),
        txt('🤖｜commandes-bot', 'Commandes des bots'),
      ] },
      voiceCat(vc('🔊｜Salon 1'), vc('🔊｜Salon 2'), vc('😴｜AFK')),
      staffCat(['Fondateur', 'Modérateur']),
    ],
  },

  rp: {
    label: 'Serveur RP (un service)',
    description: 'Jeu de rôle avec un service, direction et citoyens',
    roles: [
      role('Direction', '#e74c3c', ['Administrator']),
      role('Responsable', '#e67e22', ['ManageMessages', 'ManageNicknames', 'ModerateMembers']),
      role('Membre du service', '#2ecc71', []),
      role('Citoyen', '#95a5a6', [], false),
    ],
    categories: [
      infos(txt('📝｜recrutement', 'Informations et candidatures')),
      { name: '🏙️｜CITOYENS', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎭｜hors-rp', 'Discussions hors RP'),
        txt('🎫｜support', 'Besoin d’aide ? Écrivez ici'),
      ] },
      { name: '🏢｜SERVICE', access: ['Membre du service', 'Responsable', 'Direction'], channels: [
        txt('📡｜prise-de-service', 'Prises et fins de service'),
        txt('📋｜rapports', 'Rapports d’intervention'),
        txt('🧠｜formations', 'Formations et examens'),
      ] },
      { name: '🔒｜DIRECTION', access: ['Responsable', 'Direction'], channels: [
        txt('🔒｜direction', 'Discussion de la direction'),
        txt('📊｜suivi-effectifs', 'Recrutements, départs, sanctions'),
        txt('📋｜logs', 'Journaux du serveur'),
      ] },
      voiceCat(vc('🔊｜Salle d’attente'), vc('📻｜Radio 1'), vc('📻｜Radio 2')),
    ],
  },

  urgences: {
    label: 'Serveur RP (Police / EMS / Pompiers)',
    description: 'Jeu de rôle avec trois services, direction et citoyens',
    roles: [
      role('Direction', '#c0392b', ['Administrator']),
      role('Chef de service', '#8e44ad', ['ManageMessages', 'ManageNicknames', 'ModerateMembers']),
      role('Police', '#2980b9', []),
      role('EMS', '#16a085', []),
      role('Pompiers', '#e67e22', []),
      role('Citoyen', '#95a5a6', [], false),
    ],
    categories: [
      infos(txt('📝｜recrutement', 'Candidatures aux services')),
      { name: '🏙️｜CITOYENS', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎭｜hors-rp', 'Discussions hors RP'),
        txt('🎫｜support', 'Besoin d’aide ? Écrivez ici'),
      ] },
      serviceCat('🚓｜POLICE', 'Police'),
      serviceCat('🚑｜EMS', 'EMS'),
      serviceCat('🚒｜POMPIERS', 'Pompiers'),
      { name: '🔒｜DIRECTION', access: ['Chef de service', 'Direction'], channels: [
        txt('🔒｜direction', 'Discussion de la direction'),
        txt('📊｜suivi-effectifs', 'Recrutements, départs, sanctions'),
        txt('📋｜logs', 'Journaux du serveur'),
      ] },
      voiceCat(vc('🔊｜Salle d’attente'), vc('📻｜Radio Police'), vc('📻｜Radio EMS'), vc('📻｜Radio Pompiers')),
    ],
  },

  roblox: {
    label: 'Jeu Roblox',
    description: 'Communauté autour d’un jeu Roblox avec espace dev',
    roles: [
      role('Développeur', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Testeur', '#f1c40f', []),
      role('Joueur', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('🆕｜mises-à-jour', 'Changelog du jeu'), ro('🎁｜codes', 'Codes promo du jeu')),
      { name: '🎮｜COMMUNAUTÉ', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('💡｜suggestions', 'Vos idées pour le jeu'),
        txt('🐛｜bugs', 'Signaler un bug'),
        txt('📷｜médias', 'Captures et vidéos'),
      ] },
      { name: '🛠️｜DÉVELOPPEMENT', access: ['Développeur', 'Testeur'], channels: [
        txt('🛠️｜dev', 'Discussion développement'),
        txt('🧪｜tests', 'Retours de tests'),
        txt('📝｜idées', 'Idées en cours'),
      ] },
      voiceCat(vc('🔊｜Général'), vc('🎮｜En jeu')),
    ],
  },

  gaming: {
    label: 'Clan / Équipe gaming',
    description: 'Clan avec recrutement, scrims et vocaux d’équipe',
    roles: [
      role('Chef de clan', '#e74c3c', ['Administrator']),
      role('Officier', '#e67e22', MOD),
      role('Membre', '#3498db', []),
      role('Recrue', '#95a5a6', [], false),
    ],
    categories: [
      infos(txt('📝｜recrutement', 'Rejoindre le clan')),
      { name: '🎮｜COMMUNAUTÉ', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🔎｜recherche-de-joueurs', 'Trouver des coéquipiers'),
        txt('🎬｜clips', 'Vos meilleurs moments'),
        txt('😂｜memes', 'Détente'),
      ] },
      { name: '🏆｜COMPÉTITION', channels: [
        txt('⚔️｜scrims', 'Organisation des entraînements'),
        txt('📅｜tournois', 'Tournois à venir'),
        txt('📊｜résultats', 'Résultats des matchs'),
      ] },
      voiceCat(vc('🔊｜Lobby'), vc('🎧｜Équipe 1'), vc('🎧｜Équipe 2'), vc('😴｜AFK')),
      staffCat(['Chef de clan', 'Officier']),
    ],
  },

  minecraft: {
    label: 'Serveur Minecraft',
    description: 'Communauté Minecraft avec IP, support et signalements',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('VIP', '#f1c40f', []),
      role('Joueur', '#2ecc71', [], false),
    ],
    categories: [
      infos(ro('🌐｜ip-du-serveur', 'Adresse et version du serveur'), ro('🆕｜mises-à-jour', 'Nouveautés du serveur')),
      { name: '⛏️｜COMMUNAUTÉ', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('📸｜screenshots', 'Vos captures d’écran'),
        txt('🏠｜constructions', 'Montrez vos builds'),
        txt('💰｜commerce', 'Achats et ventes entre joueurs'),
        txt('💡｜suggestions', 'Vos idées pour le serveur'),
      ] },
      { name: '🆘｜AIDE', channels: [
        txt('❓｜support', 'Besoin d’aide ?'),
        txt('🚨｜signalements', 'Signaler un joueur ou un bug'),
      ] },
      voiceCat(vc('🔊｜Général'), vc('🏗️｜Construction'), vc('😴｜AFK')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  streamer: {
    label: 'Streamer / Créateur',
    description: 'Communauté de créateur avec espace abonnés',
    roles: [
      role('Streamer', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Abonné', '#9b59b6', []),
      role('Viewer', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('🔴｜live', 'Alertes de live'), ro('🎬｜vidéos', 'Nouvelles vidéos')),
      { name: '💬｜COMMUNAUTÉ', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎞️｜moments-de-live', 'Les meilleurs moments'),
        txt('🎨｜fan-art', 'Vos créations'),
        txt('😂｜memes', 'Détente'),
        txt('💡｜suggestions', 'Idées de contenu'),
      ] },
      { name: '⭐｜ABONNÉS', access: ['Abonné', 'Modérateur', 'Streamer'], channels: [
        txt('⭐｜abonnés', 'Salon réservé aux abonnés'),
        txt('👀｜avant-premières', 'Contenus en avant-première'),
      ] },
      voiceCat(vc('🔊｜Salon 1'), vc('🔊｜Salon 2'), vc('🔴｜En live')),
      staffCat(['Streamer', 'Modérateur']),
    ],
  },

  anime: {
    label: 'Anime / Manga',
    description: 'Communauté de fans d’anime et de manga',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Otaku', '#e91e8c', []),
      role('Membre', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('👋｜bienvenue', 'Présente-toi !')),
      { name: '🌸｜DISCUSSIONS', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('📺｜anime', 'Parlez des anime'),
        txt('📖｜manga', 'Parlez des mangas'),
        txt('⭐｜recommandations', 'Que regarder ou lire ?'),
        txt('⚠️｜spoilers', 'Ici, les spoilers sont permis'),
      ] },
      { name: '🎨｜CRÉATIONS', channels: [
        txt('🖌️｜fan-art', 'Dessins et illustrations'),
        txt('🎭｜cosplay', 'Photos de cosplay'),
        txt('🎬｜amv-et-vidéos', 'Montages et vidéos'),
      ] },
      voiceCat(vc('🔊｜Discussion'), vc('🎤｜Karaoké'), vc('🍿｜Soirée anime')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  etudes: {
    label: 'Études / Classe',
    description: 'Serveur de classe avec matières, entraide et profs',
    roles: [
      role('Professeur', '#e74c3c', ['Administrator']),
      role('Délégué', '#e67e22', ['ManageMessages', 'ModerateMembers']),
      role('Élève', '#3498db', [], false),
    ],
    categories: [
      infos(ro('📅｜emploi-du-temps', 'Planning des cours'), ro('📝｜devoirs', 'Devoirs à rendre')),
      { name: '📚｜COURS', channels: [
        txt('➗｜maths', 'Mathématiques'),
        txt('📖｜français', 'Français'),
        txt('🌍｜histoire-géo', 'Histoire-géographie'),
        txt('🔬｜sciences', 'Sciences'),
        txt('🗣️｜langues', 'Langues vivantes'),
      ] },
      { name: '💬｜VIE DE CLASSE', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🤝｜entraide', 'Posez vos questions'),
        txt('📂｜ressources', 'Cours et fiches'),
        txt('😂｜hors-sujet', 'Détente'),
      ] },
      voiceCat(vc('🔊｜Salle de travail 1'), vc('🔊｜Salle de travail 2'), vc('☕｜Pause')),
      staffCat(['Professeur', 'Délégué'], '🎓｜ÉQUIPE PÉDAGOGIQUE'),
    ],
  },

  equipe: {
    label: 'Équipe de travail / Projet',
    description: 'Équipe pro avec projets, organisation et direction',
    roles: [
      role('Direction', '#e74c3c', ['Administrator']),
      role('Manager', '#e67e22', ['ManageMessages', 'ManageNicknames']),
      role('Employé', '#3498db', []),
      role('Invité', '#95a5a6', [], false),
    ],
    categories: [
      { name: '📌｜GÉNÉRAL', channels: [
        ro('📢｜annonces', 'Annonces de l’équipe'),
        txt('💬｜général', 'Discussion générale'),
        txt('📂｜ressources', 'Documents et liens utiles'),
        txt('☕｜pause-café', 'Détente'),
      ] },
      { name: '📁｜PROJETS', channels: [
        txt('🚀｜projet-1', 'Suivi du projet 1'),
        txt('🚀｜projet-2', 'Suivi du projet 2'),
        txt('💡｜idées', 'Propositions et brainstorming'),
      ] },
      { name: '🗓️｜ORGANISATION', channels: [
        txt('📅｜planning', 'Planning de l’équipe'),
        txt('🧾｜comptes-rendus', 'Comptes rendus de réunion'),
      ] },
      voiceCat(vc('🔊｜Réunion'), vc('🔊｜Salle 1'), vc('🔊｜Salle 2'), vc('☕｜Pause')),
      staffCat(['Direction', 'Manager'], '🔒｜DIRECTION'),
    ],
  },

  boutique: {
    label: 'Boutique / Commerce',
    description: 'Boutique avec catalogue, commandes, avis et support',
    roles: [
      role('Gérant', '#e74c3c', ['Administrator']),
      role('Support', '#3498db', ['ManageMessages', 'ModerateMembers']),
      role('Client VIP', '#f1c40f', []),
      role('Client', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('🛒｜catalogue', 'Produits et tarifs'), ro('⭐｜avis', 'Avis des clients')),
      { name: '🛍️｜BOUTIQUE', channels: [
        txt('🧾｜commander', 'Passer une commande'),
        txt('📦｜suivi-de-commande', 'Suivre une commande'),
        txt('❓｜support', 'Une question ? Écrivez ici'),
        txt('📖｜faq', 'Questions fréquentes'),
      ] },
      { name: '💬｜COMMUNAUTÉ', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('💡｜suggestions', 'Vos idées pour la boutique'),
      ] },
      voiceCat(vc('🔊｜Support vocal'), vc('🔊｜Discussion')),
      staffCat(['Gérant', 'Support']),
    ],
  },

  whitelist: {
    label: 'Serveur RP whitelist',
    description: 'RP avec candidatures, entretiens et accès réservé aux whitelistés',
    roles: [
      role('Direction', '#e74c3c', ['Administrator']),
      role('Staff', '#e67e22', ['ManageMessages', 'ManageNicknames', 'ModerateMembers']),
      role('Whitelisté', '#2ecc71', []),
      role('Candidat', '#f1c40f', []),
      role('Visiteur', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('📖｜présentation', 'Univers et fonctionnement du serveur')),
      { name: '📝｜WHITELIST', channels: [
        txt('📝｜candidatures', 'Déposer sa candidature'),
        ro('📋｜résultats', 'Résultats des candidatures'),
        txt('🎙️｜entretiens', 'Planning des entretiens'),
      ] },
      { name: '🏙️｜JOUEURS', access: ['Whitelisté', 'Staff', 'Direction'], channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎭｜hors-rp', 'Discussions hors RP'),
        txt('🎫｜support', 'Besoin d’aide ? Écrivez ici'),
      ] },
      { name: '🔒｜STAFF', access: ['Staff', 'Direction'], channels: [
        txt('🔎｜étude-candidatures', 'Étude des candidatures'),
        txt('📊｜suivi-whitelist', 'Whitelists accordées et refusées'),
        txt('📋｜logs', 'Journaux du serveur'),
      ] },
      voiceCat(vc('🔊｜Salle d’attente'), vc('🎙️｜Entretien'), vc('🔊｜Général')),
    ],
  },

  gangs: {
    label: 'Serveur RP (Gangs / Entreprises)',
    description: 'RP avec gangs, entreprises, citoyens et staff',
    roles: [
      role('Direction', '#c0392b', ['Administrator']),
      role('Staff', '#e67e22', ['ManageMessages', 'ManageNicknames', 'ModerateMembers']),
      role('Chef de gang', '#8e44ad', []),
      role('Gang', '#34495e', []),
      role('Entrepreneur', '#f39c12', []),
      role('Citoyen', '#95a5a6', [], false),
    ],
    categories: [
      infos(txt('📝｜recrutement', 'Candidatures et recrutements')),
      { name: '🏙️｜CITOYENS', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎭｜hors-rp', 'Discussions hors RP'),
        txt('🎫｜support', 'Besoin d’aide ? Écrivez ici'),
      ] },
      { name: '🕶️｜GANGS', access: ['Gang', 'Chef de gang', 'Staff', 'Direction'], channels: [
        txt('📜｜règles-des-gangs', 'Règles spécifiques aux gangs'),
        txt('⚔️｜conflits', 'Guerres et conflits entre gangs'),
        txt('🗺️｜territoires', 'Gestion des territoires'),
      ] },
      { name: '💼｜ENTREPRISES', access: ['Entrepreneur', 'Staff', 'Direction'], channels: [
        txt('📢｜annonces-entreprises', 'Annonces des entreprises'),
        txt('🧾｜offres-emploi', 'Offres d’emploi'),
        txt('💰｜comptabilité', 'Suivi financier'),
      ] },
      { name: '🔒｜DIRECTION', access: ['Staff', 'Direction'], channels: [
        txt('🔒｜direction', 'Discussion de la direction'),
        txt('📋｜logs', 'Journaux du serveur'),
      ] },
      voiceCat(vc('🔊｜Salle d’attente'), vc('📻｜Radio Gangs'), vc('📻｜Radio Entreprises')),
    ],
  },

  supportbot: {
    label: 'Support d’un bot Discord',
    description: 'Serveur de support avec changelog, statut, bugs et bêta',
    roles: [
      role('Développeur', '#e74c3c', ['Administrator']),
      role('Support', '#3498db', ['ManageMessages', 'ModerateMembers']),
      role('Bêta-testeur', '#f1c40f', []),
      role('Utilisateur', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('🆕｜changelog', 'Nouveautés et mises à jour du bot'), ro('🟢｜statut', 'État du bot et incidents')),
      { name: '🤖｜LE BOT', channels: [
        txt('📖｜commandes', 'Liste et usage des commandes'),
        txt('💬｜général', 'Discussion générale'),
        txt('💡｜suggestions', 'Idées de fonctionnalités'),
      ] },
      { name: '🆘｜SUPPORT', channels: [
        txt('❓｜aide', 'Besoin d’aide avec le bot ?'),
        txt('🐛｜bugs', 'Signaler un bug'),
      ] },
      { name: '🧪｜BÊTA', access: ['Bêta-testeur', 'Développeur'], channels: [
        txt('🧪｜bêta', 'Nouveautés en test'),
        txt('📝｜retours-bêta', 'Vos retours sur la bêta'),
      ] },
      voiceCat(vc('🔊｜Support vocal'), vc('🔊｜Discussion')),
      staffCat(['Développeur', 'Support']),
    ],
  },

  dev: {
    label: 'Développeurs / Code',
    description: 'Communauté de dev avec entraide, langages et projets',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Mentor', '#e67e22', []),
      role('Développeur', '#2ecc71', []),
      role('Débutant', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('👋｜bienvenue', 'Présente-toi et ton niveau')),
      { name: '💻｜CODE', channels: [
        txt('💬｜général-dev', 'Discussion développement'),
        txt('🆘｜aide-et-questions', 'Posez vos questions'),
        txt('🚀｜projets', 'Présentez vos projets'),
        txt('🔍｜code-review', 'Relectures de code'),
        txt('📚｜ressources', 'Cours, outils et liens utiles'),
      ] },
      { name: '🌐｜LANGAGES', channels: [
        txt('🟨｜javascript', 'JavaScript et Node.js'),
        txt('🐍｜python', 'Python'),
        txt('🌙｜lua', 'Lua et Roblox'),
        txt('🕸️｜web', 'HTML, CSS et frameworks'),
        txt('⚙️｜autres-langages', 'C, C++, Java, Rust…'),
      ] },
      { name: '🤝｜COMMUNAUTÉ', channels: [
        txt('🤝｜collaborations', 'Trouver des partenaires de projet'),
        txt('😂｜hors-sujet', 'Détente'),
      ] },
      voiceCat(vc('🔊｜Pair programming'), vc('📚｜Salon d’étude'), vc('☕｜Détente')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  tech: {
    label: 'Tech / PC / Hardware',
    description: 'Communauté tech avec builds, bons plans et dépannage',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Expert', '#e67e22', []),
      role('Membre', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🖥️｜PC & HARDWARE', channels: [
        txt('💬｜général-tech', 'Discussion tech'),
        txt('🛠️｜builds-de-pc', 'Montrez vos configs'),
        txt('🔧｜composants', 'Processeurs, cartes graphiques, etc.'),
        txt('🧰｜dépannage', 'Un souci ? Demandez de l’aide'),
        txt('🛒｜conseils-achat', 'Que choisir ?'),
      ] },
      { name: '💸｜BONS PLANS', channels: [
        txt('🏷️｜promos', 'Promotions et réductions'),
        txt('⚖️｜comparatifs', 'Comparatifs et tests'),
      ] },
      { name: '📱｜SOFT & MOBILE', channels: [
        txt('💿｜logiciels', 'Logiciels et systèmes'),
        txt('📱｜smartphones', 'Téléphones et tablettes'),
      ] },
      voiceCat(vc('🔊｜Discussion'), vc('🛠️｜Aide en direct'), vc('😴｜AFK')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  jdr: {
    label: 'JDR / Jeu de rôle sur table',
    description: 'Parties de JDR avec jets de dés, lore et fiches',
    roles: [
      role('Maître du jeu', '#e74c3c', ['Administrator']),
      role('Aventurier', '#9b59b6', []),
      role('Spectateur', '#95a5a6', [], false),
    ],
    categories: [
      infos(txt('📝｜inscriptions', 'S’inscrire à une partie')),
      { name: '📜｜UNIVERS', channels: [
        ro('🗺️｜lore', 'L’histoire du monde'),
        txt('🧙｜fiches-de-personnage', 'Vos personnages'),
        ro('👹｜bestiaire', 'Créatures et monstres'),
      ] },
      { name: '🎲｜TABLE', channels: [
        txt('📖｜narration', 'Le récit de la partie'),
        txt('🎲｜jets-de-dés', 'Lancez vos dés ici'),
        txt('🗣️｜hors-jeu', 'Discussion hors partie'),
      ] },
      voiceCat(vc('🎲｜Table 1'), vc('🎲｜Table 2'), vc('🍺｜Taverne')),
      { name: '🔒｜COULISSES', access: ['Maître du jeu'], channels: [
        txt('🗝️｜secrets-du-mj', 'Notes privées du MJ'),
        txt('📋｜préparation', 'Préparation des parties'),
      ] },
    ],
  },

  musique: {
    label: 'Musique / Artistes',
    description: 'Mélomanes et artistes : partage, feedback et collaborations',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Artiste', '#e91e8c', []),
      role('Mélomane', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('👋｜bienvenue', 'Présente-toi !')),
      { name: '🎵｜MUSIQUE', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('⭐｜recommandations', 'Ce que vous écoutez en ce moment'),
        txt('📻｜playlists', 'Partagez vos playlists'),
        txt('🎟️｜concerts', 'Concerts et festivals'),
      ] },
      { name: '🎤｜ARTISTES', channels: [
        txt('🎧｜partage-de-créations', 'Postez vos morceaux'),
        txt('🗣️｜feedback', 'Donnez et recevez des avis'),
        txt('🤝｜collaborations', 'Trouver des partenaires'),
        txt('🎹｜prods-et-instrus', 'Productions et instrumentales'),
      ] },
      voiceCat(vc('🎧｜Écoute commune'), vc('🎤｜Jam'), vc('💬｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  art: {
    label: 'Art / Dessin / Créations',
    description: 'Artistes avec galeries, feedback et commissions',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Artiste', '#9b59b6', []),
      role('Membre', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🎨｜CRÉATIONS', channels: [
        txt('✏️｜dessins', 'Dessins traditionnels'),
        txt('🖥️｜art-numérique', 'Art digital'),
        txt('👾｜pixel-art', 'Sprites et pixel art'),
        txt('🧊｜3d', 'Modélisation 3D'),
        txt('📷｜photos', 'Photographie'),
      ] },
      { name: '💬｜ÉCHANGES', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🗣️｜feedback', 'Demandez des conseils'),
        txt('📚｜tutoriels', 'Tutoriels et astuces'),
        txt('🎯｜défis', 'Défis créatifs'),
      ] },
      { name: '🛒｜COMMISSIONS', channels: [
        txt('📬｜commissions-ouvertes', 'Artistes disponibles'),
        txt('🖼️｜portfolios', 'Vos portfolios'),
      ] },
      voiceCat(vc('🎨｜Session dessin'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  sport: {
    label: 'Sport / Fitness',
    description: 'Communauté sportive avec programmes, disciplines et progression',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Coach', '#e67e22', MOD),
      role('Sportif', '#2ecc71', []),
      role('Membre', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🏋️｜ENTRAÎNEMENT', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('📋｜programmes', 'Partagez vos programmes'),
        txt('🥗｜nutrition', 'Alimentation et récupération'),
        txt('📈｜progression', 'Suivez vos progrès'),
        txt('🔥｜motivation', 'Se motiver ensemble'),
      ] },
      { name: '🏃｜DISCIPLINES', channels: [
        txt('💪｜musculation', 'Musculation et force'),
        txt('🏃｜running', 'Course à pied'),
        txt('🚴｜cyclisme', 'Vélo'),
        txt('🥊｜sports-de-combat', 'Boxe, MMA, arts martiaux'),
        txt('⚽｜sports-collectifs', 'Foot, basket, rugby…'),
      ] },
      { name: '📸｜PARTAGE', channels: [
        txt('🏆｜performances', 'Vos records et réussites'),
        txt('📷｜photos', 'Photos de séances'),
      ] },
      voiceCat(vc('🏋️｜Séance en groupe'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Coach']),
    ],
  },

  cuisine: {
    label: 'Cuisine / Recettes',
    description: 'Passionnés de cuisine : recettes, astuces et créations',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Chef', '#e67e22', []),
      role('Gourmand', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🍳｜RECETTES', channels: [
        txt('📖｜recettes', 'Partagez vos recettes'),
        txt('🍝｜plats', 'Plats principaux'),
        txt('🍰｜pâtisserie', 'Desserts et pâtisseries'),
        txt('🥦｜végétarien', 'Cuisine végétarienne et végétale'),
        txt('💡｜astuces', 'Trucs et techniques'),
      ] },
      { name: '📸｜PARTAGE', channels: [
        txt('😋｜vos-créations', 'Photos de vos plats'),
        txt('🍽️｜restaurants', 'Bonnes adresses'),
      ] },
      { name: '💬｜DISCUSSION', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🔪｜matériel', 'Ustensiles et équipement'),
        txt('🙋｜demandes-de-recettes', 'Cherchez une recette'),
      ] },
      voiceCat(vc('🍳｜Cuisine en direct'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  voyage: {
    label: 'Voyage',
    description: 'Voyageurs : destinations, préparation et souvenirs',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Globe-trotteur', '#1abc9c', []),
      role('Voyageur', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🌍｜DESTINATIONS', channels: [
        txt('🏰｜europe', 'Voyages en Europe'),
        txt('🏯｜asie', 'Voyages en Asie'),
        txt('🗽｜amériques', 'Amérique du Nord, centrale et du Sud'),
        txt('🦁｜afrique', 'Voyages en Afrique'),
        txt('🏝️｜océanie', 'Océanie et îles'),
      ] },
      { name: '🧳｜PRÉPARATION', channels: [
        txt('💡｜conseils', 'Conseils de voyage'),
        txt('🏷️｜bons-plans', 'Vols, hôtels et réductions'),
        txt('💶｜budget', 'Gérer son budget'),
        txt('🗓️｜itinéraires', 'Partagez vos itinéraires'),
      ] },
      { name: '📸｜SOUVENIRS', channels: [
        txt('📷｜photos', 'Vos plus belles photos'),
        txt('📝｜récits-de-voyage', 'Racontez vos voyages'),
      ] },
      voiceCat(vc('✈️｜Salon voyage'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  cinema: {
    label: 'Cinéma / Séries',
    description: 'Cinéphiles : films, séries, soirées et spoilers',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Cinéphile', '#f39c12', []),
      role('Spectateur', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '🎬｜FILMS & SÉRIES', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🎞️｜films', 'Parlez des films'),
        txt('📺｜séries', 'Parlez des séries'),
        txt('⭐｜recommandations', 'Que regarder ce soir ?'),
        txt('🎥｜bandes-annonces', 'Les nouveautés à venir'),
      ] },
      { name: '🍿｜SOIRÉES', channels: [
        txt('📅｜soirées-ciné', 'Organisez des projections'),
        txt('🗳️｜votes', 'Votez pour le prochain film'),
      ] },
      { name: '⚠️｜SPOILERS', channels: [
        txt('⚠️｜spoilers-films', 'Spoilers sur les films'),
        txt('⚠️｜spoilers-séries', 'Spoilers sur les séries'),
      ] },
      voiceCat(vc('🍿｜Salle de ciné'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  lecture: {
    label: 'Livres / Écriture',
    description: 'Lecteurs et auteurs : club de lecture et ateliers d’écriture',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Auteur', '#9b59b6', []),
      role('Lecteur', '#95a5a6', [], false),
    ],
    categories: [
      infos(),
      { name: '📚｜LECTURE', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('⭐｜recommandations', 'Quels livres lire ?'),
        txt('📝｜critiques', 'Vos avis de lecture'),
        txt('📖｜club-de-lecture', 'Lecture commune du mois'),
      ] },
      { name: '✍️｜ÉCRITURE', channels: [
        txt('🖋️｜ateliers-écriture', 'Exercices et défis d’écriture'),
        txt('📄｜partage-de-textes', 'Partagez vos textes'),
        txt('🔍｜relectures', 'Demandez une relecture'),
      ] },
      voiceCat(vc('📖｜Lecture à voix haute'), vc('✍️｜Session d’écriture'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  langues: {
    label: 'Langues / Échange linguistique',
    description: 'Apprenants et natifs : pratique, grammaire et culture',
    roles: [
      role('Admin', '#e74c3c', ['Administrator']),
      role('Modérateur', '#3498db', MOD),
      role('Natif', '#2ecc71', []),
      role('Apprenant', '#95a5a6', [], false),
    ],
    categories: [
      infos(ro('👋｜bienvenue', 'Indique ta langue maternelle et celles que tu apprends')),
      { name: '🗣️｜ÉCHANGE', channels: [
        txt('💬｜général', 'Discussion générale'),
        txt('🇫🇷｜français', 'Parlez en français'),
        txt('🇬🇧｜anglais', 'Speak English'),
        txt('🇪🇸｜espagnol', 'Habla español'),
        txt('🇩🇪｜allemand', 'Sprich Deutsch'),
        txt('🇯🇵｜japonais', '日本語で話しましょう'),
      ] },
      { name: '📚｜APPRENTISSAGE', channels: [
        txt('❓｜questions-grammaire', 'Posez vos questions'),
        txt('📖｜vocabulaire', 'Mots et expressions du jour'),
        txt('🧰｜ressources', 'Applis, cours et sites utiles'),
        txt('🎯｜défis-quotidiens', 'Un petit défi par jour'),
      ] },
      { name: '🌍｜CULTURE', channels: [
        txt('🎬｜musique-et-films', 'Découvrez des médias étrangers'),
        txt('🍜｜traditions', 'Cuisine, fêtes et coutumes'),
      ] },
      voiceCat(vc('🗣️｜Pratique orale 1'), vc('🗣️｜Pratique orale 2'), vc('🔊｜Discussion')),
      staffCat(['Admin', 'Modérateur']),
    ],
  },

  // ⚠️ Discord limite le menu de choix à 25 templates : c'est le maximum atteint ici.
};

/* ═══════════════ OUTILS ═══════════════ */

const norm = (s) => String(s).toLowerCase().trim().replace(/\s+/g, '-');
const same = (a, b) => norm(a) === norm(b);
const cut = (s, n = 100) => String(s).slice(0, n);
const errList = (arr) => arr.slice(0, 5).map((e) => `- ${cut(e, 150)}`).join('\n');

const countChannels = (t) => (t.categories ?? []).reduce((n, c) => n + (c.channels?.length ?? 0), 0);

function validate(tpl) {
  if (!tpl || typeof tpl !== 'object') return 'JSON invalide.';
  const roles = tpl.roles ?? [];
  const cats = tpl.categories ?? [];
  if (!Array.isArray(roles) || !Array.isArray(cats)) return '« roles » et « categories » doivent être des listes.';
  if (roles.length > 100 || cats.length > 50 || countChannels(tpl) > 200) {
    return 'Template trop gros (max 100 rôles, 50 catégories, 200 salons).';
  }
  const bad =
    roles.some((r) => typeof r?.name !== 'string') ||
    cats.some((c) => typeof c?.name !== 'string' || (c.channels ?? []).some((ch) => typeof ch?.name !== 'string'));
  if (bad) return 'Chaque rôle, catégorie et salon doit avoir un « name ».';
  return null;
}

function overwritesFor(guild, roleMap, access, readOnly) {
  const everyone = guild.roles.everyone.id;
  const ow = [];
  if (access?.length) {
    ow.push({ id: everyone, deny: [P.ViewChannel] });
    for (const name of access) {
      const r = roleMap.get(name) ?? guild.roles.cache.find((x) => x.name === name);
      if (!r) continue;
      ow.push({
        id: r.id,
        allow: [P.ViewChannel, P.ReadMessageHistory, P.Connect, ...(readOnly ? [] : [P.SendMessages])],
      });
    }
  } else if (readOnly) {
    ow.push({ id: everyone, deny: [P.SendMessages] });
  }
  return ow;
}

/* ═══════════════ CRÉER LA STRUCTURE D'UN TEMPLATE ═══════════════ */

// reuse = true  : si un rôle/salon du même nom existe déjà, on le garde (mode « conserver »)
// reuse = false : on crée tout en neuf (utilisé par le mode « remplacer »)
async function applyTemplate(guild, tpl, { reuse = true } = {}) {
  const report = { roles: 0, categories: 0, channels: 0, skipped: 0, errors: [], roleMap: new Map() };
  const roleMap = report.roleMap;
  await guild.roles.fetch();
  await guild.channels.fetch();

  // Rôles : un nouveau rôle se place sous les précédents, donc le 1er de la liste finit le plus haut.
  for (const r of tpl.roles ?? []) {
    try {
      let created = reuse ? guild.roles.cache.find((x) => x.name === r.name) : undefined;
      if (created) {
        report.skipped++;
      } else {
        created = await guild.roles.create({
          name: cut(r.name),
          color: r.color || undefined,
          hoist: !!r.hoist,
          mentionable: !!r.mentionable,
          permissions: r.permissions ?? [],
          reason: REASON,
        });
        report.roles++;
      }
      roleMap.set(r.name, created);
    } catch (e) {
      report.errors.push(`Rôle « ${r.name} » : ${e.message}`);
    }
  }

  // Catégories et salons
  for (const cat of tpl.categories ?? []) {
    let category;
    try {
      category = reuse
        ? guild.channels.cache.find((c) => c.type === ChannelType.GuildCategory && same(c.name, cat.name))
        : undefined;
      if (category) {
        report.skipped++;
      } else {
        category = await guild.channels.create({
          name: cut(cat.name),
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwritesFor(guild, roleMap, cat.access, false),
          reason: REASON,
        });
        report.categories++;
      }
    } catch (e) {
      report.errors.push(`Catégorie « ${cat.name} » : ${e.message}`);
      continue;
    }

    for (const ch of cat.channels ?? []) {
      try {
        const exists = reuse
          ? guild.channels.cache.find((c) => c.parentId === category.id && same(c.name, ch.name))
          : undefined;
        if (exists) {
          report.skipped++;
          continue;
        }
        const isVoice = ch.type === 'voice';
        await guild.channels.create({
          name: cut(ch.name),
          type: isVoice ? ChannelType.GuildVoice : ChannelType.GuildText,
          parent: category.id,
          topic: isVoice || !ch.topic ? undefined : cut(ch.topic, 1024),
          permissionOverwrites: overwritesFor(guild, roleMap, ch.access ?? cat.access, !!ch.readOnly),
          reason: REASON,
        });
        report.channels++;
      } catch (e) {
        report.errors.push(`Salon « ${ch.name} » : ${e.message}`);
      }
    }
  }
  return report;
}

/* ═══════════════ TOUT REMPLACER ═══════════════
   1) on note ce qui existe, 2) on crée le nouveau template,
   3) seulement si tout s'est bien passé, on supprime l'ancien contenu. */

function deletableRoles(guild) {
  return guild.roles.cache.filter((r) => r.id !== guild.id && !r.managed && r.editable);
}

async function replaceWithTemplate(guild, tpl, executorId) {
  await guild.roles.fetch();
  await guild.channels.fetch();
  const oldChannelIds = [...guild.channels.cache.keys()];
  const oldRoleIds = [...deletableRoles(guild).keys()];

  const report = await applyTemplate(guild, tpl, { reuse: false });
  report.warnings = [];
  report.notDeleted = [];
  report.deleted = { channels: 0, roles: 0 };

  if (report.errors.length) {
    report.aborted = true; // erreur pendant la création : on ne supprime RIEN
    return report;
  }

  // Le lanceur de la commande reçoit le rôle le plus haut du nouveau template (pour garder la main)
  const topRole = report.roleMap.get(tpl.roles?.[0]?.name);
  if (topRole && executorId) {
    try {
      const member = await guild.members.fetch(executorId);
      await member.roles.add(topRole, REASON);
    } catch (e) {
      report.warnings.push(`Rôle « ${topRole.name} » non donné : ${e.message}`);
    }
  }

  for (const id of oldChannelIds) {
    const ch = guild.channels.cache.get(id);
    if (!ch) continue;
    try {
      await ch.delete(REASON);
      report.deleted.channels++;
    } catch (e) {
      report.notDeleted.push(`Salon « ${ch.name} » : ${e.message}`);
    }
  }

  for (const id of oldRoleIds) {
    const r = guild.roles.cache.get(id);
    if (!r) continue;
    try {
      await r.delete(REASON);
      report.deleted.roles++;
    } catch (e) {
      report.notDeleted.push(`Rôle « ${r.name} » : ${e.message}`);
    }
  }
  return report;
}

function formatReport(label, r) {
  if (r.aborted) {
    return (
      `⛔ **${label}** : des erreurs sont survenues pendant la création, donc **rien n’a été supprimé** (ton ancien contenu est intact).\n` +
      `${errList(r.errors)}\n` +
      'Ce qui a déjà été créé reste en doublon : supprime-le à la main, ou corrige le souci puis relance.'
    );
  }
  let t =
    `✅ **${label}** installé${r.deleted ? ' (ancien contenu remplacé)' : ''}.\n` +
    `• Créés : ${r.roles} rôle(s), ${r.categories} catégorie(s), ${r.channels} salon(s)`;
  if (r.deleted) {
    t += `\n• Supprimés : ${r.deleted.channels} salon(s)/catégorie(s), ${r.deleted.roles} rôle(s)`;
  } else {
    t += `\n• ${r.skipped} élément(s) déjà existant(s) ignoré(s)`;
    if (r.errors.length) t += `\n⚠️ ${r.errors.length} erreur(s) :\n${errList(r.errors)}`;
  }
  if (r.warnings?.length) t += `\n⚠️ ${errList(r.warnings)}`;
  if (r.notDeleted?.length) {
    t += `\n⚠️ ${r.notDeleted.length} élément(s) n’ont pas pu être supprimés (ex. salons obligatoires d’un serveur Communauté) :\n${errList(r.notDeleted)}`;
  }
  return t;
}

/* ═══════════════ EXPORTER LE SERVEUR EN JSON ═══════════════ */

function describeAccess(guild, channel) {
  const everyoneOw = channel.permissionOverwrites.cache.get(guild.id);
  const isPrivate = !!everyoneOw?.deny.has(P.ViewChannel);
  const readOnly = !isPrivate && !!everyoneOw?.deny.has(P.SendMessages);
  let access;
  if (isPrivate) {
    access = channel.permissionOverwrites.cache
      .filter((o) => o.type === OverwriteType.Role && o.id !== guild.id && o.allow.has(P.ViewChannel))
      .map((o) => guild.roles.cache.get(o.id)?.name)
      .filter(Boolean);
  }
  return { access, readOnly };
}

async function exportGuild(guild) {
  await guild.roles.fetch();
  await guild.channels.fetch();

  const roles = guild.roles.cache
    .filter((r) => !r.managed && r.id !== guild.id)
    .sort((a, b) => b.position - a.position)
    .map((r) => ({
      name: r.name,
      color: r.color ? r.hexColor : undefined,
      hoist: r.hoist,
      mentionable: r.mentionable,
      permissions: r.permissions.toArray(),
    }));

  const exportable = (c) =>
    [ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(c.type);
  const byPos = (a, b) => a.position - b.position;

  const toChannel = (c) => {
    const { access, readOnly } = describeAccess(guild, c);
    const isVoice = c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice;
    return {
      name: c.name,
      type: isVoice ? 'voice' : 'text',
      topic: isVoice ? undefined : c.topic || undefined,
      access,
      readOnly: readOnly || undefined,
    };
  };

  const categories = guild.channels.cache
    .filter((c) => c.type === ChannelType.GuildCategory)
    .sort(byPos)
    .map((cat) => ({
      name: cat.name,
      access: describeAccess(guild, cat).access,
      channels: guild.channels.cache.filter((c) => c.parentId === cat.id && exportable(c)).sort(byPos).map(toChannel),
    }));

  const orphans = guild.channels.cache.filter((c) => !c.parentId && exportable(c)).sort(byPos).map(toChannel);
  if (orphans.length) categories.push({ name: 'Sans catégorie', channels: orphans });

  return { name: guild.name, roles, categories };
}

/* ═══════════════ TEMPLATE NATIF DISCORD (lien discord.new) ═══════════════ */

async function nativeTemplate(guild) {
  const existing = (await guild.fetchTemplates()).first();
  if (existing) {
    await existing.sync();
    return existing;
  }
  return guild.createTemplate(cut(guild.name), 'Template créé avec le bot');
}

/* ═══════════════ COMMANDE /template ═══════════════ */

const keepOption = (o) =>
  o.setName('conserver').setDescription('Ne rien supprimer : ajouter seulement ce qui manque (par défaut : tout remplacer)');

const command = new SlashCommandBuilder()
  .setName('template')
  .setDescription('Créer et gérer des templates de serveur')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((s) => s.setName('liste').setDescription('Voir les templates prêts à l’emploi'))
  .addSubcommand((s) =>
    s
      .setName('appliquer')
      .setDescription('Remplacer le serveur par un template prêt à l’emploi')
      .addStringOption((o) =>
        o
          .setName('nom')
          .setDescription('Le template à appliquer')
          .setRequired(true)
          .addChoices(...Object.entries(BUILTIN).slice(0, 25).map(([value, t]) => ({ name: cut(t.label), value }))),
      )
      .addBooleanOption(keepOption),
  )
  .addSubcommand((s) =>
    s
      .setName('importer')
      .setDescription('Remplacer le serveur par un template depuis un fichier JSON')
      .addAttachmentOption((o) => o.setName('fichier').setDescription('Fichier .json exporté').setRequired(true))
      .addBooleanOption(keepOption),
  )
  .addSubcommand((s) => s.setName('exporter').setDescription('Exporter la structure de ce serveur en fichier JSON'))
  .addSubcommand((s) =>
    s.setName('lien').setDescription('Créer ou mettre à jour le template natif Discord (lien discord.new)'),
  );

/* ═══════════════ BOT ═══════════════ */

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const busy = new Set(); // serveurs où un template est en cours d'application

client.once(Events.ClientReady, async (c) => {
  try {
    const guildId = (process.env.GUILD_ID || '').trim();
    const route = guildId
      ? Routes.applicationGuildCommands(c.user.id, guildId)
      : Routes.applicationCommands(c.user.id);
    await c.rest.put(route, { body: [command.toJSON()] });
    console.log(`Connecté en tant que ${c.user.tag} — commande /template enregistrée.`);
  } catch (e) {
    console.error('Erreur à l’enregistrement de la commande :', e);
  }
});

// Envoie le résultat final, même si le salon de la commande a été supprimé pendant le remplacement.
async function sendFinal(i, guild, text) {
  try {
    await i.editReply({ content: text, components: [] });
    return;
  } catch {
    /* le message n'existe plus : on essaie autrement */
  }
  try {
    await i.user.send(text);
    return;
  } catch {
    /* MP fermés */
  }
  const ch = guild.channels.cache.find((c) => c.type === ChannelType.GuildText);
  await ch?.send(text).catch(() => {});
}

client.on(Events.InteractionCreate, async (i) => {
  if (!i.isChatInputCommand() || i.commandName !== 'template') return;
  const ephemeral = { flags: MessageFlags.Ephemeral };

  if (!i.inGuild()) return i.reply({ content: 'Cette commande fonctionne uniquement dans un serveur.', ...ephemeral });
  if (!i.memberPermissions.has(P.Administrator)) {
    return i.reply({ content: '⛔ Réservé aux administrateurs.', ...ephemeral });
  }

  try {
    await i.deferReply(ephemeral);
    const sub = i.options.getSubcommand();
    const guild = i.guild;

    if (sub === 'liste') {
      const entries = Object.entries(BUILTIN);
      const footer =
        '\nUtilise `/template appliquer` : **tout le serveur est remplacé** (avec confirmation). Option `conserver` pour ne rien supprimer.';
      const chunks = [];
      let cur = `**Templates disponibles (${entries.length})**\n`;
      for (const [key, t] of entries) {
        const line = `• **${t.label}** (\`${key}\`) · ${countChannels(t)} salons\n`;
        if ((cur + line).length > 1700) {
          chunks.push(cur);
          cur = '';
        }
        cur += line;
      }
      chunks.push(cur + footer);
      await i.editReply(chunks[0]);
      for (const c of chunks.slice(1)) await i.followUp({ content: c, ...ephemeral });
      return;
    }

    if (sub === 'exporter') {
      const data = await exportGuild(guild);
      const file = new AttachmentBuilder(Buffer.from(JSON.stringify(data, null, 2), 'utf8'), { name: 'template-serveur.json' });
      return i.editReply({
        content: `📦 Structure exportée : ${data.roles.length} rôles, ${data.categories.length} catégories, ${countChannels(data)} salons.\nRéimporte-la sur un autre serveur avec \`/template importer\`.`,
        files: [file],
      });
    }

    if (sub === 'lien') {
      const tpl = await nativeTemplate(guild);
      return i.editReply(
        `🔗 Template Discord prêt : ${tpl.url}\nIl reprend la structure actuelle (rôles, salons, permissions), sans les messages ni les membres.`,
      );
    }

    // ── appliquer / importer ──
    const me = await guild.members.fetchMe();
    if (!me.permissions.has([P.ManageRoles, P.ManageChannels])) {
      return i.editReply('⛔ Il me faut les permissions « Gérer les rôles » et « Gérer les salons » (idéalement Administrateur).');
    }

    let tpl;
    let label;
    if (sub === 'appliquer') {
      tpl = BUILTIN[i.options.getString('nom', true)];
      label = tpl.label;
    } else {
      const att = i.options.getAttachment('fichier', true);
      if (!att.name.toLowerCase().endsWith('.json') || att.size > 500_000) {
        return i.editReply('⛔ Envoie un fichier .json de moins de 500 Ko.');
      }
      try {
        tpl = JSON.parse(await (await fetch(att.url)).text());
      } catch {
        return i.editReply('⛔ Impossible de lire ce fichier : JSON invalide.');
      }
      label = tpl?.name ? `Template « ${cut(tpl.name, 50)} »` : 'Template importé';
    }

    const problem = validate(tpl);
    if (problem) return i.editReply(`⛔ ${problem}`);
    if (busy.has(guild.id)) return i.editReply('⏳ Un template est déjà en cours d’application sur ce serveur.');

    // Mode « conserver » : on ajoute seulement, sans rien supprimer
    if (i.options.getBoolean('conserver')) {
      busy.add(guild.id);
      try {
        await i.editReply('⏳ Création en cours… ça peut prendre une minute.');
        const report = await applyTemplate(guild, tpl, { reuse: true });
        return i.editReply(formatReport(label, report));
      } finally {
        busy.delete(guild.id);
      }
    }

    // Mode « remplacer » (par défaut) : confirmation obligatoire
    await guild.roles.fetch();
    await guild.channels.fetch();
    const nbChannels = guild.channels.cache.size;
    const nbRoles = deletableRoles(guild).size;
    const topName = tpl.roles?.[0]?.name;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('tpl_ok').setLabel('Oui, tout remplacer').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('tpl_no').setLabel('Annuler').setStyle(ButtonStyle.Secondary),
    );
    const msg = await i.editReply({
      content:
        `⚠️ **Remplacer tout le serveur par « ${label} » ?**\n` +
        `• **${nbChannels}** salon(s)/catégorie(s) et **${nbRoles}** rôle(s) seront **supprimés** (messages perdus, anciens rôles retirés aux membres)\n` +
        `• Seront créés : ${tpl.roles?.length ?? 0} rôles, ${tpl.categories?.length ?? 0} catégories, ${countChannels(tpl)} salons\n` +
        (topName ? `• Tu recevras le rôle **${cut(topName, 60)}** pour garder la main\n` : '') +
        '• Les membres, bans, emojis et paramètres du serveur ne sont pas touchés\n' +
        '**Action irréversible.** Tu as 30 secondes pour confirmer.',
      components: [row],
    });

    let click;
    try {
      click = await msg.awaitMessageComponent({
        componentType: ComponentType.Button,
        filter: (b) => b.user.id === i.user.id,
        time: 30_000,
      });
    } catch {
      return i.editReply({ content: '⌛ Temps écoulé : rien n’a été modifié.', components: [] });
    }
    if (click.customId === 'tpl_no') {
      return click.update({ content: 'Annulé : rien n’a été modifié.', components: [] });
    }

    await click.update({ content: '⏳ Remplacement en cours… ça peut prendre quelques minutes, ne touche à rien.', components: [] });

    if (busy.has(guild.id)) return i.editReply('⏳ Un template est déjà en cours d’application sur ce serveur.');
    busy.add(guild.id);
    try {
      const report = await replaceWithTemplate(guild, tpl, i.user.id);
      await sendFinal(i, guild, formatReport(label, report));
    } finally {
      busy.delete(guild.id);
    }
  } catch (e) {
    console.error(e);
    const msg = `⛔ Une erreur est survenue : ${e.message}`;
    if (i.deferred || i.replied) await i.editReply({ content: msg, components: [] }).catch(() => {});
    else await i.reply({ content: msg, ...ephemeral }).catch(() => {});
  }
});

const TOKEN = (process.env.TOKEN || process.env.DISCORD_TOKEN || '').trim().replace(/^["']|["']$/g, '');
if (!TOKEN) {
  console.error('⛔ Aucun token trouvé. Le fichier .env doit contenir une ligne : TOKEN=ton_token (sans guillemets).');
  process.exit(1);
}
client.login(TOKEN);
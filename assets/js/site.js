(() => {
    'use strict';

    // =========================================================
    // 1. Complete 6-Language Dictionary (Overview, Partners, Careers)
    // =========================================================
    const translations = {
        en: {
            tagline: "Specification-driven physical data production for robotics",
            nav: { overview: "Overview", partners: "Partners", careers: "Careers" },
            ui: { details: "Details", close: "Close" },
            hero: {
                labName: "Physical AI Data Lab",
                title: "Specification-Driven Physical Data Production",
                subtitle: "Custom robotics data collection organized from your technical specification—matching target tasks, real workplace environments, sensor configurations, and QA criteria.",
                ctaPrimary: "Discuss Data Requirements",
                ctaSecondary: "Scope a Pilot",
                summary: "Technical Spec · Workplace & Rig Setup · Pilot Alignment · QA Delivery"
            },
            pilot: {
                kicker: "Production Model · Specification-First",
                heading: "How Collection Is Organized.",
                s1: { title: "Client Technical Spec", sub: "Define target workflows, camera angles, sensor modalities, delivery schema, and QA gates." },
                s2: { title: "Environment & Capture Setup", sub: "Arrange the matching workplace, skilled operators, and hardware or specialized sensors for the task." },
                s3: { title: "Pilot Alignment", sub: "Validate an initial batch against your schema, sync requirements, and acceptance criteria." },
                s4: { title: "Production & QA Delivery", sub: "Execute structured recording with permissions, privacy review, and pre-delivery quality checks." },
                specMeta: "<strong>Technical Spec Sign-Off</strong> · 7 parameters aligned before recording",
                spec1: "Task taxonomy & workplace environment",
                spec2: "Camera rig & optional sensor modalities",
                spec3: "Resolution, frame rate & timestamps",
                spec4: "Calibration & synchronization targets",
                spec5: "Annotation schema & delivery format",
                spec6: "QA thresholds & batch acceptance criteria",
                spec7: "Hardware logistics & site permissions",
                primaryKicker: "Operating Base",
                primaryList: "Ukraine",
                primarySub: "Core technical scoping, coordination, and local pilot execution.",
                extKicker: "Project-Specific Collection",
                extList: "Germany · Poland · On Request",
                extSub: "Arranged around specific task requirements, site permissions, and hardware scope."
            },
            env: {
                kicker: "Target Workflows · Workplace Environments",
                heading: "Configured Around Real Tasks.",
                d1: { title: "Deformable & Soft-Goods Handling", desc: "Garment folding, ironing, linen turnover, and flexible packaging in live hospitality and laundry settings." },
                d2: { title: "Assembly, Tooling & Thermal Work", desc: "Connectors, cabling, fasteners, soldering/heat tooling, and heated components in workshop environments." },
                d3: { title: "Kitchen & Service Workflows", desc: "Prep tasks, pouring, utensil use, surface/liquid temperature workflows, and multi-step routines." },
                d4: { title: "Client Rigs & Specialized Sensors", desc: "Collection using client-supplied rigs or project-configured sensors—including force/tactile or thermal/IR when specified." }
            },
            ep: {
                kicker: "Modality Layers · Configured Per Spec",
                heading: "Structured Video, Annotations & Optional Sensors.",
                mAll: "All Layers",
                mSync: "Multi-View Framing",
                mKin: "Hand & Object Labels",
                mThermal: "Optional Thermal / IR",
                capAll: "<strong>Configured to your specification</strong> — camera viewpoints, hand/object annotations, task segmentation, and optional sensor streams (such as force/tactile or thermal/IR) are scoped before capture begins.",
                capSync: "<strong>Multi-view camera framing</strong> — ego-centric POV, wrist-mounted, and third-person viewpoints arranged according to your rig specification.",
                capKin: "<strong>Task &amp; contact annotations</strong> — hand pose, object bounding boxes, and subtask boundaries structured to match your training schema.",
                capThermal: "<strong>Optional Beyond-RGB (Thermal / IR)</strong> — additional thermal/IR layer scoped when tasks involve heat, liquids, reflective surfaces, or temperature-sensitive tooling.",
                schemaBadge: "Delivered per Target Schema"
            },
            prov: {
                kicker: "Verifiable Foundations · Governance & Footprint",
                heading: "Provenance, Privacy & QA.",
                n1: { title: "Authorized Access", desc: "Written site permissions & operator consent arranged per pilot." },
                n2: { title: "Privacy Review", desc: "Scoped FOV, workspace cropping & obscuring pre-delivery.*" },
                n3: { title: "QA Gates", desc: "Pre-delivery checks against agreed sync, task & label criteria." },
                n4: { title: "Origin Manifest", desc: "Traceable setup, permissions & QA records documented per batch." },
                note: "*Face obscuring alone does not guarantee complete anonymization · Agreed per engagement without unverified certification claims."
            },
            contact: {
                kicker: "Contact",
                heading: "Discuss Data Requirements.",
                subtitle: "Share the manipulation tasks, environment, sensor modalities, and schema you need to scope a pilot project.",
                p1: "Data Requirements",
                p2: "Scope a Pilot",
                p3: "Custom Rig / Sensors",
                nameLabel: "Name & Organization",
                namePlaceholder: "Your name & robotics team",
                emailLabel: "Work Email",
                emailPlaceholder: "you@company.com",
                msgLabel: "Task Scope, Modalities & Target Format",
                msgPlaceholder: "Target task, environment, required cameras/sensors, and expected delivery format...",
                sendBtn: "Send",
                sendingBtn: "Sending...",
                errMissing: "Please fill in your name, email, and project details.",
                sentOk: "Sent — we will review your requirements and respond shortly.",
                errFallback: "Direct send unavailable right now.",
                errNetwork: "Network issue.",
                sendEmail: "Send via email",
                sitePartnerships: "Site Partnerships"
            },
            partnersPage: {
                title: "PARTNERS",
                tagline: "Physical AI Data Lab · Workplace & facility collaboration for project-based robotics data collection.",
                f1: { title: "Workshops & Bench Space", desc: "Assembly benches, electronics soldering, tooling, and cable work." },
                f2: { title: "Kitchens & Service", desc: "Prep counters, beverage stations, and repeatable food-service workflows." },
                f3: { title: "Laundries & Hospitality", desc: "Folding tables, ironing, linen handling, and garment care spaces." },
                f4: { title: "Warehouses & Packing", desc: "Picking, bagging, sorting, and light manufacturing stations." },
                eyebrow: "Site Collaboration",
                roleTitle: "Data Collection Site Partner",
                roleMeta: "<strong>Ukraine · Project-Specific Regions</strong> · Project-based",
                overviewTitle: "Overview",
                overviewP1: "We work with business owners and domain specialists who can provide access to real workspaces, equipment, and practical workflows when a client project requires that environment.",
                overviewP2: "Relevant environments include workshops, commercial kitchens, warehouses, laundries, and light manufacturing facilities.",
                coordTitle: "Coordination",
                coord1: "<strong>Sverkaus coordinates capture:</strong> recording procedures, sensor setup, and quality checks stay under our coordination.",
                coord2: "<strong>Provide access, not datasets:</strong> partners provide workspace access, tools, and domain expertise.",
                coord3: "<strong>Permissions &amp; privacy:</strong> site agreements, scoped camera framing, and consent are arranged for each project.",
                termsTitle: "Collaboration Model",
                terms1: "<strong>Project-based:</strong> schedule and collaboration terms are agreed individually per project.",
                terms2: "<strong>No ML overhead:</strong> no dataset packaging or labeling required from your staff.",
                terms3: "<strong>Planned around shifts:</strong> collection sessions are scheduled around your regular operations.",
                contactTitle: "Site Inquiry",
                formHeading: "Register Your Workspace.",
                contactNote: "Share a brief overview of your facility, available equipment, and city.",
                namePlaceholder: "Your name & workspace",
                msgLabel: "Workspace, Equipment & City",
                msgPlaceholder: "City, facility type, tools/workflows available...",
                footerNote: 'Looking for roles? Visit <a href="/careers">Careers</a> or email <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>.'
            },
            careers: {
                title: "CAREERS",
                tagline: "Physical AI Data Lab · Project-based engineering, capture operations, and site partnerships.",
                eyebrow: "Partnership Opportunity",
                roleTitle: "Data Collection Site Partner",
                roleMeta: "<strong>Ukraine</strong> · Project-based",
                overviewTitle: "Overview",
                overviewP1: "We collaborate with business owners and industry professionals who can provide access to workspaces, equipment, and specialized workflows for project-based robotics data collection.",
                overviewP2: "Relevant environments include workshops, warehouses, commercial kitchens, laundries, and manufacturing facilities.",
                coordTitle: "Coordination",
                coord1: "<strong>Sverkaus coordinates data collection:</strong> recording procedures, quality control, and on-site execution stay under our coordination.",
                coord2: "<strong>Provide access, not datasets:</strong> partners provide access to real workspaces, equipment, and domain expertise.",
                coord3: "<strong>Permissions &amp; agreements:</strong> necessary permissions and agreements are arranged for each project.",
                termsTitle: "Terms",
                terms1: "<strong>Project-based:</strong> flexible scheduling and terms agreed individually per project.",
                terms2: "<strong>Practical workflows:</strong> workshops, warehouses, kitchens, manufacturing, and skilled tasks.",
                terms3: "<strong>Low operational impact:</strong> planned around your regular schedule.",
                contactTitle: "Contact",
                contactLead: 'Interested? Visit <a href="/partners" class="bold-link">Site Partners</a> or email <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a>.',
                r2Eyebrow: "Engineering & Operations",
                r2Title: "Capture & Data QA Specialist",
                r2Meta: "<strong>Ukraine / Remote / On-Site</strong> · Project-based",
                r2Desc: "Set up multi-camera and sensor configurations per client specification, verify calibration and frame synchronization, and run pre-delivery QA checks across recorded batches.",
                r2Apply: 'Send your background and relevant hardware/data pipeline experience to <a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a> or use the form below.',
                formKicker: "Direct Contact",
                formHeading: "Get in Touch.",
                namePlaceholder: "Your name",
                msgLabel: "Background, Location & Role",
                msgPlaceholder: "Share your experience, relevant hardware/pipeline work, and location...",
                footerNote: 'Don\'t see your role? We\'re always open to exceptional engineers and builders: <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        },
        de: {
            tagline: "Spezifikationsgetriebene Datenerfassung für die Robotik",
            nav: { overview: "Übersicht", partners: "Partner", careers: "Karriere" },
            ui: { details: "Details", close: "Schließen" },
            hero: {
                labName: "Physical AI Datenlabor",
                title: "Spezifikationsgetriebene physische Datenproduktion",
                subtitle: "Maßgeschneiderte Robotik-Datenerfassung nach Ihrer technischen Spezifikation—passend zu Zielaufgaben, realen Arbeitsumgebungen, Sensorik und QA-Kriterien.",
                ctaPrimary: "Datenanforderungen besprechen",
                ctaSecondary: "Pilotprojekt abstimmen",
                summary: "Technische Spec · Umfeld & Rig-Setup · Pilot · QA-Auslieferung"
            },
            pilot: {
                kicker: "Produktionsmodell · Spezifikation zuerst",
                heading: "Wie die Erfassung organisiert wird.",
                s1: { title: "Technische Spezifikation", sub: "Zielabläufe, Kameraperspektiven, Sensorik, Zielschema und QA-Kriterien definieren." },
                s2: { title: "Umgebung & Setup", sub: "Passenden Arbeitsplatz, Fachkräfte sowie Hardware oder Spezial-Sensorik für die Aufgabe einrichten." },
                s3: { title: "Pilot-Abstimmung", sub: "Einen ersten Batch gegen Ihr Schema, Sync-Vorgaben und Abnahmekriterien validieren." },
                s4: { title: "Produktion & QA-Lieferung", sub: "Strukturierte Erfassung mit Freigaben, Datenschutz-Prüfung und Qualitätskontrolle vor Auslieferung." },
                specMeta: "<strong>Technische Spezifikation</strong> · 7 Parameter vor Aufnahme abgestimmt",
                spec1: "Aufgabentaxonomie & Arbeitsumgebung",
                spec2: "Kamera-Rig & optionale Sensormodalitäten",
                spec3: "Auflösung, Bildrate & Zeitstempel",
                spec4: "Kalibrierung & Synchronisationsziele",
                spec5: "Annotationsschema & Lieferformat",
                spec6: "QA-Schwellenwerte & Abnahmekriterien",
                spec7: "Hardware-Logistik & Standortfreigaben",
                primaryKicker: "Operative Basis",
                primaryList: "Ukraine",
                primarySub: "Zentrale technische Planung, Koordination und lokale Pilotdurchführung.",
                extKicker: "Projektbezogene Erfassung",
                extList: "Deutschland · Polen · Auf Anfrage",
                extSub: "Eingerichtet je nach Aufgabenstellung, Standortfreigabe und Hardware-Umfang."
            },
            env: {
                kicker: "Zielabläufe · Arbeitsumgebungen",
                heading: "Auf reale Aufgaben ausgerichtet.",
                d1: { title: "Verformbare Textilien & Soft Goods", desc: "Falten, Bügeln, Wäschewechsel und flexible Verpackungen im laufenden Betrieb." },
                d2: { title: "Montage, Werkzeuge & thermische Arbeit", desc: "Stecker, Kabel, Befestigung, Löten/Heißluft und erhitzte Bauteile in Werkstätten." },
                d3: { title: "Küchen- & Serviceabläufe", desc: "Vorbereitung, Ausgießen, Werkzeuge, Oberflächen-/Flüssigkeitstemperaturen und Mehr-Schritt-Routinen." },
                d4: { title: "Kunden-Rigs & Spezial-Sensorik", desc: "Erfassung mit kundeneigenen Rigs oder projektspezifischer Sensorik—inkl. Kraft/Taktil oder Thermal/IR bei Bedarf." }
            },
            ep: {
                kicker: "Modalitätsebenen · Nach Spezifikation",
                heading: "Strukturiertes Video, Annotationen & optionale Sensorik.",
                mAll: "Alle Ebenen",
                mSync: "Multi-View-Perspektiven",
                mKin: "Hand- & Objektlabels",
                mThermal: "Optionales Thermal / IR",
                capAll: "<strong>Nach Ihrer Spezifikation konfiguriert</strong> — Kamerawinkel, Hand-/Objektannotationen, Aufgabensegmente und optionale Sensorkanäle (Kraft/Taktil oder Thermal/IR).",
                capSync: "<strong>Multi-View-Kameraführung</strong> — Ego-POV, Handgelenk- und Drittperspektive gemäß Ihrer Rig-Spezifikation.",
                capKin: "<strong>Aufgaben- & Kontaktannotationen</strong> — Handpose, Objekt-Bounding-Boxes und Subtask-Grenzen passend zu Ihrem Trainingsschema.",
                capThermal: "<strong>Optionales Beyond-RGB (Thermal / IR)</strong> — zusätzlicher Thermal-/IR-Kanal bei Wärme, Flüssigkeiten, Reflexionen oder temperaturkritischen Werkzeugen.",
                schemaBadge: "Lieferung im Zielschema"
            },
            prov: {
                kicker: "Nachvollziehbare Grundlagen · Governance",
                heading: "Herkunft, Datenschutz & QA.",
                n1: { title: "Autorisierter Zugang", desc: "Schriftliche Standortgenehmigungen & Einwilligungen pro Pilot." },
                n2: { title: "Datenschutz-Prüfung", desc: "Begrenztes Sichtfeld, Zuschnitt & Verpixelung vor Auslieferung.*" },
                n3: { title: "QA-Gates", desc: "Prüfung vor Lieferung auf vereinbarte Sync-, Aufgaben- & Label-Kriterien." },
                n4: { title: "Herkunftsmanifest", desc: "Nachvollziehbare Setup-, Rechte- & QA-Protokolle je Batch." },
                note: "*Gesichtsverpixelung allein garantiert keine vollständige Anonymisierung · Projektbezogen vereinbart ohne ungeprüfte Zertifizierungsansprüche."
            },
            contact: {
                kicker: "Kontakt",
                heading: "Datenanforderungen besprechen.",
                subtitle: "Beschreiben Sie Zielaufgaben, Umgebung, Sensorik und Lieferformat für ein Pilotprojekt.",
                p1: "Datenanforderungen",
                p2: "Pilotprojekt",
                p3: "Eigenes Rig / Sensorik",
                nameLabel: "Name & Organisation",
                namePlaceholder: "Ihr Name & Robotik-Team",
                emailLabel: "Geschäftliche E-Mail",
                emailPlaceholder: "sie@unternehmen.de",
                msgLabel: "Aufgabenumfang, Modalitäten & Zielformat",
                msgPlaceholder: "Zielaufgabe, Umgebung, benötigte Kameras/Sensoren und erwartetes Lieferformat...",
                sendBtn: "Senden",
                sendingBtn: "Wird gesendet...",
                errMissing: "Bitte Name, E-Mail und Projektdetails ausfüllen.",
                sentOk: "Gesendet — wir prüfen Ihre Anforderungen und melden uns in Kürze.",
                errFallback: "Direktversand derzeit nicht verfügbar.",
                errNetwork: "Netzwerkfehler.",
                sendEmail: "Per E-Mail senden",
                sitePartnerships: "Standort-Partnerschaften"
            },
            partnersPage: {
                title: "PARTNER",
                tagline: "Physical AI Datenlabor · Standortkooperationen für projektbasierte Robotik-Datenerfassung.",
                f1: { title: "Werkstätten & Montage", desc: "Montagetische, Elektronik-Löten, Werkzeuge und Kabelarbeiten." },
                f2: { title: "Küchen & Service", desc: "Zubereitungstheken, Getränkestationen und wiederholbare Gastronomieabläufe." },
                f3: { title: "Wäscherei & Gastgewerbe", desc: "Falttische, Bügeln, Wäschehandling und Textilpflege." },
                f4: { title: "Lager & Verpackung", desc: "Kommissionierung, Verpacken, Sortieren und leichte Fertigung." },
                eyebrow: "Standortkooperation",
                roleTitle: "Standortpartner für Datenerfassung",
                roleMeta: "<strong>Ukraine · Projektbezogene Regionen</strong> · Projektbasiert",
                overviewTitle: "Überblick",
                overviewP1: "Wir arbeiten mit Betrieben zusammen, die Zugang zu realen Arbeitsbereichen, Geräten und Abläufen bieten, wenn ein Kundenprojekt diese Umgebung erfordert.",
                overviewP2: "Geeignete Umgebungen sind Werkstätten, Großküchen, Lagerhäuser, Wäschereien und Produktionsstätten.",
                coordTitle: "Koordination",
                coord1: "<strong>Sverkaus koordiniert die Erfassung:</strong> Aufnahmeabläufe, Sensor-Setup und Qualitätskontrolle bleiben bei uns.",
                coord2: "<strong>Zugang statt Datensätze:</strong> Partner stellen Räume, Werkzeuge und Fachwissen bereit.",
                coord3: "<strong>Freigaben &amp; Datenschutz:</strong> Verträge, begrenztes Sichtfeld und Einwilligungen werden je Projekt geregelt.",
                termsTitle: "Kooperationsmodell",
                terms1: "<strong>Projektbasiert:</strong> Zeitplan und Konditionen werden je Projekt individuell vereinbart.",
                terms2: "<strong>Kein ML-Aufwand:</strong> Keine Datenaufbereitung oder Annotation durch Ihr Personal nötig.",
                terms3: "<strong>Passend zum Betrieb:</strong> Aufnahmetermine orientieren sich an Ihren regulären Abläufen.",
                contactTitle: "Standort-Anfrage",
                formHeading: "Arbeitsbereich anmelden.",
                contactNote: "Teilen Sie uns kurz Ihren Betrieb, vorhandene Ausstattung und Ihren Standort mit.",
                namePlaceholder: "Ihr Name & Betrieb",
                msgLabel: "Arbeitsbereich, Ausstattung & Stadt",
                msgPlaceholder: "Stadt, Betriebsart, verfügbare Werkzeuge/Prozesse...",
                footerNote: 'Offene Positionen gesucht? Besuchen Sie <a href="/careers">Karriere</a> oder schreiben Sie an <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>.'
            },
            careers: {
                title: "KARRIERE",
                tagline: "Physical AI Datenlabor · Projektbasierte Rollen in Erfassungstechnik, QA und Standortpartnerschaften.",
                eyebrow: "Partnerschaftsmöglichkeit",
                roleTitle: "Standortpartner für Datenerfassung",
                roleMeta: "<strong>Ukraine</strong> · Projektbasiert",
                overviewTitle: "Überblick",
                overviewP1: "Wir suchen Geschäftsinhaber und Branchenprofis, die Zugang zu Arbeitsbereichen, Ausrüstung und Fachwissen für projektbasierte Robotik-Datenerfassung bieten können.",
                overviewP2: "Geeignete Umgebungen sind Werkstätten, Lager, Großküchen, Wäschereien und Produktionsstätten.",
                coordTitle: "Koordination",
                coord1: "<strong>Sverkaus koordiniert die Erfassung:</strong> Aufnahmeverfahren, Qualitätskontrolle und Durchführung vor Ort bleiben in unserer Hand.",
                coord2: "<strong>Zugang statt Datensätze:</strong> Partner stellen Zugang zu realen Arbeitsplätzen, Geräten und Fachwissen bereit.",
                coord3: "<strong>Genehmigungen &amp; Verträge:</strong> Erforderliche Freigaben und Vereinbarungen werden für jedes Projekt geregelt.",
                termsTitle: "Konditionen",
                terms1: "<strong>Projektbasiert:</strong> Flexible Terminplanung und Konditionen werden je Projekt individuell vereinbart.",
                terms2: "<strong>Praxisfokus:</strong> Werkstätten, Lager, Küchen, Produktion und qualifizierte Arbeitsabläufe.",
                terms3: "<strong>Geringer Aufwand:</strong> Planung passend zu Ihrem regulären Betriebsablauf.",
                contactTitle: "Kontakt",
                contactLead: 'Interessiert? Besuchen Sie <a href="/partners" class="bold-link">Standort-Partner</a> oder schreiben Sie an <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a>.',
                r2Eyebrow: "Engineering & Operations",
                r2Title: "Capture & Data QA Specialist",
                r2Meta: "<strong>Ukraine / Remote / Vor Ort</strong> · Projektbasiert",
                r2Desc: "Aufbau von Multi-Kamera- und Sensor-Setups nach Kundenspezifikation, Prüfung von Kalibrierung und Sync sowie Durchführung von Pre-Delivery-QA-Checks.",
                r2Apply: 'Senden Sie Ihr Profil an <a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a> oder nutzen Sie das Formular unten.',
                formKicker: "Direktkontakt",
                formHeading: "Kontakt aufnehmen.",
                namePlaceholder: "Ihr Name",
                msgLabel: "Profil, Standort & Rolle",
                msgPlaceholder: "Beschreiben Sie Ihre Erfahrung mit Hardware/Daten-Pipelines und Ihren Standort...",
                footerNote: 'Keine passende Rolle dabei? Wir freuen uns jederzeit über außergewöhnliche Ingenieure und Builder: <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        },
        pl: {
            tagline: "Produkcja danych fizycznych dla robotyki pod specyfikację klienta",
            nav: { overview: "Przegląd", partners: "Partnerzy", careers: "Kariera" },
            ui: { details: "Szczegóły", close: "Zamknij" },
            hero: {
                labName: "Laboratorium Danych Physical AI",
                title: "Produkcja danych fizycznych pod specyfikację techniczną",
                subtitle: "Organizujemy dedykowane zbieranie danych dla robotyki od specyfikacji po odbiór QA—dobierając zadania, rzeczywiste środowiska pracy, sensory i kryteria jakości.",
                ctaPrimary: "Omów wymagania danych",
                ctaSecondary: "Zaplanuj pilotaż",
                summary: "Specyfikacja techniczna · Środowisko i zestaw · Pilotaż · Kontrola QA"
            },
            pilot: {
                kicker: "Model produkcji · Specyfikacja na start",
                heading: "Jak organizujemy zbieranie danych.",
                s1: { title: "Specyfikacja techniczna klienta", sub: "Określenie docelowych zadań, ujęć kamer, modalności sensorów, schematu i kryteriów QA." },
                s2: { title: "Środowisko i konfiguracja", sub: "Dobór miejsca pracy, operatorów oraz sprzętu lub specjalistycznych sensorów pod zadanie." },
                s3: { title: "Uzgodnienie pilotażu", sub: "Weryfikacja pierwszej partii pod kątem schematu, synchronizacji i kryteriów odbioru." },
                s4: { title: "Produkcja i kontrola QA", sub: "Realizacja nagrań wraz ze zgodami, przeglądem prywatności i weryfikacją jakości przed dostawą." },
                specMeta: "<strong>Akceptacja specyfikacji technicznej</strong> · 7 parametrów uzgodnionych przed nagraniem",
                spec1: "Taksonomia zadań i środowisko pracy",
                spec2: "Zestaw kamer i opcjonalne sensory",
                spec3: "Rozdzielczość, FPS i znaczniki czasu",
                spec4: "Kalibracja i cele synchronizacji",
                spec5: "Schemat adnotacji i format dostawy",
                spec6: "Progi QA i kryteria odbioru partii",
                spec7: "Logistyka sprzętu i zgody obiektu",
                primaryKicker: "Baza operacyjna",
                primaryList: "Ukraina",
                primarySub: "Główna koordynacja techniczna, specyfikacja i lokalna realizacja pilotaży.",
                extKicker: "Zbiórki projektowe",
                extList: "Niemcy · Polska · Na zapytanie",
                extSub: "Organizowane pod konkretne wymagania zadania, zgody obiektów i zakres sprzętowy."
            },
            env: {
                kicker: "Docelowe procesy · Środowiska pracy",
                heading: "Konfigurowane wokół realnych zadań.",
                d1: { title: "Materiały odkształcalne i tekstylia", desc: "Składanie odzieży, prasowanie, wymiana pościeli i miękkie opakowania w prawdziwych obiektach." },
                d2: { title: "Montaż, narzędzia i prace termiczne", desc: "Złącza, okablowanie, elementy złączne, lutowanie/nagrzewnice i rozgrzane komponenty w warsztatach." },
                d3: { title: "Procesy kuchenne i usługowe", desc: "Przygotowanie potraw, nalewanie, praca narzędziami, zadania z temperaturą powierzchni i płynów." },
                d4: { title: "Zestawy klienta i sensory specjalne", desc: "Nagrania na sprzęcie klienta lub w konfiguracji projektowej—w tym sensory siły/dotyku lub Thermal/IR." }
            },
            ep: {
                kicker: "Warstwy modalności · Konfiguracja pod spec",
                heading: "Ustrukturyzowane wideo, adnotacje i opcjonalne sensory.",
                mAll: "Wszystkie warstwy",
                mSync: "Ujęcia wielokamerowe",
                mKin: "Etykiety dłoni i obiektów",
                mThermal: "Opcjonalny Thermal / IR",
                capAll: "<strong>Konfiguracja pod Twoją specyfikację</strong> — perspektywy kamer, adnotacje dłoni i obiektów, segmentacja podzadań oraz opcjonalne kanały sensorów (np. siła/dotyk lub Thermal/IR).",
                capSync: "<strong>Ujęcia wielokamerowe</strong> — widok pierwszoosobowy POV, kamera nadgarstkowa i trzecioosobowa dobrane pod wymogi zestawu.",
                capKin: "<strong>Adnotacje zadań i kontaktu</strong> — poza dłoni, ramki obiektów oraz granice podzadań dopasowane do schematu treningowego.",
                capThermal: "<strong>Opcjonalny Beyond-RGB (Thermal / IR)</strong> — dodatkowy kanał termowizyjny/IR przy pracy z ciepłem, płynami, odblaskami lub szkłem.",
                schemaBadge: "Dostawa w docelowym schemacie"
            },
            prov: {
                kicker: "Weryfikowalne podstawy · Zarządzanie danymi",
                heading: "Pochodzenie, prywatność i QA.",
                n1: { title: "Autoryzowany dostęp", desc: "Pisemne zgody obiektów i operatorów dla każdego pilotażu." },
                n2: { title: "Przegląd prywatności", desc: "Zawężony kadr, kadrowanie i anonimizacja przed dostawą.*" },
                n3: { title: "Bramki QA", desc: "Kontrola przed dostawą pod kątem uzgodnionych kryteriów sync, zadań i etykiet." },
                n4: { title: "Manifest pochodzenia", desc: "Pełna dokumentacja konfiguracji, praw i QA dla partii." },
                note: "*Samo zamazanie twarzy nie gwarantuje pełnej anonimizacji · Ustalane indywidualnie bez niezweryfikowanych deklaracji certyfikacji."
            },
            contact: {
                kicker: "Kontakt",
                heading: "Omów wymagania danych.",
                subtitle: "Opisz docelowe zadania manipulacji, środowisko, modalności sensorów i schemat eksportu pod pilotaż.",
                p1: "Wymagania danych",
                p2: "Pilotaż",
                p3: "Własny zestaw / Sensory",
                nameLabel: "Imię i organizacja",
                namePlaceholder: "Twoje imię i zespół robotyki",
                emailLabel: "E-mail służbowy",
                emailPlaceholder: "ty@firma.pl",
                msgLabel: "Zakres zadań, modalności i format",
                msgPlaceholder: "Docelowe zadanie, środowisko, wymagane kamery/sensory i oczekiwany format dostawy...",
                sendBtn: "Wyślij",
                sendingBtn: "Wysyłanie...",
                errMissing: "Wpisz imię, adres e-mail oraz szczegóły projektu.",
                sentOk: "Wysłano — przeanalizujemy wymagania i odezwiemy się wkrótce.",
                errFallback: "Bezpośrednie wysłanie jest teraz niedostępne.",
                errNetwork: "Problem z siecią.",
                sendEmail: "Wyślij e-mailem",
                sitePartnerships: "Partnerstwa obiektów"
            },
            partnersPage: {
                title: "PARTNERZY",
                tagline: "Laboratorium Danych Physical AI · Współpraca z obiektami przy projektowym zbieraniu danych.",
                f1: { title: "Warsztaty i stanowiska", desc: "Stoły montażowe, lutowanie elektroniki, narzędzia i okablowanie." },
                f2: { title: "Kuchnie i gastronomia", desc: "Stanowiska przygotowawcze, bary napojów i powtarzalne procesy kuchenne." },
                f3: { title: "Pralnie i hotelarstwo", desc: "Stoły do składania, prasowanie, pościel i pielęgnacja tekstyliów." },
                f4: { title: "Magazyny i pakowanie", desc: "Kompletacja, pakowanie, sortowanie i lekka produkcja." },
                eyebrow: "Współpraca obiektowa",
                roleTitle: "Partner obiektu do zbierania danych",
                roleMeta: "<strong>Ukraina · Regiony projektowe</strong> · Model projektowy",
                overviewTitle: "Opis",
                overviewP1: "Współpracujemy z właścicielami firm i specjalistami, którzy mogą udostępnić przestrzenie robocze, sprzęt i praktyczne procesy, gdy wymaga tego projekt klienta.",
                overviewP2: "Odpowiednie środowiska to warsztaty, kuchnie komercyjne, magazyny, pralnie i zakłady produkcyjne.",
                coordTitle: "Koordynacja",
                coord1: "<strong>Sverkaus koordynuje zbiórkę:</strong> procedury nagrań, konfiguracja sensorów i kontrola jakości pozostają po naszej stronie.",
                coord2: "<strong>Udostępniasz dostęp, nie zbiory:</strong> partnerzy zapewniają przestrzeń, narzędzia i wiedzę praktyczną.",
                coord3: "<strong>Zgody i prywatność:</strong> umowy obiektowe, zawężone kadrowanie i zgody ustalamy dla każdego projektu.",
                termsTitle: "Model współpracy",
                terms1: "<strong>Projektowo:</strong> harmonogram i warunki ustalane indywidualnie dla każdego projektu.",
                terms2: "<strong>Bez obciążenia ML:</strong> zespół obiektu nie zajmuje się przygotowaniem ani etykietowaniem danych.",
                terms3: "<strong>Zgodnie z grafikiem:</strong> sesje planowane wokół regularnej pracy obiektu.",
                contactTitle: "Zgłoszenie obiektu",
                formHeading: "Zgłoś swoją przestrzeń.",
                contactNote: "Opisz krótko swój obiekt, dostępny sprzęt i miasto.",
                namePlaceholder: "Twoje imię i obiekt",
                msgLabel: "Przestrzeń, sprzęt i miasto",
                msgPlaceholder: "Miasto, typ obiektu, dostępne narzędzia i procesy...",
                footerNote: 'Szukasz rekrutacji? Odwiedź <a href="/careers">Kariera</a> lub napisz na <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>.'
            },
            careers: {
                title: "KARIERA",
                tagline: "Laboratorium Danych Physical AI · Projektowe role inżynieryjne, operacje nagrań i partnerstwa obiektów.",
                eyebrow: "Możliwość współpracy",
                roleTitle: "Partner obiektu do zbierania danych",
                roleMeta: "<strong>Ukraina</strong> · Model projektowy",
                overviewTitle: "Opis",
                overviewP1: "Szukamy właścicieli firm i specjalistów branżowych, którzy mogą udostępnić przestrzenie robocze, sprzęt oraz wiedzę praktyczną do projektowego zbierania danych dla robotyki.",
                overviewP2: "Odpowiednie środowiska to warsztaty, magazyny, kuchnie komercyjne, pralnie i zakłady produkcyjne.",
                coordTitle: "Koordynacja",
                coord1: "<strong>Sverkaus koordynuje zbieranie danych:</strong> procedury nagrań, kontrola jakości i realizacja na miejscu pozostają po naszej stronie.",
                coord2: "<strong>Udostępniasz dostęp, nie gotowe zbiory:</strong> partnerzy zapewniają dostęp do prawdziwych stanowisk, sprzętu i wiedzy.",
                coord3: "<strong>Zgody i umowy:</strong> wymagane zgody i umowy przygotowujemy indywidualnie dla każdego projektu.",
                termsTitle: "Warunki",
                terms1: "<strong>Projektowo:</strong> elastyczny harmonogram i warunki ustalane osobno dla każdego projektu.",
                terms2: "<strong>Praktyczne procesy:</strong> warsztaty, magazyny, kuchnie, produkcja i wyspecjalizowane prace manualne.",
                terms3: "<strong>Minimalne obciążenie:</strong> nagrania planowane zgodnie z Twoim regularnym grafikiem.",
                contactTitle: "Kontakt",
                contactLead: 'Zainteresowany? Odwiedź <a href="/partners" class="bold-link">Partnerzy obiektów</a> lub napisz na <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a>.',
                r2Eyebrow: "Inżynieria i operacje",
                r2Title: "Specjalista ds. nagrań i QA danych",
                r2Meta: "<strong>Ukraina / Zdalnie / Na miejscu</strong> · Projektowo",
                r2Desc: "Konfiguracja zestawów wielokamerowych i sensorów pod specyfikację klienta, weryfikacja kalibracji i synchronizacji oraz kontrola QA przed dostawą.",
                r2Apply: 'Wyślij swoje doświadczenie na <a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a> lub użyj formularza poniżej.',
                formKicker: "Kontakt bezpośredni",
                formHeading: "Napisz do nas.",
                namePlaceholder: "Twoje imię",
                msgLabel: "Doświadczenie, lokalizacja i rola",
                msgPlaceholder: "Opisz swoje doświadczenie ze sprzętem/danymi oraz lokalizację...",
                footerNote: 'Nie widzisz swojej roli? Zawsze chętnie porozmawiamy z wyjątkowymi inżynierami i twórcami: <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        },
        zh: {
            tagline: "按客户技术规范组织的机器人物理数据生产",
            nav: { overview: "概览", partners: "合作伙伴", careers: "招聘" },
            ui: { details: "详情", close: "收起" },
            hero: {
                labName: "Physical AI 数据实验室",
                title: "面向复杂操作的规范驱动物理数据生产",
                subtitle: "依据您的技术规范组织定制化机器人数据采集——匹配目标任务、真实作业场地、传感器配置及质检标准。",
                ctaPrimary: "沟通数据需求",
                ctaSecondary: "规划试点项目",
                summary: "技术规格 · 场地与设备配置 · 试点对齐 · 质检交付"
            },
            pilot: {
                kicker: "生产模式 · 规格先行",
                heading: "我们如何组织数据采集。",
                s1: { title: "客户技术规格", sub: "明确目标工作流、相机视角、传感器模态、交付格式与质检门槛。" },
                s2: { title: "场地与采集配置", sub: "匹配对应作业场所、熟练操作员及任务所需的硬件或专用传感器。" },
                s3: { title: "试点对齐", sub: "按您的数据格式、同步要求和验收标准验证首批试点数据。" },
                s4: { title: "生产与质检交付", sub: "在完备授权、隐私审查与交付前质检下执行结构化录制。" },
                specMeta: "<strong>技术规格确认</strong> · 录制前对齐 7 项核心参数",
                spec1: "任务分类与作业环境",
                spec2: "相机阵列与可选传感器模态",
                spec3: "分辨率、帧率与时间戳",
                spec4: "标定与时间同步要求",
                spec5: "标注格式与交付数据结构",
                spec6: "质检阈值与批次验收标准",
                spec7: "硬件物流与场地许可",
                primaryKicker: "核心运营基地",
                primaryList: "乌克兰",
                primarySub: "负责核心技术对接、项目协调与本地试点执行。",
                extKicker: "按项目组织的采集地区",
                extList: "德国 · 波兰 · 按需求安排",
                extSub: "根据具体任务需求、场地许可与硬件条件进行项目化部署。"
            },
            env: {
                kicker: "目标工作流 · 实际作业环境",
                heading: "围绕真实任务配置采集。",
                d1: { title: "柔性物体与织物操作", desc: "在真实住宿与洗护场景中执行叠衣、熨烫、布草更换及软包装操作。" },
                d2: { title: "装配、工具与热工任务", desc: "车间环境下的接插件、线束、紧固件、焊接/热风工具及加热部件操作。" },
                d3: { title: "后厨与服务流程", desc: "备餐、倾倒液体、刀具与器具操作、表面/饮品温度流程及多步骤作业。" },
                d4: { title: "客户设备与专用传感器", desc: "使用客户自带采集设备或按项目配置的专用传感器（如力/触觉或热成像/红外）。" }
            },
            ep: {
                kicker: "模态层级 · 按规范配置",
                heading: "结构化视频、标注与可选传感器。",
                mAll: "全部图层",
                mSync: "多视角画面",
                mKin: "手部与目标标注",
                mThermal: "可选热成像 / 红外",
                capAll: "<strong>按您的规范定制</strong> — 相机视角、手部与物体标注、子任务切分及可选传感器流（如力/触觉或热成像/红外）均在采集前确认。",
                capSync: "<strong>多视角画面配置</strong> — 按您的设备规格组合第一视角、腕部及第三视角相机。",
                capKin: "<strong>任务与接触标注</strong> — 匹配您训练格式的手部姿态、目标框与子任务边界。",
                capThermal: "<strong>可选 Beyond-RGB（热成像 / 红外）</strong> — 适用于涉及加热、液体、反光或温敏工具的任务。",
                schemaBadge: "按目标格式交付"
            },
            prov: {
                kicker: "可验证基础 · 数据治理与覆盖",
                heading: "溯源、隐私与质检。",
                n1: { title: "授权准入", desc: "每个试点均具备书面场地许可与操作员同意书。" },
                n2: { title: "隐私审查", desc: "交付前完成视角限定、画面裁剪与脱敏处理。*" },
                n3: { title: "质检门控", desc: "交付前依据约定的同步、任务及标注标准进行校验。" },
                n4: { title: "溯源清单", desc: "每批次记录可追溯的配置、授权与质检日志。" },
                note: "*仅进行人脸模糊处理无法保证完全匿名化 · 按具体合作项目约定，不做未经核实的认证声明。"
            },
            contact: {
                kicker: "联系我们",
                heading: "沟通您的数据需求。",
                subtitle: "欢迎分享目标操作任务、作业环境、传感器模态与格式要求，共同规划试点项目。",
                p1: "沟通数据需求",
                p2: "规划试点项目",
                p3: "定制设备 / 传感器",
                nameLabel: "姓名与机构",
                namePlaceholder: "您的姓名与机器人团队",
                emailLabel: "工作邮箱",
                emailPlaceholder: "you@company.com",
                msgLabel: "任务范围、模态与目标格式",
                msgPlaceholder: "目标任务、环境条件、所需相机/传感器及预期交付格式...",
                sendBtn: "发送",
                sendingBtn: "发送中...",
                errMissing: "请填写姓名、邮箱和项目详情。",
                sentOk: "已发送 — 我们将尽快评估您的需求并与您联系。",
                errFallback: "当前无法直接发送。",
                errNetwork: "网络连接异常。",
                sendEmail: "改用邮件发送",
                sitePartnerships: "场地合作"
            },
            partnersPage: {
                title: "合作伙伴",
                tagline: "Physical AI 数据实验室 · 面向项目制机器人数据采集的场地合作。",
                f1: { title: "车间与工作台", desc: "装配台、电子焊接、工具操作及线束加工。" },
                f2: { title: "后厨与服务", desc: "备餐台、饮品操作台及可重复的餐饮服务流程。" },
                f3: { title: "洗衣与酒店服务", desc: "叠衣台、熨烫、布草整理及织物护理空间。" },
                f4: { title: "仓储与包装", desc: "拣选、装袋、分拣及轻型制造工位。" },
                eyebrow: "场地合作",
                roleTitle: "数据采集场地合作伙伴",
                roleMeta: "<strong>乌克兰 · 按项目匹配地区</strong> · 项目制",
                overviewTitle: "项目简介",
                overviewP1: "当客户项目需要特定作业环境时，我们与能够提供真实工作场所、设备及操作流程的企业主和行业专家展开合作。",
                overviewP2: "适用环境包括车间、商用厨房、仓库、洗衣房和轻型制造设施。",
                coordTitle: "协作方式",
                coord1: "<strong>Sverkaus 负责采集协调：</strong>录制流程、传感器配置与质量检查均由我们统筹安排。",
                coord2: "<strong>提供场地而非数据集：</strong>合作伙伴只需提供真实工作空间、工具与专业经验。",
                coord3: "<strong>许可与隐私：</strong>每个项目均提前签署场地协议、限定相机视角并取得同意。",
                termsTitle: "合作模式",
                terms1: "<strong>项目制：</strong>时间安排与合作条款按具体项目单独商定。",
                terms2: "<strong>零 ML 负担：</strong>无需贵司团队处理数据打包或标注。",
                terms3: "<strong>围绕日常运营排期：</strong>采集工作配合您的正常营业时间安排。",
                contactTitle: "场地登记",
                formHeading: "登记您的工作场所。",
                contactNote: "请简要介绍您的场地类型、现有设备及所在城市。",
                namePlaceholder: "您的姓名与场地名称",
                msgLabel: "场地、设备与城市",
                msgPlaceholder: "城市、场地类型、可用工具与工作流程...",
                footerNote: '寻找职位机会？请访问 <a href="/careers">招聘</a> 或发邮件至 <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>。'
            },
            careers: {
                title: "招贤纳士",
                tagline: "Physical AI 数据实验室 · 项目制工程、现场采集运营与场地合作。",
                eyebrow: "合作机会",
                roleTitle: "数据采集场地合作伙伴",
                roleMeta: "<strong>乌克兰</strong> · 项目制",
                overviewTitle: "项目简介",
                overviewP1: "我们正在寻找能够为项目制机器人数据采集提供工作场所、设备及专业工作流的企业主与行业人士。",
                overviewP2: "适用环境包括车间、仓库、商用厨房、洗衣房及制造设施。",
                coordTitle: "协作方式",
                coord1: "<strong>Sverkaus 负责采集协调：</strong>录制流程、质量控制及现场执行均由我们统一协调。",
                coord2: "<strong>提供场地而非数据集：</strong>合作伙伴提供真实工作空间、设备及领域经验。",
                coord3: "<strong>许可与协议：</strong>每次合作均会安排所需的场地许可与合作协议。",
                termsTitle: "合作条款",
                terms1: "<strong>项目制合作：</strong>时间安排灵活，合作条件按单个项目协商确定。",
                terms2: "<strong>聚焦实操流程：</strong>车间、仓库、厨房、制造设施及专业技能任务。",
                terms3: "<strong>低运营干扰：</strong>围绕您的常规日程安排录制。",
                contactTitle: "联系方式",
                contactLead: '有兴趣合作？请访问 <a href="/partners" class="bold-link">场地合作</a> 或发邮件至 <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a>。',
                r2Eyebrow: "工程与运营",
                r2Title: "采集与数据质检专员",
                r2Meta: "<strong>乌克兰 / 远程 / 现场</strong> · 项目制",
                r2Desc: "依据客户规格搭建多相机及传感器配置，验证标定与帧同步，并在交付前执行批次质检。",
                r2Apply: '请将个人履历与硬件/数据管线经验发送至 <a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a> 或填写下方表单。',
                formKicker: "直接联系",
                formHeading: "联系我们。",
                namePlaceholder: "您的姓名",
                msgLabel: "背景、所在城市与意向方向",
                msgPlaceholder: "请分享您的相关硬件/数据管线经验及所在城市...",
                footerNote: '未找到合适方向？我们始终欢迎优秀的工程师与创造者联系：<a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        },
        hi: {
            tagline: "रोबोटिक्स के लिए स्पेसिफिकेशन-आधारित फिजिकल डेटा उत्पादन",
            nav: { overview: "अवलोकन", partners: "पार्टनर्स", careers: "करियर" },
            ui: { details: "विवरण", close: "बंद करें" },
            hero: {
                labName: "Physical AI डेटा लैब",
                title: "स्पेसिफिकेशन-आधारित फिजिकल डेटा उत्पादन",
                subtitle: "आपकी तकनीकी आवश्यकताओं के अनुसार संगठित कस्टम रोबोटिक्स डेटा संग्रह—लक्षित कार्य, वास्तविक कार्यस्थल, सेंसर सेटअप और QA मानदंडों के अनुरूप।",
                ctaPrimary: "डेटा आवश्यकताओं पर चर्चा करें",
                ctaSecondary: "पायलट स्कोप करें",
                summary: "तकनीकी स्पेक · कार्यस्थल व रिग सेटअप · पायलट · QA डिलीवरी"
            },
            pilot: {
                kicker: "उत्पादन मॉडल · स्पेसिफिकेशन-प्रथम",
                heading: "डेटा संग्रह कैसे संगठित होता है।",
                s1: { title: "क्लाइंट तकनीकी स्पेक", sub: "लक्षित कार्यप्रवाह, कैमरा एंगल, सेंसर मॉडैलिटी, डिलीवरी स्कीमा और QA गेट तय करें।" },
                s2: { title: "वातावरण व कैप्चर सेटअप", sub: "कार्य के अनुरूप कार्यस्थल, कुशल ऑपरेटर और हार्डवेयर या विशेष सेंसर की व्यवस्था।" },
                s3: { title: "पायलट संरेखण", sub: "आपके स्कीमा, सिंक आवश्यकताओं और स्वीकृति मानदंडों पर प्रारंभिक बैच का सत्यापन।" },
                s4: { title: "उत्पादन व QA डिलीवरी", sub: "अनुमतियों, गोपनीयता समीक्षा और डिलीवरी-पूर्व जांच के साथ व्यवस्थित रिकॉर्डिंग।" },
                specMeta: "<strong>तकनीकी विनिर्देश साइन-ऑफ़</strong> · रिकॉर्डिंग से पहले 7 मानदंड तय",
                spec1: "कार्य वर्गीकरण और कार्यस्थल वातावरण",
                spec2: "कैमरा रिग और वैकल्पिक सेंसर मॉडैलिटी",
                spec3: "रिज़ॉल्यूशन, फ़्रेम दर और टाइमस्टैम्प",
                spec4: "कैलिब्रेशन और सिंक्रनाइज़ेशन लक्ष्य",
                spec5: "एनोटेशन स्कीमा और डिलीवरी फ़ॉर्मेट",
                spec6: "QA सीमाएँ और बैच स्वीकृति मानदंड",
                spec7: "हार्डवेयर लॉजिस्टिक्स और साइट अनुमतियाँ",
                primaryKicker: "संचालन आधार",
                primaryList: "यूक्रेन",
                primarySub: "मुख्य तकनीकी स्कोपिंग, समन्वय और स्थानीय पायलट निष्पादन।",
                extKicker: "प्रोजेक्ट-आधारित संग्रह",
                extList: "जर्मनी · पोलैंड · अनुरोध पर",
                extSub: "कार्य की आवश्यकताओं, साइट अनुमतियों और हार्डवेयर दायरे के अनुसार व्यवस्थित।"
            },
            env: {
                kicker: "लक्षित कार्यप्रवाह · कार्यस्थल वातावरण",
                heading: "वास्तविक कार्यों के अनुरूप सेटअप।",
                d1: { title: "डीफॉर्मेबल और सॉफ्ट-गुड्स हैंडलिंग", desc: "कपड़े मोड़ना, इस्त्री करना, लिनन बदलना और लचीली पैकेजिंग।" },
                d2: { title: "असेंबली, टूलिंग और थर्मल कार्य", desc: "कनेक्टर, केबलिंग, फास्टनर, सोल्डरिंग/हीट टूल और गर्म पुर्जे।" },
                d3: { title: "किचन और सर्विस वर्कफ़्लो", desc: "तैयारी, तरल डालना, बर्तन उपयोग, सतह/तरल तापमान कार्य और मल्टी-स्टेप प्रक्रियाएँ।" },
                d4: { title: "क्लाइंट रिग्स और विशेष सेंसर", desc: "क्लाइंट के उपकरणों या प्रोजेक्ट-कॉन्फ़िगर सेंसर (जैसे फोर्स/टैक्टाइल या थर्मल/IR) के साथ संग्रह।" }
            },
            ep: {
                kicker: "मॉडैलिटी लेयर्स · स्पेक के अनुसार",
                heading: "व्यवस्थित वीडियो, एनोटेशन और वैकल्पिक सेंसर।",
                mAll: "सभी लेयर",
                mSync: "मल्टी-व्यू फ़्रेमिंग",
                mKin: "हैंड व ऑब्जेक्ट लेबल",
                mThermal: "वैकल्पिक थर्मल / IR",
                capAll: "<strong>आपकी आवश्यकताओं के अनुसार कॉन्फ़िगर</strong> — कैमरा कोण, हैंड/ऑब्जेक्ट एनोटेशन, टास्क सेगमेंटेशन और वैकल्पिक सेंसर (फोर्स/टैक्टाइल या थर्मल/IR) रिकॉर्डिंग से पहले तय होते हैं।",
                capSync: "<strong>मल्टी-व्यू फ़्रेमिंग</strong> — रिग विनिर्देश के अनुसार POV, रिस्ट और थर्ड-पर्सन दृष्टिकोण।",
                capKin: "<strong>कार्य व संपर्क एनोटेशन</strong> — आपके ट्रेनिंग स्कीमा के अनुरूप हैंड पोज़, बाउंडिंग बॉक्स और सबटास्क।",
                capThermal: "<strong>वैकल्पिक Beyond-RGB (थर्मल / IR)</strong> — गर्मी, तरल पदार्थ या परावर्तक सतहों वाले कार्यों के लिए अतिरिक्त परत।",
                schemaBadge: "लक्षित स्कीमा में डिलीवरी"
            },
            prov: {
                kicker: "सत्यापनीय आधार · डेटा गवर्नेंस",
                heading: "उत्पत्ति, गोपनीयता और QA।",
                n1: { title: "अधिकृत पहुँच", desc: "प्रत्येक पायलट के लिए लिखित साइट अनुमति और ऑपरेटर सहमति।" },
                n2: { title: "गोपनीयता समीक्षा", desc: "डिलीवरी से पहले सीमित FOV, क्रॉपिंग और ब्लरिंग।*" },
                n3: { title: "QA गेट्स", desc: "तय सिंक, कार्य और लेबल मानदंडों के विरुद्ध डिलीवरी-पूर्व जाँच।" },
                n4: { title: "मूल मैनिफ़ेस्ट", desc: "प्रत्येक बैच के लिए सेटअप, अधिकार और QA रिकॉर्ड का दस्तावेज़ीकरण।" },
                note: "*केवल चेहरा धुंधला करना पूर्ण गुमनामी की गारंटी नहीं देता · बिना किसी असत्यापित प्रमाणन दावे के प्रत्येक प्रोजेक्ट के अनुसार तय।"
            },
            contact: {
                kicker: "संपर्क",
                heading: "डेटा आवश्यकताओं पर चर्चा करें।",
                subtitle: "पायलट प्रोजेक्ट स्कोप करने के लिए कार्य, वातावरण, सेंसर मॉडैलिटी और स्कीमा साझा करें।",
                p1: "डेटा आवश्यकताएँ",
                p2: "पायलट स्कोप",
                p3: "कस्टम रिग / सेंसर",
                nameLabel: "नाम और संगठन",
                namePlaceholder: "आपका नाम और रोबोटिक्स टीम",
                emailLabel: "कार्य ईमेल",
                emailPlaceholder: "you@company.com",
                msgLabel: "कार्य दायरा, मॉडैलिटी और फ़ॉर्मेट",
                msgPlaceholder: "लक्षित कार्य, वातावरण, आवश्यक कैमरे/सेंसर और अपेक्षित डिलीवरी फ़ॉर्मेट...",
                sendBtn: "भेजें",
                sendingBtn: "भेजा जा रहा है...",
                errMissing: "कृपया नाम, ईमेल और प्रोजेक्ट विवरण भरें।",
                sentOk: "भेजा गया — हम आपकी आवश्यकताओं की समीक्षा कर शीघ्र संपर्क करेंगे।",
                errFallback: "अभी सीधा भेजना उपलब्ध नहीं है।",
                errNetwork: "नेटवर्क समस्या।",
                sendEmail: "ईमेल से भेजें",
                sitePartnerships: "साइट साझेदारी"
            },
            partnersPage: {
                title: "पार्टनर्स",
                tagline: "Physical AI डेटा लैब · प्रोजेक्ट-आधारित रोबोटिक्स डेटा संग्रह के लिए कार्यस्थल सहयोग।",
                f1: { title: "वर्कशॉप व बेंच स्पेस", desc: "असेंबली बेंच, इलेक्ट्रॉनिक्स सोल्डरिंग, टूलिंग और केबल कार्य।" },
                f2: { title: "किचन व सर्विस", desc: "प्रेप काउंटर, बेवरेज स्टेशन और दोहराए जाने वाले सेवा कार्य।" },
                f3: { title: "लॉन्ड्री व हॉस्पिटैलिटी", desc: "फ़ोल्डिंग टेबल, आयरनिंग, लिनन हैंडलिंग और गारमेंट केयर।" },
                f4: { title: "गोदाम व पैकिंग", desc: "पिकिंग, बैगिंग, सॉर्टिंग और हल्के विनिर्माण स्टेशन।" },
                eyebrow: "साइट सहयोग",
                roleTitle: "डेटा संग्रह साइट पार्टनर",
                roleMeta: "<strong>यूक्रेन · प्रोजेक्ट-आधारित क्षेत्र</strong> · प्रोजेक्ट-आधारित",
                overviewTitle: "अवलोकन",
                overviewP1: "हम व्यवसाय मालिकों और विशेषज्ञों के साथ काम करते हैं जो क्लाइंट प्रोजेक्ट की आवश्यकता होने पर वास्तविक कार्यस्थल, उपकरण और वर्कफ़्लो तक पहुँच प्रदान कर सकें।",
                overviewP2: "उपयुक्त वातावरण में वर्कशॉप, कॉमर्शियल किचन, गोदाम, लॉन्ड्री और विनिर्माण इकाइयाँ शामिल हैं।",
                coordTitle: "समन्वय",
                coord1: "<strong>Sverkaus संग्रह का समन्वय करता है:</strong> रिकॉर्डिंग प्रक्रिया, सेंसर सेटअप और गुणवत्ता नियंत्रण हमारे समन्वय में रहते हैं।",
                coord2: "<strong>डेटासेट नहीं, पहुँच दें:</strong> पार्टनर कार्यस्थल, उपकरण और विशेषज्ञता प्रदान करते हैं।",
                coord3: "<strong>अनुमतियाँ व गोपनीयता:</strong> प्रत्येक प्रोजेक्ट के लिए अनुबंध, सीमित फ़्रेमिंग और सहमति तय की जाती है।",
                termsTitle: "सहयोग मॉडल",
                terms1: "<strong>प्रोजेक्ट-आधारित:</strong> शेड्यूल और शर्तें प्रत्येक प्रोजेक्ट के लिए अलग तय होती हैं।",
                terms2: "<strong>कोई ML बोझ नहीं:</strong> आपके स्टाफ को डेटा पैकेजिंग या लेबलिंग नहीं करनी होगी।",
                terms3: "<strong>शिफ्ट के अनुरूप:</strong> सत्र आपके नियमित कार्य समय के अनुसार तय किए जाते हैं।",
                contactTitle: "साइट पूछताछ",
                formHeading: "अपना कार्यस्थल पंजीकृत करें।",
                contactNote: "अपनी सुविधा, उपलब्ध उपकरण और शहर का संक्षिप्त विवरण साझा करें।",
                namePlaceholder: "आपका नाम और कार्यस्थल",
                msgLabel: "कार्यस्थल, उपकरण व शहर",
                msgPlaceholder: "शहर, स्थान का प्रकार, उपलब्ध उपकरण और कार्यप्रवाह...",
                footerNote: 'भूमिकाओं की तलाश है? <a href="/careers">करियर</a> देखें या <a href="mailto:main@sverkaus.com">main@sverkaus.com</a> पर ईमेल करें।'
            },
            careers: {
                title: "करियर",
                tagline: "Physical AI डेटा लैब · प्रोजेक्ट-आधारित इंजीनियरिंग, कैप्चर ऑपरेशंस और साइट साझेदारी।",
                eyebrow: "साझेदारी अवसर",
                roleTitle: "डेटा संग्रह साइट पार्टनर",
                roleMeta: "<strong>यूक्रेन</strong> · प्रोजेक्ट-आधारित",
                overviewTitle: "अवलोकन",
                overviewP1: "हम उन व्यवसाय मालिकों और पेशेवरों के साथ सहयोग करते हैं जो प्रोजेक्ट-आधारित रोबोटिक्स डेटा संग्रह के लिए कार्यस्थल, उपकरण और विशेष कार्यप्रवाह प्रदान कर सकें।",
                overviewP2: "उपयुक्त वातावरण में वर्कशॉप, गोदाम, कॉमर्शियल किचन, लॉन्ड्री और विनिर्माण सुविधाएँ शामिल हैं।",
                coordTitle: "समन्वय",
                coord1: "<strong>Sverkaus डेटा संग्रह का समन्वय करता है:</strong> रिकॉर्डिंग प्रक्रिया, गुणवत्ता नियंत्रण और ऑन-साइट निष्पादन हमारे समन्वय में रहते हैं।",
                coord2: "<strong>पहुँच प्रदान करें, डेटासेट नहीं:</strong> भागीदार वास्तविक कार्यक्षेत्र, उपकरण और विशेषज्ञता तक पहुँच प्रदान करते हैं।",
                coord3: "<strong>अनुमतियाँ और समझौते:</strong> प्रत्येक सहयोग के लिए आवश्यक अनुमतियाँ और अनुबंध तय किए जाते हैं।",
                termsTitle: "शर्तें",
                terms1: "<strong>प्रोजेक्ट-आधारित:</strong> प्रत्येक प्रोजेक्ट के लिए लचीला समय और शर्तें अलग तय की जाती हैं।",
                terms2: "<strong>व्यावहारिक कार्यप्रवाह:</strong> वर्कशॉप, गोदाम, किचन, विनिर्माण और कुशल कार्य।",
                terms3: "<strong>न्यूनतम संचालन बाधा:</strong> आपके नियमित कार्य शेड्यूल के अनुसार योजना।",
                contactTitle: "संपर्क",
                contactLead: 'रुचि है? <a href="/partners" class="bold-link">साइट पार्टनर्स</a> देखें या <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a> पर ईमेल करें।',
                r2Eyebrow: "इंजीनियरिंग और संचालन",
                r2Title: "कैप्चर और डेटा QA विशेषज्ञ",
                r2Meta: "<strong>यूक्रेन / रिमोट / ऑन-साइट</strong> · प्रोजेक्ट-आधारित",
                r2Desc: "क्लाइंट विनिर्देश के अनुसार मल्टी-कैमरा व सेंसर सेटअप करना, कैलिब्रेशन और सिंक सत्यापित करना और डिलीवरी से पहले QA जांच चलाना।",
                r2Apply: 'अपना अनुभव <a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a> पर भेजें या नीचे फ़ॉर्म भरें।',
                formKicker: "सीधा संपर्क",
                formHeading: "संपर्क करें।",
                namePlaceholder: "आपका नाम",
                msgLabel: "पृष्ठभूमि, स्थान और भूमिका",
                msgPlaceholder: "अपना हार्डवेयर/डेटा पाइपलाइन अनुभव और स्थान साझा करें...",
                footerNote: 'अपनी भूमिका नहीं दिख रही? हम हमेशा उत्कृष्ट इंजीनियरों और निर्माताओं के लिए खुले हैं: <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        },
        ko: {
            tagline: "로보틱스를 위한 사양 기반 물리 데이터 생산",
            nav: { overview: "개요", partners: "파트너", careers: "채용" },
            ui: { details: "상세보기", close: "닫기" },
            hero: {
                labName: "Physical AI 데이터 랩",
                title: "사양 기반 물리 데이터 생산",
                subtitle: "고객의 기술 사양에 맞춰 목표 작업, 실제 작업 환경, 센서 구성 및 QA 기준까지 전 과정을 조직하는 맞춤형 로보틱스 데이터 수집입니다.",
                ctaPrimary: "데이터 요구사항 논의",
                ctaSecondary: "파일럿 범위 협의",
                summary: "기술 사양 · 작업장 및 리그 구성 · 파일럿 검증 · QA 납품"
            },
            pilot: {
                kicker: "생산 모델 · 사양 우선",
                heading: "데이터 수집이 조직되는 방식.",
                s1: { title: "고객 기술 사양", sub: "목표 워크플로우, 카메라 구도, 센서 모달리티, 납품 스키마 및 QA 기준 정의." },
                s2: { title: "환경 및 캡처 구성", sub: "작업에 맞는 현장, 숙련 작업자 및 하드웨어·전용 센서 구성 조율." },
                s3: { title: "파일럿 검증", sub: "스키마, 동기화 요구사항 및 검수 기준에 맞춰 초기 배치 검증." },
                s4: { title: "생산 및 QA 납품", sub: "현장 허가, 프라이버시 검토 및 납품 전 품질 검증을 거쳐 데이터 제공." },
                specMeta: "<strong>기술 사양 최종 확정</strong> · 촬영 전 7가지 파라미터 정렬",
                spec1: "작업 분류 및 작업장 환경",
                spec2: "카메라 리그 및 선택형 센서 모달리티",
                spec3: "해상도, 프레임 레이트 및 타임스탬프",
                spec4: "캘리브레이션 및 동기화 목표",
                spec5: "어노테이션 스키마 및 납품 형식",
                spec6: "QA 기준 및 배치 검수 조건",
                spec7: "하드웨어 물류 및 현장 허가",
                primaryKicker: "운영 거점",
                primaryList: "우크라이나",
                primarySub: "핵심 기술 스코핑, 프로젝트 조율 및 현지 파일럿 실행.",
                extKicker: "프로젝트별 수집 지역",
                extList: "독일 · 폴란드 · 요청 시 협의",
                extSub: "작업 요건, 현장 허가 및 하드웨어 범위에 맞춰 프로젝트별로 조율합니다."
            },
            env: {
                kicker: "목표 워크플로우 · 작업 환경",
                heading: "실제 작업 중심으로 구성됩니다.",
                d1: { title: "변형체 및 소프트 굿즈", desc: "실제 숙박 및 세탁 환경에서의 의류 접기, 다림질, 린넨 교체 및 연성 포장." },
                d2: { title: "조립, 공구 및 열 작업", desc: "작업장 내 커넥터, 케이블, 체결, 납땜/열풍기 작업 및 가열 부품 공정." },
                d3: { title: "주방 및 서비스 워크플로우", desc: "식재료 손질, 액체 따르기, 조리 도구 사용, 표면/음료 온도 작업 및 다단계 루틴." },
                d4: { title: "고객 리그 및 전용 센서", desc: "고객 제공 리그 또는 프로젝트에 맞게 구성된 힘/촉각·열화상(IR) 센서 기반 수집." }
            },
            ep: {
                kicker: "모달리티 레이어 · 사양별 구성",
                heading: "구조화된 영상, 어노테이션 및 선택형 센서.",
                mAll: "전체 레이어",
                mSync: "멀티뷰 구도",
                mKin: "손 및 객체 라벨",
                mThermal: "선택형 열화상 / IR",
                capAll: "<strong>사양에 맞춘 구성</strong> — 카메라 시점, 손/객체 어노테이션, 작업 구간 분할 및 선택형 센서 스트림(힘/촉각, 열화상/IR 등)을 촬영 전 정의합니다.",
                capSync: "<strong>멀티뷰 카메라 구도</strong> — 리그 사양에 따라 1인칭 POV, 손목 및 3인칭 시점을 조합합니다.",
                capKin: "<strong>작업 및 접촉 어노테이션</strong> — 학습 스키마에 맞춘 손 자세, 객체 바운딩 박스 및 서브태스크 경계.",
                capThermal: "<strong>선택형 Beyond-RGB (열화상 / IR)</strong> — 열기, 액체, 반사면 또는 온도 민감 공구가 포함된 작업에 추가합니다.",
                schemaBadge: "목표 스키마별 납품"
            },
            prov: {
                kicker: "검증 가능한 기반 · 거버넌스",
                heading: "출처, 프라이버시 및 QA.",
                n1: { title: "승인된 접근", desc: "파일럿별 서면 현장 허가 및 작업자 동의 확보." },
                n2: { title: "프라이버시 검토", desc: "납품 전 화각 제한, 크롭 및 비식별화 처리.*" },
                n3: { title: "QA 게이트", desc: "합의된 동기화, 작업 및 라벨 기준에 대한 납품 전 검증." },
                n4: { title: "출처 매니페스트", desc: "배치별 설정, 권리 및 QA 기록 문서화." },
                note: "*얼굴 모자이크만으로는 완전한 익명화가 보장되지 않습니다 · 미검증 인증 주장 없이 계약별로 합의합니다."
            },
            contact: {
                kicker: "문의",
                heading: "데이터 요구사항 논의하기.",
                subtitle: "파일럿 프로젝트 협의를 위해 목표 작업, 환경, 센서 모달리티 및 데이터 스키마를 공유해 주세요.",
                p1: "데이터 요구사항",
                p2: "파일럿 협의",
                p3: "커스텀 리그 / 센서",
                nameLabel: "이름 및 소속",
                namePlaceholder: "성함 및 로보틱스 팀명",
                emailLabel: "업무용 이메일",
                emailPlaceholder: "you@company.com",
                msgLabel: "작업 범위, 모달리티 및 목표 형식",
                msgPlaceholder: "목표 작업, 환경, 필요한 카메라/센서 및 희망 납품 형식을 적어주세요...",
                sendBtn: "보내기",
                sendingBtn: "전송 중...",
                errMissing: "이름, 이메일, 프로젝트 내용을 모두 입력해 주세요.",
                sentOk: "전송되었습니다 — 요구사항을 검토한 후 곧 연락드리겠습니다.",
                errFallback: "현재 직접 전송을 사용할 수 없습니다.",
                errNetwork: "네트워크 오류가 발생했습니다.",
                sendEmail: "이메일로 보내기",
                sitePartnerships: "현장 파트너십"
            },
            partnersPage: {
                title: "파트너",
                tagline: "Physical AI 데이터 랩 · 프로젝트 기반 로보틱스 데이터 수집을 위한 현장 협업.",
                f1: { title: "워크숍 및 작업대", desc: "조립 작업대, 전자 납땜, 공구 및 케이블 작업." },
                f2: { title: "주방 및 서비스", desc: "조리 카운터, 음료 스테이션 및 반복 서비스 공정." },
                f3: { title: "세탁 및 숙박 시설", desc: "접기 테이블, 다림질, 린넨 관리 및 의류 케어 공간." },
                f4: { title: "물류 창고 및 포장", desc: "피킹, 패킹, 분류 및 경공업 작업대." },
                eyebrow: "현장 협업",
                roleTitle: "데이터 수집 현장 파트너",
                roleMeta: "<strong>우크라이나 · 프로젝트별 지역</strong> · 프로젝트 기반",
                overviewTitle: "개요",
                overviewP1: "고객 프로젝트가 특정 환경을 요구할 때 실제 작업 공간, 장비 및 실무 워크플로우를 제공해 주실 사업주 및 전문가와 협업합니다.",
                overviewP2: "워크숍, 상업용 주방, 물류 창고, 세탁 시설 및 제조 공장이 적합합니다.",
                coordTitle: "협업 방식",
                coord1: "<strong>Sverkaus가 수집을 조율합니다:</strong> 촬영 절차, 센서 구성 및 품질 검증은 당사가 조율합니다.",
                coord2: "<strong>데이터셋이 아닌 공간 접근 제공:</strong> 파트너는 작업 공간, 도구 및 현장 전문성을 제공합니다.",
                coord3: "<strong>허가 및 프라이버시:</strong> 프로젝트별로 현장 계약, 촬영 구도 제한 및 동의를 진행합니다.",
                termsTitle: "협업 모델",
                terms1: "<strong>프로젝트 기반:</strong> 일정과 조건은 프로젝트별로 개별 협의합니다.",
                terms2: "<strong>ML 부담 없음:</strong> 파트너 직원의 데이터 패키징이나 라벨링 작업이 필요 없습니다.",
                terms3: "<strong>정규 운영에 맞춤:</strong> 기존 영업 및 작업 시간에 맞춰 세션을 계획합니다.",
                contactTitle: "현장 문의",
                formHeading: "작업 공간 등록하기.",
                contactNote: "시설 유형, 보유 장비 및 도시를 간단히 알려주세요.",
                namePlaceholder: "성함 및 사업장명",
                msgLabel: "작업 공간, 장비 및 도시",
                msgPlaceholder: "도시, 시설 유형, 보유 공구 및 워크플로우...",
                footerNote: '채용을 찾고 계신가요? <a href="/careers">채용 페이지</a> 또는 <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>으로 문의하세요.'
            },
            careers: {
                title: "채용 정보",
                tagline: "Physical AI 데이터 랩 · 프로젝트 기반 엔지니어링, 캡처 운영 및 현장 파트너십.",
                eyebrow: "파트너십 기회",
                roleTitle: "데이터 수집 현장 파트너",
                roleMeta: "<strong>우크라이나</strong> · 프로젝트 기반",
                overviewTitle: "개요",
                overviewP1: "프로젝트 기반 로보틱스 데이터 수집을 위해 작업 공간, 장비 및 전문 워크플로우를 제공해 주실 사업주 및 전문가를 찾고 있습니다.",
                overviewP2: "워크숍, 물류 창고, 상업용 주방, 세탁 시설 및 제조 시설이 적합합니다.",
                coordTitle: "협업 방식",
                coord1: "<strong>Sverkaus가 수집을 조율합니다:</strong> 촬영 절차, 품질 관리 및 현장 실행은 당사가 조율합니다.",
                coord2: "<strong>데이터셋이 아닌 공간 접근 제공:</strong> 파트너는 실제 작업 공간, 장비 및 전문 지식을 제공합니다.",
                coord3: "<strong>허가 및 계약:</strong> 각 프로젝트마다 필요한 현장 허가와 계약을 체결합니다.",
                termsTitle: "조건",
                terms1: "<strong>프로젝트 기반:</strong> 유연한 일정과 조건을 프로젝트별로 개별 협의합니다.",
                terms2: "<strong>실무 중심 공정:</strong> 워크숍, 창고, 주방, 제조 시설 및 숙련 작업.",
                terms3: "<strong>낮은 운영 부담:</strong> 기존 작업 일정에 맞춰 계획합니다.",
                contactTitle: "문의",
                contactLead: '관심이 있으신가요? <a href="/partners" class="bold-link">현장 파트너</a>를 방문하거나 <a href="mailto:main@sverkaus.com?subject=Data%20Collection%20Site%20Partner" class="bold-link">main@sverkaus.com</a>으로 문의하세요.',
                r2Eyebrow: "엔지니어링 및 운영",
                r2Title: "캡처 및 데이터 QA 스페셜리스트",
                r2Meta: "<strong>우크라이나 / 원격 / 현장</strong> · 프로젝트 기반",
                r2Desc: "고객 사양에 따라 멀티 카메라 및 센서 구성을 셋업하고, 캘리브레이션·프레임 동기화 검증 및 납품 전 QA 점검을 수행합니다.",
                r2Apply: '<a href="mailto:main@sverkaus.com?subject=Capture%20%26%20QA%20Specialist" class="bold-link">main@sverkaus.com</a>으로 이력을 보내거나 아래 양식을 이용해 주세요.',
                formKicker: "직접 문의",
                formHeading: "연락하기.",
                namePlaceholder: "성함",
                msgLabel: "경력, 지역 및 지원 분야",
                msgPlaceholder: "관련 하드웨어/데이터 파이프라인 경험과 거주 지역을 공유해 주세요...",
                footerNote: '원하는 직무가 없나요? 뛰어난 엔지니어와 빌더의 연락은 언제든 환영합니다: <a href="mailto:main@sverkaus.com">main@sverkaus.com</a>'
            }
        }
    };

    let currentLang = localStorage.getItem('sverkaus-lang') || 'en';
    if (!translations[currentLang]) currentLang = 'en';

    // =========================================================
    // 2. Nav Tab Indicator & Language Switcher
    // =========================================================
    function getI18nValue(obj, path) {
        return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    }

    function updateNavIndicator(instant = false) {
        const indicator = document.getElementById('nav-tab-indicator');
        const activeTab = document.querySelector('.nav-tab.active');
        if (!indicator || !activeTab) return;

        const left = activeTab.offsetLeft;
        const width = activeTab.offsetWidth;
        if (!width) return;

        if (instant) indicator.style.transition = 'none';
        indicator.style.width = `${width}px`;
        indicator.style.transform = `translate3d(${left}px, 0, 0)`;
        indicator.style.opacity = '1';

        if (instant) {
            void indicator.offsetWidth;
            indicator.style.transition = '';
        }
    }

    const typeElement = document.getElementById('typewriter');
    let typeIndex = 0;
    let currentTypeText = '';
    let typeTimeout = null;

    function typeWriterTick() {
        if (!typeElement) return;
        if (typeIndex < currentTypeText.length) {
            typeElement.textContent += currentTypeText.charAt(typeIndex);
            typeIndex++;
            typeTimeout = setTimeout(typeWriterTick, 35 + Math.random() * 30);
        }
    }

    function startTypewriter(text) {
        clearTimeout(typeTimeout);
        if (!typeElement) return;
        typeElement.textContent = '';
        typeIndex = 0;
        currentTypeText = text || '';
        typeWriterTick();
    }

    let currentVizMode = 'all';

    function updateVizCaption(lang) {
        const cap = document.getElementById('viz-caption');
        if (!cap) return;
        const t = translations[lang] || translations.en;
        const keyMap = {
            all: 'ep.capAll',
            sync: 'ep.capSync',
            kinematics: 'ep.capKin',
            thermal: 'ep.capThermal'
        };
        const html = getI18nValue(t, keyMap[currentVizMode] || 'ep.capAll');
        if (typeof html === 'string') cap.innerHTML = html;
    }

    function updateCustomSelectUI(lang) {
        const selectOptions = document.querySelectorAll('.select-option');
        const selectedText = document.getElementById('lang-selected-text');
        let selectedShort = 'EN';
        selectOptions.forEach((opt) => {
            const match = opt.getAttribute('data-value') === lang;
            opt.classList.toggle('selected', match);
            if (match) {
                opt.setAttribute('aria-selected', 'true');
                selectedShort = opt.getAttribute('data-short') || 'EN';
            } else {
                opt.removeAttribute('aria-selected');
            }
        });
        if (selectedText) selectedText.textContent = selectedShort;
    }

    function switchLanguage(lang) {
        if (!translations[lang]) lang = 'en';
        currentLang = lang;
        localStorage.setItem('sverkaus-lang', currentLang);
        document.documentElement.lang = currentLang;

        updateCustomSelectUI(currentLang);
        const t = translations[currentLang];

        if (typeElement) startTypewriter(t.tagline);

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const val = getI18nValue(t, el.getAttribute('data-i18n'));
            if (typeof val === 'string') el.textContent = val;
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            const val = getI18nValue(t, el.getAttribute('data-i18n-html'));
            if (typeof val === 'string') el.innerHTML = val;
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const val = getI18nValue(t, el.getAttribute('data-i18n-placeholder'));
            if (typeof val === 'string') el.setAttribute('placeholder', val);
        });

        document.querySelectorAll('.vacancy-item').forEach((item) => {
            const toggleText = item.querySelector('.toggle-text');
            if (toggleText && t.ui) {
                toggleText.textContent = item.classList.contains('expanded') ? t.ui.close : t.ui.details;
            }
        });

        updateVizCaption(currentLang);
        updateNavIndicator(true);
    }

    const customSelect = document.getElementById('custom-lang-select');
    const selectTrigger = document.getElementById('lang-select-trigger');
    const selectOptions = document.querySelectorAll('.select-option');

    if (customSelect && selectTrigger) {
        const closeLangMenu = () => {
            customSelect.classList.remove('active');
            selectTrigger.setAttribute('aria-expanded', 'false');
        };

        selectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = customSelect.classList.toggle('active');
            selectTrigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        selectOptions.forEach((opt) => {
            const chooseLang = (e) => {
                e.stopPropagation();
                switchLanguage(opt.getAttribute('data-value') || 'en');
                closeLangMenu();
            };
            opt.addEventListener('click', chooseLang);
            opt.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    chooseLang(e);
                    selectTrigger.focus();
                }
            });
        });

        document.addEventListener('click', closeLangMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && customSelect.classList.contains('active')) {
                closeLangMenu();
                selectTrigger.focus();
            }
        });
    }

    // =========================================================
    // 3. Silky Scroll-Linked Star Mascot Dock (Zero Reflow)
    // =========================================================
    const logoContainer = document.getElementById('logo-dock-carrier');
    const heroLogoSlot = document.getElementById('logo-hero-slot');
    const headerLogoSlot = document.getElementById('header-logo-slot');
    const brandTextEl = document.getElementById('brand-text');
    const brandLink = document.getElementById('brand-link');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dockProgress = 0;
    let targetDockProgress = 0;
    let dockRafId = 0;
    let lastDockTs = 0;

    function computeTargetDockProgress(sr) {
        if (!heroLogoSlot) return 1;
        const hr = heroLogoSlot.getBoundingClientRect();
        if (!hr.width) return 1;
        const heroDocCenterY = hr.top + window.scrollY + hr.height / 2;
        const navCenterY = sr.top + sr.height / 2;
        const scrollRange = Math.max(180, heroDocCenterY - navCenterY);
        return Math.max(0, Math.min(1, window.scrollY / scrollRange));
    }

    function easeInOutSine(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }

    function renderLogoDockFrame(p, sr) {
        if (!logoContainer) return;
        const isMobile = window.innerWidth <= 768;
        const baseSize = isMobile ? 90 : 130;

        if (logoContainer.style.width !== `${baseSize}px`) {
            logoContainer.style.width = `${baseSize}px`;
            logoContainer.style.height = `${baseSize}px`;
        }

        const t = p * p * p * (p * (p * 6 - 15) + 10);
        const tX = easeInOutSine(Math.min(1, p * 1.06));
        const tY = t;

        const navCenterX = sr.left + sr.width / 2;
        const navCenterY = sr.top + sr.height / 2;
        const targetScale = sr.width / baseSize;

        let cx = navCenterX;
        let cy = navCenterY;
        let scale = targetScale;

        if (heroLogoSlot) {
            const hr = heroLogoSlot.getBoundingClientRect();
            if (hr.width > 0) {
                const heroCenterX = hr.left + hr.width / 2;
                const heroCenterY = hr.top + hr.height / 2;
                cx = heroCenterX + (navCenterX - heroCenterX) * tX;
                cy = heroCenterY + (navCenterY - heroCenterY) * tY;
                scale = 1 + (targetScale - 1) * t;
            }
        }

        dockProgress = p;
        const half = baseSize / 2;
        logoContainer.style.transform = `translate3d(${(cx - half).toFixed(3)}px, ${(cy - half).toFixed(3)}px, 0) scale(${scale.toFixed(5)})`;
        logoContainer.style.opacity = '1';

        if (brandTextEl) {
            const fade = heroLogoSlot ? Math.max(0, Math.min(1, 1 - (p - 0.04) / 0.38)) : 0;
            brandTextEl.style.opacity = fade.toFixed(3);
            brandTextEl.style.transform = `translate3d(${(-(1 - fade) * 10).toFixed(2)}px, 0, 0)`;
        }
        if (brandLink) {
            brandLink.style.pointerEvents = (!heroLogoSlot || p < 0.4) ? 'auto' : 'none';
        }
    }

    function tickLogoDock(ts) {
        dockRafId = 0;
        if (!logoContainer || !headerLogoSlot) return;
        const sr = headerLogoSlot.getBoundingClientRect();
        if (!sr.width) return;

        targetDockProgress = computeTargetDockProgress(sr);
        const dt = lastDockTs ? Math.min(0.05, (ts - lastDockTs) / 1000) : 0.016;
        lastDockTs = ts;

        const diff = targetDockProgress - dockProgress;
        if (prefersReducedMotion || Math.abs(diff) < 0.00035) {
            dockProgress = targetDockProgress;
            lastDockTs = 0;
            renderLogoDockFrame(dockProgress, sr);
            return;
        }

        const alpha = 1 - Math.exp(-9.5 * dt);
        dockProgress += diff * alpha;
        renderLogoDockFrame(dockProgress, sr);
        dockRafId = window.requestAnimationFrame(tickLogoDock);
    }

    function updateLogoDock(snap = false) {
        if (!logoContainer || !headerLogoSlot) return;
        const sr = headerLogoSlot.getBoundingClientRect();
        if (!sr.width) return;
        targetDockProgress = computeTargetDockProgress(sr);
        if (snap || prefersReducedMotion) {
            if (dockRafId) {
                window.cancelAnimationFrame(dockRafId);
                dockRafId = 0;
            }
            lastDockTs = 0;
            renderLogoDockFrame(targetDockProgress, sr);
            return;
        }
        if (!dockRafId) {
            lastDockTs = 0;
            dockRafId = window.requestAnimationFrame(tickLogoDock);
        }
    }

    if (logoContainer && headerLogoSlot) {
        window.addEventListener('scroll', () => updateLogoDock(false), { passive: true });
        window.addEventListener('resize', () => {
            updateLogoDock(true);
            updateNavIndicator(true);
        }, { passive: true });

        if ('ResizeObserver' in window && heroLogoSlot) {
            new ResizeObserver(() => updateLogoDock(true)).observe(heroLogoSlot);
        }
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                updateLogoDock(true);
                updateNavIndicator(true);
            });
        }
        updateLogoDock(true);

        const handleLogoActivate = () => {
            if (!heroLogoSlot) {
                window.location.href = '/';
                return;
            }
            if (dockProgress > 0.35) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            logoContainer.classList.remove('animating');
            void logoContainer.offsetWidth;
            logoContainer.classList.add('animating');
        };
        logoContainer.addEventListener('click', handleLogoActivate);
        logoContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoActivate();
            }
        });
    }

    if (sessionStorage.getItem('sverkaus-intro-done')) {
        if (logoContainer) logoContainer.classList.remove('animating');
    } else if (heroLogoSlot) {
        setTimeout(() => {
            sessionStorage.setItem('sverkaus-intro-done', 'true');
        }, 2250);
    }

    // =========================================================
    // 4. Visual Modality Layers Preview (Illustrative Stack)
    // =========================================================
    const vizWrap = document.getElementById('episode-viz');
    if (vizWrap) {
        const modeBtns = vizWrap.querySelectorAll('.viz-mode-btn');
        const layerSync = document.getElementById('viz-layer-sync');
        const layerKinematics = document.getElementById('viz-layer-kinematics');
        const layerThermal = document.getElementById('viz-layer-thermal');
        const telemetryBadge = document.getElementById('viz-telemetry-badge');
        const badgeText = document.getElementById('viz-badge-text');

        function setVizMode(mode) {
            currentVizMode = mode;
            modeBtns.forEach((btn) => {
                btn.classList.toggle('active', btn.getAttribute('data-viz-mode') === mode);
            });

            const showSync = mode === 'all' || mode === 'sync';
            const showKin = mode === 'all' || mode === 'kinematics';
            const showThermal = mode === 'all' || mode === 'thermal';

            if (layerSync) layerSync.classList.toggle('hidden', !showSync);
            if (layerKinematics) layerKinematics.classList.toggle('hidden', !showKin);
            if (layerThermal) layerThermal.classList.toggle('hidden', !showThermal);
            if (telemetryBadge) telemetryBadge.classList.toggle('hidden', !showKin);

            if (badgeText) {
                if (mode === 'thermal') badgeText.textContent = 'Optional Thermal / IR Layer';
                else if (mode === 'kinematics') badgeText.textContent = 'Hand & Object Annotations';
                else if (mode === 'sync') badgeText.textContent = 'Multi-View Framing · Per Spec';
                else badgeText.textContent = 'Illustrative Stack · Configured Per Spec';
            }

            updateVizCaption(currentLang);
        }

        modeBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                setVizMode(btn.getAttribute('data-viz-mode') || 'all');
            });
        });

        setVizMode('all');
    }

    // =========================================================
    // 5. Hero CTA Intent Pre-Selection & Accordion
    // =========================================================
    const intentPills = document.querySelectorAll('.intent-pill');
    const intentInput = document.getElementById('partner-intent');

    function setFormIntent(intentValue) {
        if (!intentInput) return;
        intentInput.value = intentValue;
        intentPills.forEach((pill) => {
            const active = pill.getAttribute('data-intent') === intentValue;
            pill.classList.toggle('active', active);
            pill.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    intentPills.forEach((pill) => {
        pill.addEventListener('click', () => {
            setFormIntent(pill.getAttribute('data-intent') || 'Discuss Data Requirements');
        });
    });

    document.querySelectorAll('[data-scroll-intent]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const intent = trigger.getAttribute('data-scroll-intent');
            if (intent) setFormIntent(intent);
            const contact = document.getElementById('contact');
            if (contact) {
                contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    const nameField = document.getElementById('partner-name');
                    if (nameField) nameField.focus({ preventScroll: true });
                }, 320);
            }
        });
    });

    window.toggleVacancy = function toggleVacancy(id) {
        const item = document.getElementById(id);
        if (!item) return;
        const isExpanded = item.classList.toggle('expanded');
        const header = item.querySelector('.vacancy-row-header');
        const toggleText = item.querySelector('.toggle-text');
        if (header) header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        if (toggleText) {
            const ui = (translations[currentLang] && translations[currentLang].ui) || translations.en.ui;
            toggleText.textContent = isExpanded ? ui.close : ui.details;
        }
    };

    document.querySelectorAll('.vacancy-row-header').forEach((header) => {
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    // =========================================================
    // 6. Contact Form -> /api/partner-inquiry (Telegram Webhook)
    // =========================================================
    const form = document.getElementById('partner-form');
    if (form) {
        const nameInput = document.getElementById('partner-name');
        const emailInput = document.getElementById('partner-email');
        const messageInput = document.getElementById('partner-message');
        const submitBtn = document.getElementById('partner-submit-btn');
        const statusEl = document.getElementById('partner-status');

        function setStatus(type, html) {
            if (!statusEl) return;
            statusEl.className = 'partner-status' + (type ? ` ${type}` : '');
            statusEl.innerHTML = html;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const ct = (translations[currentLang] && translations[currentLang].contact) || translations.en.contact;
            const name = (nameInput ? nameInput.value : '').trim();
            const email = (emailInput ? emailInput.value : '').trim();
            const rawMessage = (messageInput ? messageInput.value : '').trim();
            const intent = (intentInput ? intentInput.value : '').trim();
            const hpField = form.querySelector('input[name="website"]');
            const website = hpField ? hpField.value : '';

            if (!name || !email || !rawMessage) {
                setStatus('error', ct.errMissing);
                if (!name && nameInput) nameInput.focus();
                else if (!email && emailInput) emailInput.focus();
                else if (messageInput) messageInput.focus();
                return;
            }

            const message = intent ? `[${intent}]\n${rawMessage}` : rawMessage;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = ct.sendingBtn;
            }
            setStatus('', '');

            try {
                const res = await fetch('/api/partner-inquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        message,
                        website,
                        lang: currentLang
                    })
                });

                if (res.ok) {
                    form.reset();
                    if (intentInput && intent) setFormIntent(intent);
                    setStatus('success', ct.sentOk);
                } else {
                    const mailSubject = encodeURIComponent(`Sverkaus Inquiry: ${name}`);
                    const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                    setStatus('error', `${ct.errFallback} <a href="mailto:gleb@sverkaus.com?subject=${mailSubject}&body=${mailBody}">${ct.sendEmail}</a>`);
                }
            } catch {
                const mailSubject = encodeURIComponent(`Sverkaus Inquiry: ${name}`);
                const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
                setStatus('error', `${ct.errNetwork} <a href="mailto:gleb@sverkaus.com?subject=${mailSubject}&body=${mailBody}">${ct.sendEmail}</a>`);
            } finally {
                if (submitBtn) {
                    const latestCt = (translations[currentLang] && translations[currentLang].contact) || translations.en.contact;
                    submitBtn.disabled = false;
                    submitBtn.textContent = latestCt.sendBtn;
                }
            }
        });
    }

    switchLanguage(currentLang);
    updateNavIndicator(true);
})();

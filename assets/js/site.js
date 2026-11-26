(() => {
    'use strict';

    // =========================================================
    // 1. Complete 6-Language Dictionary (Overview, Partners, Careers)
    // =========================================================
    const translations = {
        en: {
            tagline: "Combat-ready physical data from live workplaces",
            nav: { overview: "Overview", partners: "Partners", careers: "Careers" },
            ui: { details: "Details", close: "Close" },
            hero: {
                labName: "Physical AI Data Lab",
                title: "Combat-Ready Data. Live Workplaces.",
                subtitle: "Operational integrator embedding capture into real shifts.",
                ctaPrimary: "Scope a Pilot",
                ctaSecondary: "Capture Stack"
            },
            edge: {
                kicker: "01 · The Integrator Edge",
                heading: "Lab Benches Plateau. Live Shifts Transfer.",
                c1: { stat: "~2× Transfer", title: "Wrist + 3D Hand", body: "Synced wrist cams & 3D hands, not plain POV." },
                c2: { stat: "30+ Sites", title: "Site Breadth", body: "Real workplaces beat studio repeats." },
                c3: { stat: ">3× Teleop", title: "UMI + Edge QA", body: "Robot-free capture checked for reachability." },
                c4: { stat: "2× Less Failure", title: "Errors Kept", body: "Real slips, recoveries & subgoal frames." }
            },
            pilot: {
                kicker: "04 · Pilot",
                heading: "Spec to Batch. Three Steps.",
                s1: { title: "Task & Rig", sub: "Bottleneck, sensors, QA gates." },
                s2: { title: "15-Min Calibration", sub: "Framing, sync, reachability." },
                s3: { title: "Multi-Site Batch", sub: "Live sites, Edge QA, manifest." },
                primaryKicker: "Operating Base",
                primaryList: "Ukraine",
                primarySub: "Core engineering, Edge QA & pilots.",
                extKicker: "Project-Specific",
                extList: "Germany · Poland · On Request",
                extSub: "Scoped per site permissions & rig."
            },
            env: {
                kicker: "03 · Live Workplaces",
                heading: "Real Work. Zero Staging.",
                d1: { title: "Laundries & Soft Goods", desc: "Garments, linen, flexible packs." },
                d2: { title: "Workshops & Tooling", desc: "Connectors, cables, benches." },
                d3: { title: "Commercial Kitchens", desc: "Pouring, prep, thermal tasks." },
                d4: { title: "UMI & MoCap Rigs", desc: "Your rig or ours, on site." }
            },
            ep: {
                kicker: "02 · Capture Stack",
                heading: "Hands, Wrists & Gloves. One Pipeline.",
                mAll: "Full Stack",
                mSync: "Wrist + Base",
                mKin: "Hands & Gloves",
                mThermal: "Thermal / IR",
                capAll: "<strong>Full Stack</strong> — synced wrist + base cams, 3D hands or MoCap gloves, and failure labels.",
                capSync: "<strong>Wrist + Base</strong> — synced ego, wrist, and 3rd-person views for transfer and subgoals.",
                capKin: "<strong>Hands &amp; Gloves</strong> — 3D finger pose, contact force, and failure/recovery flags.",
                capThermal: "<strong>Thermal / IR</strong> — optional LWIR layer for heat, liquids, or reflective surfaces.",
                t1: { tag: "Tier A · Portable", title: "Wrist + Stereo + UMI", desc: "Robot-free shift capture, >3× teleop." },
                t2: { tag: "Tier B/C · Hands", title: "3D Hand & MoCap Gloves", desc: "Finger pose, grip force, optional IR." },
                t3: { tag: "Edge QA · Export", title: "Reachability & Subgoals", desc: "On-site sync, occlusion & reachability gates." },
                schemaBadge: "Policy & World-Model Ready"
            },
            prov: {
                note: "Written site consent · Scoped FOV privacy · Batch provenance."
            },
            contact: {
                kicker: "05 · Contact",
                heading: "Scope a Pilot.",
                p1: "Scope a Pilot",
                p2: "Wrist + 3D Hand",
                p3: "UMI / MoCap Rig",
                nameLabel: "Name & Team",
                namePlaceholder: "Your name & robotics team",
                emailLabel: "Work Email",
                emailPlaceholder: "you@company.com",
                msgLabel: "Bottleneck, Sensors & Format",
                msgPlaceholder: "Target task, robot morphology, required views/sensors, and delivery format...",
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
                kicker: "Site Partners",
                title: "Paid Capture. Zero Disruption. Path to Automation.",
                tagline: "Project-based capture inside active workplaces—under NDA, without stopping shifts.",
                whyKicker: "01 · Why Partner",
                whyHeading: "Three Gains. Zero ML Overhead.",
                g1: { title: "Paid Projects", desc: "Agreed payout per accepted capture session." },
                g2: { title: "Zero Disruption", desc: "Hands-only framing, NDA, built around shifts." },
                g3: { title: "Automation Insight", desc: "Optional bottleneck & readiness review." },
                sitesKicker: "02 · Workplaces",
                sitesHeading: "Active Sites We Work With.",
                f1: { title: "Workshops", desc: "Assembly, cables, tooling." },
                f2: { title: "Kitchens", desc: "Prep, pouring, service." },
                f3: { title: "Laundries", desc: "Folding, linen, soft goods." },
                f4: { title: "Warehouses", desc: "Picking, sorting, packing." },
                eyebrow: "Collaboration Terms",
                roleTitle: "Data Collection Site Partner",
                roleMeta: "<strong>Ukraine · Germany · Poland</strong> · Project-based · NDA",
                overviewTitle: "Overview",
                overviewP1: "We partner with business owners and operations leads who provide authorized access to real workspaces, tools, and skilled workflows when a robotics project requires that environment.",
                coordTitle: "Privacy & Coordination",
                coord1: "<strong>Sverkaus runs capture:</strong> camera setup, SOPs, and Edge QA stay on our side.",
                coord2: "<strong>Access, not datasets:</strong> zero ML packaging or labeling from your staff.",
                coord3: "<strong>Privacy by Design:</strong> hands-only framing, written consent, and NDA before start.",
                termsTitle: "Terms & Upside",
                terms1: "<strong>Project-based payout:</strong> schedule and compensation agreed per project.",
                terms2: "<strong>Planned around shifts:</strong> sessions fit your regular operations.",
                terms3: "<strong>Optional automation review:</strong> structured overview of bottlenecks and automation readiness.",
                contactTitle: "03 · Site Inquiry",
                formHeading: "Register Your Workspace.",
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
            tagline: "Einsatzbereite physische Daten aus laufenden Betrieben",
            nav: { overview: "Übersicht", partners: "Partner", careers: "Karriere" },
            ui: { details: "Details", close: "Schließen" },
            hero: {
                labName: "Physical AI Datenlabor",
                title: "Einsatzbereite Daten. Reale Betriebe.",
                subtitle: "Operativer Integrator für Datenerfassung direkt in laufenden Schichten.",
                ctaPrimary: "Pilot anfragen",
                ctaSecondary: "Capture Stack"
            },
            edge: {
                kicker: "01 · Der Integrator-Vorteil",
                heading: "Labor-Tische stagnieren. Reale Schichten übertragen.",
                c1: { stat: "~2× Transfer", title: "Wrist + 3D-Hand", body: "Synchrone Wrist-Cams & 3D-Hände statt reinem POV." },
                c2: { stat: "30+ Standorte", title: "Standort-Breite", body: "Reale Arbeitsplätze schlagen Studio-Wiederholungen." },
                c3: { stat: ">3× Teleop", title: "UMI + Edge QA", body: "Roboterfreie Erfassung mit Erreichbarkeits-Check." },
                c4: { stat: "2× Weniger Fehler", title: "Fehler bewahrt", body: "Echte Fehler, Eingriffe & Subgoal-Frames." }
            },
            pilot: {
                kicker: "04 · Pilot",
                heading: "Spec zum Batch. Drei Schritte.",
                s1: { title: "Aufgabe & Rig", sub: "Engpass, Sensoren, QA-Gates." },
                s2: { title: "15-Min-Kalibrierung", sub: "Framing, Sync, Erreichbarkeit." },
                s3: { title: "Multi-Site-Batch", sub: "Reale Standorte, Edge QA, Manifest." },
                primaryKicker: "Operative Basis",
                primaryList: "Ukraine",
                primarySub: "Engineering, Edge QA & Piloten.",
                extKicker: "Projektbezogen",
                extList: "Deutschland · Polen · Auf Anfrage",
                extSub: "Nach Standortfreigaben & Rig."
            },
            env: {
                kicker: "03 · Reale Betriebe",
                heading: "Echte Arbeit. Null Inszenierung.",
                d1: { title: "Wäschereien & Textilien", desc: "Kleidung, Wäsche, weiche Verpackungen." },
                d2: { title: "Werkstätten & Montage", desc: "Stecker, Kabel, Werkbänke." },
                d3: { title: "Großküchen", desc: "Ausgießen, Prep, thermische Abläufe." },
                d4: { title: "UMI & MoCap-Rigs", desc: "Ihr Rig oder unseres vor Ort." }
            },
            ep: {
                kicker: "02 · Capture Stack",
                heading: "Hände, Handgelenke & Handschuhe. Eine Pipeline.",
                mAll: "Voller Stack",
                mSync: "Wrist + Base",
                mKin: "Hände & Handschuhe",
                mThermal: "Thermal / IR",
                capAll: "<strong>Voller Stack</strong> — synchrone Wrist-+Base-Cams, 3D-Hände oder MoCap-Handschuhe und Fehler-Labels.",
                capSync: "<strong>Wrist + Base</strong> — synchrone Ego-, Wrist- und Drittperspektiven für Transfer & Subgoals.",
                capKin: "<strong>Hände &amp; Handschuhe</strong> — 3D-Fingerpose, Greifkraft und Fehler-/Recovery-Flags.",
                capThermal: "<strong>Thermal / IR</strong> — optionale LWIR-Ebene für Wärme, Flüssigkeiten oder Reflexionen.",
                t1: { tag: "Tier A · Mobil", title: "Wrist + Stereo + UMI", desc: "Roboterfreie Schicht-Erfassung, >3× Teleop." },
                t2: { tag: "Tier B/C · Hände", title: "3D-Hand & MoCap", desc: "Fingerpose, Greifkraft, optional IR." },
                t3: { tag: "Edge QA · Export", title: "Erreichbarkeit & Subgoals", desc: "Vor-Ort-Sync, Verdeckung & Kinematik-Gates." },
                schemaBadge: "Policy- & World-Model-Ready"
            },
            prov: {
                note: "Schriftliche Freigabe · Begrenztes FOV · Herkunftsmanifest je Batch."
            },
            contact: {
                kicker: "05 · Kontakt",
                heading: "Pilot starten.",
                p1: "Pilot anfragen",
                p2: "Wrist + 3D Hand",
                p3: "UMI / MoCap Rig",
                nameLabel: "Name & Team",
                namePlaceholder: "Ihr Name & Robotik-Team",
                emailLabel: "Geschäftliche E-Mail",
                emailPlaceholder: "sie@unternehmen.de",
                msgLabel: "Engpass, Sensorik & Format",
                msgPlaceholder: "Zielaufgabe, Robotermorphologie, benötigte Perspektiven/Sensoren und Lieferformat...",
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
                kicker: "Standort-Partner",
                title: "Bezahlte Erfassung. Keine Störung. Weg zur Automatisierung.",
                tagline: "Projektbasierte Datenerfassung im laufenden Betrieb—unter NDA, ohne Schichtstopp.",
                whyKicker: "01 · Vorteile",
                whyHeading: "Drei Vorteile. Null ML-Aufwand.",
                g1: { title: "Bezahlte Projekte", desc: "Vereinbarte Vergütung je angenommener Session." },
                g2: { title: "Keine Störung", desc: "Nur Hand-Fokus, NDA, passend zu Ihren Schichten." },
                g3: { title: "Automatisierungs-Check", desc: "Optionale Engpass- & Readiness-Analyse." },
                sitesKicker: "02 · Einsatzorte",
                sitesHeading: "Aktive Betriebe für Projekte.",
                f1: { title: "Werkstätten", desc: "Montage, Kabel, Werkzeuge." },
                f2: { title: "Küchen", desc: "Prep, Ausgießen, Service." },
                f3: { title: "Wäschereien", desc: "Falten, Wäsche, Textilien." },
                f4: { title: "Lager", desc: "Picking, Sortieren, Verpacken." },
                eyebrow: "Kooperationsdetails",
                roleTitle: "Standortpartner für Datenerfassung",
                roleMeta: "<strong>Ukraine · Deutschland · Polen</strong> · Projektbasiert · NDA",
                overviewTitle: "Überblick",
                overviewP1: "Wir arbeiten mit Betrieben zusammen, die autorisierten Zugang zu realen Arbeitsbereichen, Werkzeugen und Abläufen bieten, wenn ein Robotikprojekt diese Umgebung erfordert.",
                coordTitle: "Datenschutz & Koordination",
                coord1: "<strong>Sverkaus steuert die Erfassung:</strong> Kamera-Setup, SOPs und Edge QA bleiben bei uns.",
                coord2: "<strong>Zugang statt Datensätze:</strong> kein ML-Packaging oder Labeling durch Ihr Team.",
                coord3: "<strong>Privacy by Design:</strong> Hand-Fokus-Framing, schriftliche Einwilligung und NDA vor Start.",
                termsTitle: "Konditionen & Mehrwert",
                terms1: "<strong>Projektvergütung:</strong> Zeitplan und Vergütung werden je Projekt vereinbart.",
                terms2: "<strong>Passend zum Betrieb:</strong> Sessions orientieren sich an Ihren regulären Schichten.",
                terms3: "<strong>Optionaler Automatisierungs-Check:</strong> strukturierter Überblick zu Engpässen und Potenzial.",
                contactTitle: "03 · Standort-Anfrage",
                formHeading: "Arbeitsbereich anmelden.",
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
            tagline: "Gotowe do wdrożeń dane fizyczne z prawdziwych stanowisk pracy",
            nav: { overview: "Przegląd", partners: "Partnerzy", careers: "Kariera" },
            ui: { details: "Szczegóły", close: "Zamknij" },
            hero: {
                labName: "Laboratorium Danych Physical AI",
                title: "Dane bojowe. Realne zakłady.",
                subtitle: "Integrator operacyjny wdrażający nagrania prosto w aktywne zmiany.",
                ctaPrimary: "Zaplanuj pilotaż",
                ctaSecondary: "Capture Stack"
            },
            edge: {
                kicker: "01 · Przewaga integratora",
                heading: "Laby stają w miejscu. Realne zmiany transferują.",
                c1: { stat: "~2× Transfer", title: "Nadgarstek + 3D dłoni", body: "Synchroniczne wrist-camy i 3D dłoni, nie samo POV." },
                c2: { stat: "30+ Lokalizacji", title: "Szerokość obiektów", body: "Prawdziwe stanowiska wygrywają z powtórkami w studiu." },
                c3: { stat: ">3× Teleop", title: "UMI + Edge QA", body: "Nagrania bez robota z kontrolą osiągalności." },
                c4: { stat: "2× Mniej błędów", title: "Błędy zachowane", body: "Prawdziwe poślizgnięcia, korekty i klatki subgoal." }
            },
            pilot: {
                kicker: "04 · Pilotaż",
                heading: "Od specyfikacji do partii. Trzy kroki.",
                s1: { title: "Zadanie i zestaw", sub: "Wąskie gardło, sensory, progi QA." },
                s2: { title: "15-min kalibracja", sub: "Kadr, sync, osiągalność." },
                s3: { title: "Partia multi-site", sub: "Realne obiekty, Edge QA, manifest." },
                primaryKicker: "Baza operacyjna",
                primaryList: "Ukraina",
                primarySub: "Inżynieria, Edge QA i pilotaże.",
                extKicker: "Projektowo",
                extList: "Niemcy · Polska · Na zapytanie",
                extSub: "Według zgód obiektów i sprzętu."
            },
            env: {
                kicker: "03 · Realne zakłady",
                heading: "Prawdziwa praca. Zero inscenizacji.",
                d1: { title: "Pralnie i tekstylia", desc: "Odzież, pościel, miękkie paczki." },
                d2: { title: "Warsztaty i narzędzia", desc: "Złącza, kable, stoły robocze." },
                d3: { title: "Kuchnie komercyjne", desc: "Nalewanie, prep, praca z ciepłem." },
                d4: { title: "Zestawy UMI i MoCap", desc: "Twój zestaw lub nasz na miejscu." }
            },
            ep: {
                kicker: "02 · Capture Stack",
                heading: "Dłonie, nadgarstki i rękawice. Jeden pipeline.",
                mAll: "Pełny stack",
                mSync: "Wrist + Base",
                mKin: "Dłonie i rękawice",
                mThermal: "Thermal / IR",
                capAll: "<strong>Pełny stack</strong> — zsynchronizowane kamery wrist + base, dłonie 3D lub rękawice MoCap i etykiety błędów.",
                capSync: "<strong>Wrist + Base</strong> — zgrane ujęcia ego, nadgarstka i trzeciej osoby pod transfer i subgoale.",
                capKin: "<strong>Dłonie i rękawice</strong> — poza palców 3D, siła kontaktu i flagi błędów/odzyskiwania.",
                capThermal: "<strong>Thermal / IR</strong> — opcjonalna warstwa LWIR dla ciepła, płynów i odblasków.",
                t1: { tag: "Tier A · Mobilny", title: "Wrist + Stereo + UMI", desc: "Mobilny zbiór na zmianie, >3× teleop." },
                t2: { tag: "Tier B/C · Dłonie", title: "Dłonie 3D i MoCap", desc: "Poza palców, siła chwytu, opcjonalne IR." },
                t3: { tag: "Edge QA · Eksport", title: "Osiągalność i subgoale", desc: "Kontrola sync, okluzji i kinematyki na miejscu." },
                schemaBadge: "Gotowe pod Policy & World Models"
            },
            prov: {
                note: "Pisemne zgody · Prywatność kadru FOV · Manifest pochodzenia."
            },
            contact: {
                kicker: "05 · Kontakt",
                heading: "Zaplanuj pilotaż.",
                p1: "Zaplanuj pilotaż",
                p2: "Wrist + 3D dłoni",
                p3: "Zestaw UMI / MoCap",
                nameLabel: "Imię i zespół",
                namePlaceholder: "Twoje imię i zespół robotyki",
                emailLabel: "E-mail służbowy",
                emailPlaceholder: "ty@firma.pl",
                msgLabel: "Wąskie gardło, sensory i format",
                msgPlaceholder: "Docelowe zadanie, morfologia robota, wymagane ujęcia/sensory i format dostawy...",
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
                kicker: "Partnerzy obiektów",
                title: "Płatne nagrania. Zero zakłóceń. Droga do automatyzacji.",
                tagline: "Projektowe nagrania w aktywnych zakładach—pod NDA, bez zatrzymywania zmian.",
                whyKicker: "01 · Dlaczego warto",
                whyHeading: "Trzy korzyści. Zero pracy ML.",
                g1: { title: "Płatne projekty", desc: "Ustalona wypłata za zaakceptowaną sesję." },
                g2: { title: "Zero zakłóceń", desc: "Kadr tylko na dłonie, NDA, zgodnie ze zmianą." },
                g3: { title: "Ocena automatyzacji", desc: "Opcjonalny przegląd wąskich gardeł i gotowości." },
                sitesKicker: "02 · Obiekty",
                sitesHeading: "Aktywne miejsca współpracy.",
                f1: { title: "Warsztaty", desc: "Montaż, kable, narzędzia." },
                f2: { title: "Kuchnie", desc: "Prep, nalewanie, serwis." },
                f3: { title: "Pralnie", desc: "Składanie, pościel, tekstylia." },
                f4: { title: "Magazyny", desc: "Picking, sortowanie, pakowanie." },
                eyebrow: "Warunki współpracy",
                roleTitle: "Partner obiektu do zbierania danych",
                roleMeta: "<strong>Ukraina · Niemcy · Polska</strong> · Projektowo · NDA",
                overviewTitle: "Opis",
                overviewP1: "Współpracujemy z właścicielami firm i dyrektorami operacyjnymi, którzy udostępniają autoryzowane stanowiska, sprzęt i procesy, gdy wymaga tego projekt robotyczny.",
                coordTitle: "Prywatność i koordynacja",
                coord1: "<strong>Sverkaus prowadzi zbiórkę:</strong> kamery, procedury SOP i Edge QA są po naszej stronie.",
                coord2: "<strong>Dostęp, nie zbiory danych:</strong> zero etykietowania ani pracy ML dla Twojego zespołu.",
                coord3: "<strong>Privacy by Design:</strong> kadr wyłącznie na dłonie, pisemne zgody i NDA przed startem.",
                termsTitle: "Warunki i korzyści",
                terms1: "<strong>Rozliczenie projektowe:</strong> harmonogram i wynagrodzenie ustalane na projekt.",
                terms2: "<strong>Zgodnie z grafikiem:</strong> sesje dopasowane do normalnej pracy zmian.",
                terms3: "<strong>Opcjonalny przegląd automatyzacji:</strong> strukturalna mapa wąskich gardeł i gotowości.",
                contactTitle: "03 · Zgłoszenie obiektu",
                formHeading: "Zgłoś swoją przestrzeń.",
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
            tagline: "源自真实作业现场的实战级物理交互数据",
            nav: { overview: "概览", partners: "合作伙伴", careers: "招聘" },
            ui: { details: "详情", close: "收起" },
            hero: {
                labName: "Physical AI 数据实验室",
                title: "实战级数据。真实作业现场。",
                subtitle: "直接嵌入真实班次作业的运营集成方。",
                ctaPrimary: "规划试点项目",
                ctaSecondary: "采集技术栈"
            },
            edge: {
                kicker: "01 · 集成商核心优势",
                heading: "实验室桌面触顶，真实班次才能泛化。",
                c1: { stat: "~2× 迁移率", title: "腕部 + 3D 手部", body: "腕部同步相机与 3D 手部追踪，而非普通第一视角。" },
                c2: { stat: "30+ 场地", title: "场地广度", body: "真实多元作业现场胜过棚拍重复。" },
                c3: { stat: ">3× 遥操速度", title: "UMI + 边缘质检", body: "现场无机器人采集，并校验可达性。" },
                c4: { stat: "2× 更低失误", title: "保留真实失误", body: "保留打滑、人工纠正与子目标同步帧。" }
            },
            pilot: {
                kicker: "04 · 试点",
                heading: "从规格到交付，只需三步。",
                s1: { title: "任务与设备", sub: "锁定瓶颈、传感器与质检门槛。" },
                s2: { title: "15 分钟校准", sub: "验证取景、同步与运动学可达性。" },
                s3: { title: "多场地批量", sub: "多现场扩展、边缘质检与溯源清单。" },
                primaryKicker: "核心运营基地",
                primaryList: "乌克兰",
                primarySub: "核心工程、边缘质检与本地试点。",
                extKicker: "按项目组织",
                extList: "德国 · 波兰 · 按需安排",
                extSub: "围绕场地许可与设备配置落地。"
            },
            env: {
                kicker: "03 · 真实作业现场",
                heading: "真实作业，零棚拍摆拍。",
                d1: { title: "洗衣房与织物", desc: "衣物、布草与柔性包装。" },
                d2: { title: "车间与工具装配", desc: "接插件、线束与工作台。" },
                d3: { title: "商用后厨", desc: "倾倒、备餐与温控流程。" },
                d4: { title: "UMI 与动捕设备", desc: "客户设备或我方设备驻场。" }
            },
            ep: {
                kicker: "02 · 采集技术栈",
                heading: "手部、腕部与手套，一体化管线。",
                mAll: "全部层级",
                mSync: "腕部 + 主视角",
                mKin: "手部与手套",
                mThermal: "热成像 / 红外",
                capAll: "<strong>全部层级</strong> — 同步腕部+主视角相机、3D 手部或动捕手套与失误标注。",
                capSync: "<strong>腕部 + 主视角</strong> — 第一视角、腕部与第三视角同步，适配策略迁移与子目标。",
                capKin: "<strong>手部与手套</strong> — 3D 手指姿态、接触力及失误/恢复标记。",
                capThermal: "<strong>热成像 / 红外</strong> — 适用于热源、液体或反光表面的可选 LWIR 层。",
                t1: { tag: "Tier A · 便携", title: "腕部 + 双目 + UMI", desc: "班次无机器人采集，>3× 遥操速度。" },
                t2: { tag: "Tier B/C · 手部", title: "3D 手部与动捕手套", desc: "手指姿态、握力与可选红外。" },
                t3: { tag: "边缘质检 · 导出", title: "可达性与子目标", desc: "现场同步、遮挡与可达性校验。" },
                schemaBadge: "策略与世界模型就绪"
            },
            prov: {
                note: "书面场地许可 · 限定视角隐私审查 · 批次溯源清单。"
            },
            contact: {
                kicker: "05 · 联系我们",
                heading: "规划试点项目。",
                p1: "规划试点项目",
                p2: "腕部 + 3D 手部",
                p3: "UMI / 动捕设备",
                nameLabel: "姓名与团队",
                namePlaceholder: "您的姓名与机器人团队",
                emailLabel: "工作邮箱",
                emailPlaceholder: "you@company.com",
                msgLabel: "任务瓶颈、传感器与格式",
                msgPlaceholder: "目标任务、机器人构型、所需视角/传感器及交付格式...",
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
                kicker: "场地合作伙伴",
                title: "有偿采集。零班次干扰。通往自动化。",
                tagline: "在 NDA 保护下嵌入真实作业现场的项目制采集——不中断日常生产。",
                whyKicker: "01 · 合作价值",
                whyHeading: "三大收益，零 ML 负担。",
                g1: { title: "有偿项目", desc: "每批次验收合格即按约支付报酬。" },
                g2: { title: "零干扰作业", desc: "仅拍手部区域、签署 NDA、配合排班。" },
                g3: { title: "自动化洞察", desc: "可选提供瓶颈与自动化准备度评估。" },
                sitesKicker: "02 · 合作场景",
                sitesHeading: "我们合作的真实作业场所。",
                f1: { title: "车间", desc: "装配、线束、工具作业。" },
                f2: { title: "商用厨房", desc: "备餐、倾倒、餐饮服务。" },
                f3: { title: "洗衣房", desc: "叠衣、布草、柔性织物。" },
                f4: { title: "仓储", desc: "拣选、分拣、包装。" },
                eyebrow: "合作条款",
                roleTitle: "数据采集场地合作伙伴",
                roleMeta: "<strong>乌克兰 · 德国 · 波兰</strong> · 项目制 · NDA",
                overviewTitle: "项目简介",
                overviewP1: "当机器人客户项目需要特定作业环境时，我们与能够提供授权真实工作空间、设备及实操流程的企业主和运营负责人合作。",
                coordTitle: "隐私与协作",
                coord1: "<strong>Sverkaus 主导采集：</strong>相机配置、SOP 流程与边缘质检均由我方负责。",
                coord2: "<strong>提供场地而非数据集：</strong>贵司团队无需承担任何数据打包或标注工作。",
                coord3: "<strong>Privacy by Design：</strong>仅限手部与工位视角，启动前签署书面同意与 NDA。",
                termsTitle: "条款与附加价值",
                terms1: "<strong>按项目结算：</strong>排期与报酬按每个具体项目事先商定。",
                terms2: "<strong>配合班次安排：</strong>采集过程贴合贵司正常运营节奏。",
                terms3: "<strong>可选自动化评估：</strong>输出结构化的瓶颈与自动化可行性概览。",
                contactTitle: "03 · 场地登记",
                formHeading: "登记您的工作场所。",
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
            tagline: "वास्तविक कार्यस्थलों से कॉम्बैट-रेडी फिजिकल डेटा",
            nav: { overview: "अवलोकन", partners: "पार्टनर्स", careers: "करियर" },
            ui: { details: "विवरण", close: "बंद करें" },
            hero: {
                labName: "Physical AI डेटा लैब",
                title: "कॉम्बैट-रेडी डेटा। वास्तविक कार्यस्थल।",
                subtitle: "वास्तविक शिफ्ट में सीधे डेटा कैप्चर जोड़ने वाला ऑपरेशनल इंटीग्रेटर।",
                ctaPrimary: "पायलट स्कोप करें",
                ctaSecondary: "कैप्चर स्टैक"
            },
            edge: {
                kicker: "01 · इंटीग्रेटर बढ़त",
                heading: "लैब बेंच थम जाते हैं। लाइव शिफ्ट ट्रांसफर होती हैं।",
                c1: { stat: "~2× ट्रांसफर", title: "रिस्ट + 3D हैंड", body: "सिंक्ड रिस्ट कैम व 3D हैंड, सादा POV नहीं।" },
                c2: { stat: "30+ साइट्स", title: "साइट विविधता", body: "असली कार्यस्थल स्टूडियो दोहराव से बेहतर हैं।" },
                c3: { stat: ">3× टेलीऑप", title: "UMI + Edge QA", body: "रोबोट-मुक्त कैप्चर, रीचैबिलिटी जाँच सहित।" },
                c4: { stat: "2× कम विफलता", title: "त्रुटियाँ सुरक्षित", body: "असली चूक, सुधार और सबगोल फ्रेम।" }
            },
            pilot: {
                kicker: "04 · पायलट",
                heading: "स्पेक से बैच। तीन चरण।",
                s1: { title: "कार्य व रिग", sub: "बॉटलनेक, सेंसर, QA गेट।" },
                s2: { title: "15-मिनट कैलिब्रेशन", sub: "फ़्रेमिंग, सिंक, रीचैबिलिटी।" },
                s3: { title: "मल्टी-साइट बैच", sub: "लाइव साइट्स, Edge QA, मैनिफ़ेस्ट।" },
                primaryKicker: "संचालन आधार",
                primaryList: "यूक्रेन",
                primarySub: "इंजीनियरिंग, Edge QA और पायलट।",
                extKicker: "प्रोजेक्ट-आधारित",
                extList: "जर्मनी · पोलैंड · अनुरोध पर",
                extSub: "साइट अनुमति और रिग के अनुसार।"
            },
            env: {
                kicker: "03 · लाइव कार्यस्थल",
                heading: "असली काम। शून्य स्टेजिंग।",
                d1: { title: "लॉन्ड्री व सॉफ्ट गुड्स", desc: "कपड़े, लिनन, लचीली पैकेजिंग।" },
                d2: { title: "वर्कशॉप व टूलिंग", desc: "कनेक्टर, केबल, असली बेंच।" },
                d3: { title: "कॉमर्शियल किचन", desc: "डालना, तैयारी, थर्मल कार्य।" },
                d4: { title: "UMI व MoCap रिग्स", desc: "आपका रिग या हमारा, साइट पर।" }
            },
            ep: {
                kicker: "02 · कैप्चर स्टैक",
                heading: "हाथ, कलाई और ग्लव्स। एक पाइपलाइन।",
                mAll: "पूरा स्टैक",
                mSync: "रिस्ट + बेस",
                mKin: "हैंड्स व ग्लव्स",
                mThermal: "थर्मल / IR",
                capAll: "<strong>पूरा स्टैक</strong> — सिंक्ड रिस्ट + बेस कैम, 3D हैंड या MoCap ग्लव्स और फ़ेल्यर लेबल।",
                capSync: "<strong>रिस्ट + बेस</strong> — ट्रांसफर व सबगोल्स के लिए सिंक्ड ईगो, रिस्ट और 3rd-पर्सन व्यू।",
                capKin: "<strong>हैंड्स व ग्लव्स</strong> — 3D उँगली पोज़, संपर्क बल और फ़ेल्यर/रिकवरी फ़्लैग।",
                capThermal: "<strong>थर्मल / IR</strong> — गर्मी, तरल या चमकदार सतहों के लिए वैकल्पिक LWIR परत।",
                t1: { tag: "Tier A · पोर्टेबल", title: "रिस्ट + स्टीरियो + UMI", desc: "रोबोट-मुक्त शिफ्ट कैप्चर, >3× टेलीऑप।" },
                t2: { tag: "Tier B/C · हाथ", title: "3D हैंड व MoCap ग्लव्स", desc: "उँगली पोज़, ग्रिप फोर्स, वैकल्पिक IR।" },
                t3: { tag: "Edge QA · एक्सपोर्ट", title: "रीचैबिलिटी व सबगोल्स", desc: "ऑन-साइट सिंक, ऑक्लूजन व रीचैबिलिटी गेट।" },
                schemaBadge: "पॉलिसी व वर्ल्ड-मॉडल तैयार"
            },
            prov: {
                note: "लिखित साइट सहमति · सीमित FOV गोपनीयता · बैच मूल मैनिफ़ेस्ट।"
            },
            contact: {
                kicker: "05 · संपर्क",
                heading: "पायलट स्कोप करें।",
                p1: "पायलट स्कोप करें",
                p2: "रिस्ट + 3D हैंड",
                p3: "UMI / MoCap रिग",
                nameLabel: "नाम और टीम",
                namePlaceholder: "आपका नाम और रोबोटिक्स टीम",
                emailLabel: "कार्य ईमेल",
                emailPlaceholder: "you@company.com",
                msgLabel: "बॉटलनेक, सेंसर व फ़ॉर्मेट",
                msgPlaceholder: "लक्षित कार्य, रोबोट रूप, आवश्यक व्यू/सेंसर और डिलीवरी फ़ॉर्मेट...",
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
                kicker: "साइट पार्टनर्स",
                title: "भुगतान आधारित कैप्चर। शून्य बाधा। ऑटोमेशन की राह।",
                tagline: "सक्रिय कार्यस्थलों में NDA के तहत प्रोजेक्ट-आधारित कैप्चर—बिना शिफ्ट रोके।",
                whyKicker: "01 · क्यों जुड़ें",
                whyHeading: "तीन लाभ। शून्य ML बोझ।",
                g1: { title: "भुगतान प्रोजेक्ट", desc: "प्रत्येक स्वीकृत सत्र पर तय भुगतान।" },
                g2: { title: "शून्य बाधा", desc: "केवल हाथों का फ़्रेम, NDA, शिफ्ट अनुसार।" },
                g3: { title: "ऑटोमेशन इनसाइट", desc: "वैकल्पिक बॉटलनेक व तैयारी समीक्षा।" },
                sitesKicker: "02 · कार्यस्थल",
                sitesHeading: "सक्रिय साइट्स जिनके साथ हम काम करते हैं।",
                f1: { title: "वर्कशॉप", desc: "असेंबली, केबल, टूलिंग।" },
                f2: { title: "किचन", desc: "तैयारी, डालना, सर्विस।" },
                f3: { title: "लॉन्ड्री", desc: "फ़ोल्डिंग, लिनन, सॉफ्ट गुड्स।" },
                f4: { title: "गोदाम", desc: "पिकिंग, सॉर्टिंग, पैकिंग।" },
                eyebrow: "सहयोग की शर्तें",
                roleTitle: "डेटा संग्रह साइट पार्टनर",
                roleMeta: "<strong>यूक्रेन · जर्मनी · पोलैंड</strong> · प्रोजेक्ट-आधारित · NDA",
                overviewTitle: "अवलोकन",
                overviewP1: "हम व्यवसाय मालिकों और ऑपरेशंस प्रमुखों के साथ साझेदारी करते हैं जो रोबोटिक्स प्रोजेक्ट की आवश्यकता होने पर वास्तविक कार्यस्थल, उपकरण और वर्कफ़्लो तक अधिकृत पहुँच देते हैं।",
                coordTitle: "गोपनीयता व समन्वय",
                coord1: "<strong>Sverkaus कैप्चर चलाता है:</strong> कैमरा सेटअप, SOP और Edge QA हमारी जिम्मेदारी हैं।",
                coord2: "<strong>पहुँच, डेटासेट नहीं:</strong> आपके स्टाफ पर कोई ML पैकेजिंग या लेबलिंग बोझ नहीं।",
                coord3: "<strong>Privacy by Design:</strong> केवल हाथों की फ़्रेमिंग, लिखित सहमति और शुरुआत से पहले NDA।",
                termsTitle: "शर्तें व लाभ",
                terms1: "<strong>प्रोजेक्ट भुगतान:</strong> शेड्यूल और भुगतान प्रत्येक प्रोजेक्ट के लिए तय होते हैं।",
                terms2: "<strong>शिफ्ट के अनुरूप:</strong> सत्र आपके नियमित संचालन के अनुसार चलते हैं।",
                terms3: "<strong>वैकल्पिक ऑटोमेशन समीक्षा:</strong> बॉटलनेक और ऑटोमेशन तैयारी का संरचित अवलोकन।",
                contactTitle: "03 · साइट पूछताछ",
                formHeading: "अपना कार्यस्थल पंजीकृत करें।",
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
            tagline: "실제 현장에서 수집한 실전형 물리 데이터",
            nav: { overview: "개요", partners: "파트너", careers: "채용" },
            ui: { details: "상세보기", close: "닫기" },
            hero: {
                labName: "Physical AI 데이터 랩",
                title: "실전형 데이터. 살아있는 현장.",
                subtitle: "실제 근무 교대에 캡처를 직접 통합하는 운영 파트너.",
                ctaPrimary: "파일럿 협의",
                ctaSecondary: "캡처 스택"
            },
            edge: {
                kicker: "01 · 통합 파트너의 강점",
                heading: "실험실은 정체됩니다. 실제 현장이 전이됩니다.",
                c1: { stat: "~2× 전이율", title: "손목 + 3D 손", body: "단순 POV가 아닌 손목 카메라와 3D 손 추적." },
                c2: { stat: "30+ 현장", title: "현장 다양성", body: "실제 작업장이 스튜디오 반복을 앞섭니다." },
                c3: { stat: ">3× 텔레옵", title: "UMI + Edge QA", body: "도달 가능성 검증을 거친 로봇 없는 수집." },
                c4: { stat: "2× 오류 감소", title: "오류 보존", body: "실제 미끄러짐, 복구 및 서브골 프레임." }
            },
            pilot: {
                kicker: "04 · 파일럿",
                heading: "사양에서 배치까지. 3단계.",
                s1: { title: "작업 및 리그", sub: "병목, 센서, QA 기준." },
                s2: { title: "15분 캘리브레이션", sub: "구도, 동기화, 도달 가능성." },
                s3: { title: "다중 현장 배치", sub: "실제 현장, Edge QA, 매니페스트." },
                primaryKicker: "운영 거점",
                primaryList: "우크라이나",
                primarySub: "엔지니어링, Edge QA 및 파일럿.",
                extKicker: "프로젝트별",
                extList: "독일 · 폴란드 · 요청 시",
                extSub: "현장 허가 및 리그에 맞춰 구성."
            },
            env: {
                kicker: "03 · 실제 현장",
                heading: "실제 작업. 연출 제로.",
                d1: { title: "세탁 및 소프트 굿즈", desc: "의류, 린넨, 연성 포장." },
                d2: { title: "워크숍 및 공구", desc: "커넥터, 케이블, 작업대." },
                d3: { title: "상업용 주방", desc: "따르기, 손질, 열 공정." },
                d4: { title: "UMI 및 MoCap 리그", desc: "고객 리그 또는 당사 리그 배포." }
            },
            ep: {
                kicker: "02 · 캡처 스택",
                heading: "손, 손목 및 글러브. 하나의 파이프라인.",
                mAll: "전체 스택",
                mSync: "손목 + 베이스",
                mKin: "손 및 글러브",
                mThermal: "열화상 / IR",
                capAll: "<strong>전체 스택</strong> — 동기화된 손목+베이스 카메라, 3D 손 또는 MoCap 글러브 및 오류 라벨.",
                capSync: "<strong>손목 + 베이스</strong> — 전이와 서브골을 위한 에고·손목·3인칭 동기화.",
                capKin: "<strong>손 및 글러브</strong> — 3D 손가락 자세, 접촉력 및 오류/복구 플래그.",
                capThermal: "<strong>열화상 / IR</strong> — 열·액체·반사면용 선택형 LWIR 레이어.",
                t1: { tag: "Tier A · 휴대형", title: "손목 + 스테레오 + UMI", desc: "로봇 없는 현장 수집, >3× 텔레옵." },
                t2: { tag: "Tier B/C · 손", title: "3D 손 및 MoCap 글러브", desc: "손가락 자세, 파지력, 선택형 IR." },
                t3: { tag: "Edge QA · 내보내기", title: "도달 가능성 및 서브골", desc: "현장 동기화·가림·도달성 검증." },
                schemaBadge: "정책 및 월드 모델 대응"
            },
            prov: {
                note: "서면 현장 동의 · 화각 프라이버시 검토 · 배치 출처 매니페스트."
            },
            contact: {
                kicker: "05 · 문의",
                heading: "파일럿 협의.",
                p1: "파일럿 협의",
                p2: "손목 + 3D 손",
                p3: "UMI / MoCap 리그",
                nameLabel: "이름 및 팀",
                namePlaceholder: "성함 및 로보틱스 팀명",
                emailLabel: "업무용 이메일",
                emailPlaceholder: "you@company.com",
                msgLabel: "병목 작업, 센서 및 형식",
                msgPlaceholder: "목표 작업, 로봇 형태, 필요한 시점/센서 및 납품 형식을 적어주세요...",
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
                kicker: "현장 파트너",
                title: "유료 수집. 업무 중단 제로. 자동화로의 연결.",
                tagline: "실제 작업장 내 NDA 기반 프로젝트 수집—정규 교대를 멈추지 않습니다.",
                whyKicker: "01 · 파트너 혜택",
                whyHeading: "세 가지 이점. ML 부담 제로.",
                g1: { title: "유료 프로젝트", desc: "승인된 수집 세션당 합의된 보상 지급." },
                g2: { title: "업무 중단 제로", desc: "손 영역만 촬영, NDA, 교대 일정 준수." },
                g3: { title: "자동화 인사이트", desc: "선택형 병목 및 자동화 준비도 검토." },
                sitesKicker: "02 · 협력 현장",
                sitesHeading: "함께하는 실제 작업 환경.",
                f1: { title: "워크숍", desc: "조립, 케이블, 공구 작업." },
                f2: { title: "주방", desc: "손질, 따르기, 서비스." },
                f3: { title: "세탁 시설", desc: "접기, 린넨, 소프트 굿즈." },
                f4: { title: "물류 창고", desc: "피킹, 분류, 포장." },
                eyebrow: "협업 조건",
                roleTitle: "데이터 수집 현장 파트너",
                roleMeta: "<strong>우크라이나 · 독일 · 폴란드</strong> · 프로젝트 기반 · NDA",
                overviewTitle: "개요",
                overviewP1: "로보틱스 프로젝트가 특정 환경을 요구할 때 실제 작업 공간, 장비 및 숙련된 워크플로우에 대한 승인된 접근을 제공하는 사업주 및 운영 책임자와 협업합니다.",
                coordTitle: "프라이버시 및 운영",
                coord1: "<strong>Sverkaus가 수집 전담:</strong> 카메라 셋업, SOP 및 Edge QA는 당사가 수행합니다.",
                coord2: "<strong>데이터셋이 아닌 공간 접근:</strong> 파트너 직원의 ML 패키징이나 라벨링 부담이 없습니다.",
                coord3: "<strong>Privacy by Design:</strong> 손 중심 구도, 서면 동의 및 시작 전 NDA 체결.",
                termsTitle: "조건 및 가치",
                terms1: "<strong>프로젝트별 보상:</strong> 일정과 보상은 프로젝트마다 개별 합의합니다.",
                terms2: "<strong>교대 일정에 맞춤:</strong> 정규 영업 및 작업 흐름에 맞춰 진행합니다.",
                terms3: "<strong>선택형 자동화 검토:</strong> 반복 병목 및 자동화 준비도에 대한 구조화된 요약 제공.",
                contactTitle: "03 · 현장 문의",
                formHeading: "작업 공간 등록하기.",
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
    // 3. Silky Critically-Damped Spring Mascot Dock (iOS + Desktop)
    // =========================================================
    const logoContainer = document.getElementById('logo-dock-carrier');
    const heroLogoSlot = document.getElementById('logo-hero-slot');
    const headerLogoSlot = document.getElementById('header-logo-slot');
    const brandTextEl = document.getElementById('brand-text');
    const brandLink = document.getElementById('brand-link');
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let dockProgress = 0;
    let dockVelocity = 0;
    let targetDockProgress = 0;
    let dockRafId = 0;
    let lastDockTs = 0;
    let lastViewportWidth = window.innerWidth;

    const dockMetrics = {
        baseSize: 130,
        navX: 0,
        navY: 0,
        heroX: 0,
        heroY: 0,
        targetScale: 1,
        scrollRange: 220,
        ready: false
    };

    function measureDockMetrics() {
        if (!logoContainer || !headerLogoSlot) return false;
        const sr = headerLogoSlot.getBoundingClientRect();
        if (!sr.width) return false;

        const isMobile = window.innerWidth <= 768;
        const baseSize = isMobile ? 90 : 130;
        if (logoContainer.style.width !== `${baseSize}px`) {
            logoContainer.style.width = `${baseSize}px`;
            logoContainer.style.height = `${baseSize}px`;
        }

        dockMetrics.baseSize = baseSize;
        dockMetrics.navX = sr.left + sr.width / 2;
        dockMetrics.navY = sr.top + sr.height / 2;
        dockMetrics.targetScale = sr.width / baseSize;

        if (heroLogoSlot) {
            const hr = heroLogoSlot.getBoundingClientRect();
            if (hr.width > 0) {
                dockMetrics.heroX = hr.left + hr.width / 2;
                // Document-space center Y so fast scroll never pulls the origin off-screen
                dockMetrics.heroY = hr.top + window.scrollY + hr.height / 2;
                dockMetrics.scrollRange = Math.max(180, dockMetrics.heroY - dockMetrics.navY);
            } else {
                dockMetrics.heroX = dockMetrics.navX;
                dockMetrics.heroY = dockMetrics.navY;
                dockMetrics.scrollRange = 180;
            }
        } else {
            dockMetrics.heroX = dockMetrics.navX;
            dockMetrics.heroY = dockMetrics.navY;
            dockMetrics.scrollRange = 180;
        }

        dockMetrics.ready = true;
        return true;
    }

    function computeTargetDockProgress() {
        if (!heroLogoSlot) return 1;
        const sy = Math.max(0, window.scrollY || window.pageYOffset || 0);
        return Math.max(0, Math.min(1, sy / dockMetrics.scrollRange));
    }

    function renderLogoDockFrame(p) {
        if (!logoContainer || !dockMetrics.ready) return;

        const clamped = Math.max(0, Math.min(1, p));
        // Gentle cubic curve + slight arc feel without harsh start/end
        const t = clamped * clamped * (3 - 2 * clamped);
        const tX = Math.sin(clamped * Math.PI * 0.5);
        const tY = t;

        let cx = dockMetrics.navX;
        let cy = dockMetrics.navY;
        let scale = dockMetrics.targetScale;

        if (heroLogoSlot) {
            // Follow iOS top rubber-band overscroll gently when at top
            const overscrollY = window.scrollY < 0 ? -window.scrollY * (1 - clamped) : 0;
            cx = dockMetrics.heroX + (dockMetrics.navX - dockMetrics.heroX) * tX;
            cy = dockMetrics.heroY + (dockMetrics.navY - dockMetrics.heroY) * tY + overscrollY;
            // Perceptually uniform logarithmic scaling (feels linear to the eye)
            scale = Math.pow(dockMetrics.targetScale, t);
        }

        const half = dockMetrics.baseSize / 2;
        logoContainer.style.transform = `translate3d(${(cx - half).toFixed(3)}px, ${(cy - half).toFixed(3)}px, 0) scale(${scale.toFixed(5)})`;
        logoContainer.style.opacity = '1';

        if (brandTextEl) {
            const fade = heroLogoSlot ? Math.max(0, Math.min(1, 1 - (clamped - 0.04) / 0.36)) : 0;
            brandTextEl.style.opacity = fade.toFixed(3);
            brandTextEl.style.transform = `translate3d(${(-(1 - fade) * 10).toFixed(2)}px, 0, 0)`;
        }
        if (brandLink) {
            brandLink.style.pointerEvents = (!heroLogoSlot || clamped < 0.4) ? 'auto' : 'none';
        }
    }

    function tickLogoDock(ts) {
        dockRafId = 0;
        if (!logoContainer || !dockMetrics.ready) return;

        targetDockProgress = computeTargetDockProgress();
        const rawDt = lastDockTs ? Math.min(0.05, Math.max(0.001, (ts - lastDockTs) / 1000)) : 0.016;
        lastDockTs = ts;

        if (prefersReducedMotion) {
            dockProgress = targetDockProgress;
            dockVelocity = 0;
            lastDockTs = 0;
            renderLogoDockFrame(dockProgress);
            return;
        }

        // Critically-damped spring (zero bounce, silky ease-in/out on both slow drag and fast flick)
        const omega = 12.5;
        const steps = rawDt > 0.02 ? 2 : 1;
        const dt = rawDt / steps;
        for (let i = 0; i < steps; i++) {
            const x = dockProgress - targetDockProgress;
            const acc = -omega * omega * x - 2 * omega * dockVelocity;
            dockVelocity += acc * dt;
            dockProgress += dockVelocity * dt;
        }

        const settled = Math.abs(targetDockProgress - dockProgress) < 0.0004 && Math.abs(dockVelocity) < 0.0008;
        if (settled && window.scrollY >= 0) {
            dockProgress = targetDockProgress;
            dockVelocity = 0;
            lastDockTs = 0;
            renderLogoDockFrame(dockProgress);
            return;
        }

        renderLogoDockFrame(dockProgress);
        dockRafId = window.requestAnimationFrame(tickLogoDock);
    }

    function updateLogoDock(snap = false, remeasure = false) {
        if (!logoContainer || !headerLogoSlot) return;
        if (remeasure || !dockMetrics.ready) {
            if (!measureDockMetrics()) return;
        }
        targetDockProgress = computeTargetDockProgress();
        if (snap || prefersReducedMotion) {
            if (dockRafId) {
                window.cancelAnimationFrame(dockRafId);
                dockRafId = 0;
            }
            dockProgress = targetDockProgress;
            dockVelocity = 0;
            lastDockTs = 0;
            renderLogoDockFrame(dockProgress);
            return;
        }
        if (!dockRafId) {
            lastDockTs = 0;
            dockRafId = window.requestAnimationFrame(tickLogoDock);
        }
    }

    if (logoContainer && headerLogoSlot) {
        window.addEventListener('scroll', () => updateLogoDock(false, false), { passive: true });
        window.addEventListener('resize', () => {
            // Ignore mobile Safari vertical URL-bar resizes during scroll to prevent mid-scroll snaps
            const widthChanged = Math.abs(window.innerWidth - lastViewportWidth) > 2;
            lastViewportWidth = window.innerWidth;
            if (widthChanged) {
                updateLogoDock(true, true);
                updateNavIndicator(true);
            } else if (!dockRafId && window.scrollY <= 2) {
                updateLogoDock(true, true);
            }
        }, { passive: true });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                updateLogoDock(true, true);
                updateNavIndicator(true);
            });
        }
        updateLogoDock(true, true);

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
    // 4. Engineering Capture Console Layer Switcher
    // =========================================================
    const vizWrap = document.getElementById('episode-viz');
    if (vizWrap) {
        const modeBtns = vizWrap.querySelectorAll('.viz-mode-btn');
        const layerSync = document.getElementById('viz-layer-sync');
        const layerKinematics = document.getElementById('viz-layer-kinematics');
        const layerThermal = document.getElementById('viz-layer-thermal');
        const badgeText = document.getElementById('viz-badge-text');
        const groupedEls = vizWrap.querySelectorAll('[data-stream-group]');

        function setVizMode(mode) {
            currentVizMode = mode;
            modeBtns.forEach((btn) => {
                btn.classList.toggle('active', btn.getAttribute('data-viz-mode') === mode);
            });

            const showSync = mode === 'all' || mode === 'sync';
            const showKin = mode === 'all' || mode === 'kinematics';
            const showThermal = mode === 'all' || mode === 'thermal';

            if (layerSync) layerSync.classList.toggle('dimmed', !showSync);
            if (layerKinematics) layerKinematics.classList.toggle('dimmed', !showKin);
            if (layerThermal) layerThermal.classList.toggle('dimmed', !showThermal);

            groupedEls.forEach((el) => {
                const grp = el.getAttribute('data-stream-group');
                const active = mode === 'all' || grp === 'all' || grp === mode;
                el.classList.toggle('dimmed', !active);
            });

            if (badgeText) {
                if (mode === 'thermal') badgeText.textContent = 'LWIR_THERMAL · RADIOMETRIC CONTOUR LAYER';
                else if (mode === 'kinematics') badgeText.textContent = 'HAND_3D + MOCAP · 42 DOF & UMI REACHABILITY';
                else if (mode === 'sync') badgeText.textContent = 'CAM_BASE + WRIST_L/R · 60 HZ HARDWARE SYNC';
                else badgeText.textContent = 'EPISODE_SCHEMA · BASE + WRIST + 3D HAND';
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

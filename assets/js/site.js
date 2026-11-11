(() => {
    const DURATION = 6.0;
    const FPS = 30;
    const TOTAL_FRAMES = Math.round(DURATION * FPS);

    const PHASES = [
        { id: 'approach_grasp', label: '01 Grasp', start: 0.0, end: 1.5, note: 'Approach & secure plug body' },
        { id: 'align_keyway', label: '02 Align', start: 1.5, end: 3.2, note: 'Match keyway angle to collar' },
        { id: 'axial_insert', label: '03 Insert', start: 3.2, end: 4.8, note: 'Axial mating past spring detent' },
        { id: 'lock_verify', label: '04 Lock', start: 4.8, end: 6.0, note: 'Quarter-turn lock & retention check' }
    ];

    const state = {
        time: 3.85,
        playing: false,
        lastTs: null,
        inView: true,
        channels: {
            rgb: true,
            events: true,
            depth: true,
            pose: true,
            trajectory: true,
            force: true
        }
    };

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    state.playing = !reducedMotion;

    // Navigation & View Routing (#overview vs #careers)
    const viewOverview = document.getElementById('view-overview');
    const viewCareers = document.getElementById('view-careers');
    const navLinks = document.querySelectorAll('[data-nav-target]');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    function closeMobileMenu() {
        if (!mobileDrawer || !mobileMenuBtn) return;
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }

    function setActiveView(viewName, hashTarget, smoothScroll = false) {
        const isCareers = viewName === 'careers';
        if (viewOverview) viewOverview.classList.toggle('active', !isCareers);
        if (viewCareers) viewCareers.classList.toggle('active', isCareers);

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            const isSectionAnchor = href && href !== '#careers' && href !== '#overview';
            if (isCareers) {
                link.classList.toggle('active', href === '#careers');
            } else if (isSectionAnchor && hashTarget) {
                link.classList.toggle('active', href === hashTarget);
            } else {
                link.classList.remove('active');
            }
        });

        const behavior = smoothScroll && !reducedMotion ? 'smooth' : 'auto';
        if (hashTarget && hashTarget !== '#overview' && hashTarget !== '#careers') {
            const anchorEl = document.querySelector(hashTarget);
            if (anchorEl) {
                anchorEl.scrollIntoView({ behavior });
            }
        } else {
            window.scrollTo({ top: 0, behavior });
        }

        if (!isCareers) {
            resizeCanvas();
            renderAll();
        }
    }

    function handleHash() {
        const hash = (window.location.hash || '').toLowerCase();
        if (hash === '#careers') {
            setActiveView('careers', null, false);
        } else {
            setActiveView('overview', hash && hash !== '#overview' ? hash : null, false);
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            closeMobileMenu();

            if (href === '#careers') {
                if (window.location.hash !== '#careers') {
                    history.pushState(null, '', '#careers');
                }
                setActiveView('careers', null, true);
            } else {
                if (window.location.hash !== href) {
                    history.pushState(null, '', href);
                }
                setActiveView('overview', href, true);
            }
        });
    });

    window.addEventListener('hashchange', handleHash);

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            const open = mobileDrawer.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // Careers Accordion (preserved)
    window.toggleVacancy = function toggleVacancy(id) {
        const item = document.getElementById(id);
        if (!item) return;
        const isExpanded = item.classList.toggle('expanded');
        const header = item.querySelector('.vacancy-row-header');
        const toggleText = item.querySelector('.toggle-text');
        if (header) header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        if (toggleText) toggleText.textContent = isExpanded ? 'Close' : 'Details';
    };

    document.querySelectorAll('.vacancy-row-header').forEach((header) => {
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    // Email Copy Helper
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'gleb@sverkaus.com';
            try {
                await navigator.clipboard.writeText(email);
                copyEmailBtn.textContent = 'Copied gleb@sverkaus.com';
                setTimeout(() => {
                    copyEmailBtn.textContent = 'Copy Email';
                }, 2200);
            } catch {
                copyEmailBtn.textContent = email;
            }
        });
    }

    // Physics / Kinematics Model (Conceptual Illustrative Profile)
    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    function smoothstep(edge0, edge1, x) {
        const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    function getPhase(t) {
        for (let i = 0; i < PHASES.length; i++) {
            if (t <= PHASES[i].end || i === PHASES.length - 1) {
                return PHASES[i];
            }
        }
        return PHASES[0];
    }

    function sampleKinematics(t) {
        const phase = getPhase(t);
        let plugNormX = 0; // 0 = seated in receptacle, 1 = far right approach
        let plugNormY = 0;
        let keyAngleDeg = 0;
        let axialForceRel = 0; // normalized 0..1 illustrative contact profile
        let gripForceRel = 0.25;
        let collarLockProgress = 0;

        if (t < 1.5) {
            const u = smoothstep(0.0, 1.5, t);
            plugNormX = 1.0 - 0.65 * u;
            plugNormY = 0.38 * (1.0 - u);
            keyAngleDeg = 22 * (1.0 - 0.35 * u);
            axialForceRel = 0.0;
            gripForceRel = 0.25 + 0.35 * u;
        } else if (t < 3.2) {
            const u = smoothstep(1.5, 3.2, t);
            plugNormX = 0.35 - 0.23 * u;
            plugNormY = 0.06 * Math.sin((1 - u) * Math.PI);
            keyAngleDeg = 14.3 * (1.0 - u);
            axialForceRel = u > 0.7 ? 0.14 * smoothstep(0.7, 1.0, u) : 0.0;
            gripForceRel = 0.60;
        } else if (t < 4.8) {
            const u = smoothstep(3.2, 4.8, t);
            plugNormX = 0.12 * (1.0 - u);
            plugNormY = 0.0;
            keyAngleDeg = 0.0;
            // Illustrative insertion force ramp peaking at detent (~u=0.62), then dropping on seating
            if (u < 0.62) {
                axialForceRel = 0.14 + 0.86 * smoothstep(0.0, 0.62, u);
            } else {
                axialForceRel = 1.0 - 0.82 * smoothstep(0.62, 0.9, u);
            }
            gripForceRel = 0.65 + 0.28 * Math.sin(u * Math.PI);
        } else {
            const u = smoothstep(4.8, 6.0, t);
            plugNormX = 0.0;
            plugNormY = 0.0;
            keyAngleDeg = 0.0;
            collarLockProgress = smoothstep(0.0, 0.55, u);
            // Gentle retention check pulse near end
            const pullPulse = Math.exp(-Math.pow((u - 0.78) / 0.12, 2));
            axialForceRel = 0.18 * (1 - 0.4 * u) + 0.22 * pullPulse;
            gripForceRel = 0.52 + 0.22 * pullPulse;
        }

        const clearanceMm = +(plugNormX * 165).toFixed(1);
        const zDepthM = +(0.42 - plugNormX * 0.045).toFixed(3);

        return {
            phase,
            plugNormX,
            plugNormY,
            keyAngleDeg,
            axialForceRel,
            gripForceRel,
            collarLockProgress,
            clearanceMm,
            zDepthM
        };
    }

    // Canvas Rendering (Layer 1: Egocentric Connector Assembly)
    const canvas = document.getElementById('capture-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    function resizeCanvas() {
        if (!canvas) return;
        const rect = canvas.parentElement.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
    }

    function rrect(c, x, y, w, h, r) {
        if (typeof c.roundRect === 'function') {
            c.roundRect(x, y, w, h, r);
            return;
        }
        const rad = Math.min(r, w / 2, h / 2);
        c.moveTo(x + rad, y);
        c.arcTo(x + w, y, x + w, y + h, rad);
        c.arcTo(x + w, y + h, x, y + h, rad);
        c.arcTo(x, y + h, x, y, rad);
        c.arcTo(x, y, x + w, y, rad);
        c.closePath();
    }

    function drawArrow(x1, y1, x2, y2, color, lineWidth = 2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len < 3) return;
        const angle = Math.atan2(dy, dx);
        const head = Math.min(9, len * 0.4);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawTriad(cx, cy, angleRad, scale) {
        const xEnd = { x: cx + Math.cos(angleRad) * scale, y: cy + Math.sin(angleRad) * scale };
        const yEnd = { x: cx - Math.sin(angleRad) * scale * 0.85, y: cy - Math.cos(angleRad) * scale * 0.85 };
        const zEnd = { x: cx - Math.cos(angleRad + 0.55) * scale * 0.65, y: cy + Math.sin(angleRad + 0.55) * scale * 0.65 };
        drawArrow(cx, cy, xEnd.x, xEnd.y, '#ef4444', 1.75);
        drawArrow(cx, cy, yEnd.x, yEnd.y, '#a3e635', 1.75);
        drawArrow(cx, cy, zEnd.x, zEnd.y, '#38bdf8', 1.75);
    }

    function drawTaskViewport(t) {
        if (!canvas || !ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        if (!w || !h) return;

        const dpr = w / canvas.parentElement.getBoundingClientRect().width;
        const k = sampleKinematics(t);
        const ch = state.channels;

        ctx.save();
        ctx.clearRect(0, 0, w, h);

        // Background workbench (egocentric top-down angle)
        if (ch.rgb) {
            const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
            bgGrad.addColorStop(0, '#14171c');
            bgGrad.addColorStop(1, '#0d0f13');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, w, h);

            // ESD workstation mat grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
            ctx.lineWidth = 1;
            const step = Math.round(36 * dpr);
            for (let gx = step; gx < w; gx += step) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, h);
                ctx.stroke();
            }
            for (let gy = step; gy < h; gy += step) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(w, gy);
                ctx.stroke();
            }

            // Precision torque driver & parts tray on upper workbench (context of skilled tool workspace)
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            rrect(ctx, w * 0.58, h * 0.12, w * 0.34, h * 0.14, 4 * dpr);
            ctx.fill();
            ctx.stroke();

            // Tool handle + shaft silhouette
            ctx.fillStyle = '#2b303a';
            ctx.beginPath();
            rrect(ctx, w * 0.61, h * 0.165, w * 0.11, h * 0.05, 3 * dpr);
            ctx.fill();
            ctx.strokeStyle = '#6f7785';
            ctx.lineWidth = 2.2 * dpr;
            ctx.beginPath();
            ctx.moveTo(w * 0.72, h * 0.19);
            ctx.lineTo(w * 0.87, h * 0.19);
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.fillStyle = '#090a0d';
            ctx.fillRect(0, 0, w, h);
        }

        // Key coordinates
        const recX = w * 0.30;
        const recY = h * 0.52;
        const maxTravel = w * 0.33;
        const plugTipX = recX + w * 0.045 + k.plugNormX * maxTravel;
        const plugTipY = recY + k.plugNormY * h * 0.25;

        // Stereo / Depth Contour Overlay (rings behind hardware)
        if (ch.depth) {
            ctx.save();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.24)';
            ctx.lineWidth = 1 * dpr;
            for (let r = 1; r <= 4; r++) {
                ctx.setLineDash([4 * dpr, 4 * dpr]);
                ctx.beginPath();
                ctx.ellipse(recX, recY, (28 + r * 24) * dpr, (22 + r * 18) * dpr, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            ctx.restore();
        }

        // Aluminum Enclosure Bracket & Panel Receptacle
        ctx.save();
        const panelW = w * 0.14;
        const panelH = h * 0.46;
        const panelX = recX - panelW * 0.72;
        const panelY = recY - panelH * 0.5;

        ctx.fillStyle = ch.rgb ? '#22262d' : 'rgba(255,255,255,0.03)';
        ctx.strokeStyle = ch.rgb ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1.5 * dpr;
        ctx.beginPath();
        rrect(ctx, panelX, panelY, panelW, panelH, 6 * dpr);
        ctx.fill();
        ctx.stroke();

        // Mounting bolts
        ctx.fillStyle = ch.rgb ? '#3f4551' : '#252930';
        [[panelX + 12 * dpr, panelY + 14 * dpr], [panelX + 12 * dpr, panelY + panelH - 14 * dpr]].forEach(([bx, by]) => {
            ctx.beginPath();
            ctx.arc(bx, by, 4 * dpr, 0, Math.PI * 2);
            ctx.fill();
        });

        // Receptacle collar
        const recLen = w * 0.065;
        const recRad = 22 * dpr;
        ctx.fillStyle = ch.rgb ? '#2e333c' : 'rgba(255,255,255,0.05)';
        ctx.strokeStyle = ch.rgb ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.16)';
        ctx.beginPath();
        rrect(ctx, recX - 8 * dpr, recY - recRad, recLen, recRad * 2, 4 * dpr);
        ctx.fill();
        ctx.stroke();

        // Receptacle front socket ellipse & keyway notch
        ctx.fillStyle = '#111317';
        ctx.beginPath();
        ctx.ellipse(recX + recLen - 8 * dpr, recY, 9 * dpr, recRad - 2 * dpr, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Keyway indicator at top of receptacle
        ctx.fillStyle = k.keyAngleDeg < 2 ? '#a3e635' : '#f59e0b';
        ctx.fillRect(recX + recLen - 12 * dpr, recY - recRad, 5 * dpr, 5 * dpr);
        ctx.restore();

        // Motion Trajectory Trail (if enabled)
        if (ch.trajectory) {
            ctx.save();
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
            ctx.lineWidth = 1.8 * dpr;
            ctx.setLineDash([5 * dpr, 4 * dpr]);
            ctx.beginPath();
            const samples = 28;
            for (let i = 0; i <= samples; i++) {
                const st = (t * i) / samples;
                const sk = sampleKinematics(st);
                const sx = recX + w * 0.045 + sk.plugNormX * maxTravel;
                const sy = recY + sk.plugNormY * h * 0.25;
                if (i === 0) ctx.moveTo(sx, sy);
                else ctx.lineTo(sx, sy);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Instantaneous velocity arrow toward receptacle
            if (k.plugNormX > 0.01) {
                const vx = plugTipX - 34 * dpr;
                const vy = plugTipY - k.plugNormY * 14 * dpr;
                drawArrow(plugTipX, plugTipY - 28 * dpr, vx, vy - 28 * dpr, '#f59e0b', 2 * dpr);
            }
            ctx.restore();
        }

        // Connector Plug + Shielded Cable + Operator Gloved Hand
        ctx.save();
        const plugBodyLen = w * 0.11;
        const plugRad = 18 * dpr;
        const tiltRad = (k.keyAngleDeg * Math.PI) / 180 * 0.35;

        ctx.translate(plugTipX, plugTipY);
        ctx.rotate(tiltRad);

        // Shielded braided cable tail extending right-downward
        ctx.strokeStyle = ch.rgb ? '#3b414d' : 'rgba(255,255,255,0.22)';
        ctx.lineWidth = 11 * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(plugBodyLen + 14 * dpr, 0);
        ctx.bezierCurveTo(plugBodyLen + 80 * dpr, 8 * dpr, plugBodyLen + 130 * dpr, 65 * dpr, plugBodyLen + 200 * dpr, 130 * dpr);
        ctx.stroke();

        // Locking collar (rotates in phase 4)
        const collarOffset = 6 * dpr;
        ctx.fillStyle = ch.rgb ? '#4b5362' : 'rgba(255,255,255,0.12)';
        ctx.strokeStyle = ch.rgb ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        rrect(ctx, collarOffset, -plugRad - 2 * dpr, 24 * dpr, (plugRad + 2 * dpr) * 2, 3 * dpr);
        ctx.fill();
        ctx.stroke();

        // Knurl/lock marker moving vertically across collar as it turns 90 deg
        const lockShift = -plugRad + k.collarLockProgress * plugRad * 1.4;
        ctx.fillStyle = k.collarLockProgress > 0.85 ? '#a3e635' : '#f59e0b';
        ctx.fillRect(collarOffset + 9 * dpr, lockShift, 6 * dpr, 7 * dpr);

        // Connector main cylindrical shell
        ctx.fillStyle = ch.rgb ? '#2a2f38' : 'rgba(255,255,255,0.06)';
        ctx.beginPath();
        rrect(ctx, 30 * dpr, -plugRad + 2 * dpr, plugBodyLen - 20 * dpr, (plugRad - 2 * dpr) * 2, 4 * dpr);
        ctx.fill();
        ctx.stroke();

        // Connector mating pins tip
        ctx.fillStyle = ch.rgb ? '#9aa3b2' : 'rgba(255,255,255,0.25)';
        ctx.fillRect(-10 * dpr, -plugRad + 5 * dpr, 16 * dpr, (plugRad - 5 * dpr) * 2);

        // Operator right gloved hand (egocentric wrist coming from bottom-right)
        const handX = plugBodyLen * 0.56;
        ctx.fillStyle = ch.rgb ? 'rgba(54, 66, 84, 0.92)' : 'rgba(54, 66, 84, 0.25)';
        ctx.strokeStyle = ch.rgb ? 'rgba(180, 198, 224, 0.42)' : 'rgba(180, 198, 224, 0.2)';
        ctx.lineWidth = 1.4 * dpr;

        // Palm + wrist silhouette
        ctx.beginPath();
        ctx.moveTo(handX - 18 * dpr, -22 * dpr);
        ctx.quadraticCurveTo(handX + 44 * dpr, -26 * dpr, handX + 110 * dpr, 38 * dpr);
        ctx.lineTo(handX + 80 * dpr, 92 * dpr);
        ctx.quadraticCurveTo(handX + 12 * dpr, 36 * dpr, handX - 20 * dpr, 24 * dpr);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Thumb & index finger wrap
        ctx.beginPath();
        rrect(ctx, handX - 24 * dpr, -26 * dpr, 36 * dpr, 14 * dpr, 6 * dpr);
        rrect(ctx, handX - 18 * dpr, 14 * dpr, 32 * dpr, 13 * dpr, 6 * dpr);
        ctx.fill();
        ctx.stroke();

        // Hand & Object Pose Overlay (6-DoF Triad + Skeleton)
        if (ch.pose) {
            const joints = [
                [handX - 16 * dpr, -19 * dpr],
                [handX - 2 * dpr, -19 * dpr],
                [handX + 14 * dpr, -10 * dpr],
                [handX + 38 * dpr, 8 * dpr],
                [handX + 14 * dpr, 18 * dpr],
                [handX - 10 * dpr, 20 * dpr]
            ];
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5 * dpr;
            ctx.beginPath();
            ctx.moveTo(joints[0][0], joints[0][1]);
            ctx.lineTo(joints[1][0], joints[1][1]);
            ctx.lineTo(joints[2][0], joints[2][1]);
            ctx.lineTo(joints[3][0], joints[3][1]);
            ctx.moveTo(joints[3][0], joints[3][1]);
            ctx.lineTo(joints[4][0], joints[4][1]);
            ctx.lineTo(joints[5][0], joints[5][1]);
            ctx.stroke();

            joints.forEach(([jx, jy]) => {
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(jx, jy, 3 * dpr, 0, Math.PI * 2);
                ctx.fill();
            });

            drawTriad(0, 0, 0, 26 * dpr);
        }

        // Force / Tactile Vectors Overlay
        if (ch.force) {
            if (k.axialForceRel > 0.04) {
                const arrowLen = (14 + k.axialForceRel * 34) * dpr;
                drawArrow(-12 * dpr, -32 * dpr, -12 * dpr - arrowLen, -32 * dpr, '#f59e0b', 2.4 * dpr);
                ctx.fillStyle = '#f59e0b';
                ctx.font = `700 ${Math.round(10 * dpr)}px "JetBrains Mono", monospace`;
                ctx.fillText(`F_axial`, -12 * dpr - arrowLen, -40 * dpr);
            }
            // Tactile grip rings on thumb & index
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + k.gripForceRel * 0.5})`;
            ctx.lineWidth = 1.6 * dpr;
            ctx.beginPath();
            ctx.arc(handX - 10 * dpr, -19 * dpr, (7 + k.gripForceRel * 5) * dpr, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(handX - 6 * dpr, 20 * dpr, (7 + k.gripForceRel * 5) * dpr, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();

        // Target Frame Triad on Receptacle
        if (ch.pose) {
            drawTriad(recX + recLen - 8 * dpr, recY, 0, 24 * dpr);
        }

        // Depth readouts rendered cleanly in foreground below mounting panel
        if (ch.depth) {
            ctx.save();
            ctx.fillStyle = 'rgba(245, 158, 11, 0.92)';
            ctx.font = `600 ${Math.round(10 * dpr)}px "JetBrains Mono", monospace`;
            const labelY = Math.min(h - 38 * dpr, panelY + panelH + 18 * dpr);
            ctx.fillText(`z_target: 0.420 m`, panelX, labelY);
            ctx.fillText(`z_plug: ${k.zDepthM.toFixed(3)} m`, Math.max(panelX + 125 * dpr, plugTipX - 6 * dpr), labelY);
            ctx.restore();
        }

        // Top HUD Overlays (Frame, Camera, Phase Events)
        ctx.save();
        ctx.font = `600 ${Math.round(10.5 * dpr)}px "JetBrains Mono", monospace`;
        const frameIdx = Math.min(TOTAL_FRAMES, Math.round(t * FPS));

        if (ch.rgb) {
            // Subtle camera frame corner reticles
            const pad = 12 * dpr;
            const cr = 10 * dpr;
            ctx.strokeStyle = 'rgba(255,255,255,0.22)';
            ctx.lineWidth = 1.2 * dpr;
            [
                [pad, pad + cr, pad, pad, pad + cr, pad],
                [w - pad - cr, pad, w - pad, pad, w - pad, pad + cr],
                [pad, h - pad - cr, pad, h - pad, pad + cr, h - pad],
                [w - pad - cr, h - pad, w - pad, h - pad, w - pad, h - pad - cr]
            ].forEach(([x1, y1, x2, y2, x3, y3]) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.stroke();
            });
            ctx.fillStyle = 'rgba(242, 243, 245, 0.86)';
            ctx.fillText(`SKILLED TECH · EGOCENTRIC RGB · FRAME ${String(frameIdx).padStart(3, '0')}`, 20 * dpr, 26 * dpr);
        } else {
            ctx.fillStyle = 'rgba(164, 171, 184, 0.7)';
            ctx.fillText(`RGB STREAM OFF · SENSOR SCHEMATIC ONLY`, 20 * dpr, 26 * dpr);
        }

        if (ch.events) {
            ctx.fillStyle = 'rgba(163, 230, 53, 0.95)';
            ctx.fillText(`EVENT: ${k.phase.id}`, 20 * dpr, h - 18 * dpr);
        }

        ctx.fillStyle = 'rgba(164, 171, 184, 0.78)';
        ctx.textAlign = 'right';
        ctx.fillText(`t = ${t.toFixed(2)} s · Δx ≈ ${k.clearanceMm.toFixed(1)} mm`, w - 20 * dpr, h - 18 * dpr);
        ctx.restore();

        ctx.restore();
    }

    // Layer 2 & Layer 3 DOM Refs
    const modalityButtons = document.querySelectorAll('.modality-toggle[data-channel]');
    const presetButtons = document.querySelectorAll('.preset-btn[data-preset]');
    const phaseButtons = document.querySelectorAll('.phase-pill[data-phase-start]');
    const obsCallout = document.getElementById('observation-callout');
    const scrubber = document.getElementById('time-scrubber');
    const playBtn = document.getElementById('play-toggle-btn');
    const stepBackBtn = document.getElementById('step-back-btn');
    const stepFwdBtn = document.getElementById('step-fwd-btn');
    const timeReadout = document.getElementById('transport-readout');
    const schemaOutput = document.getElementById('schema-output');
    const trackRows = document.querySelectorAll('.track-row[data-track]');
    const playheads = document.querySelectorAll('.track-playhead');

    function updateObservationCallout() {
        if (!obsCallout) return;
        const ch = state.channels;
        const hasForce = ch.force;
        const hasSpatial = ch.depth || ch.pose || ch.trajectory;

        obsCallout.classList.remove('is-baseline', 'is-measured');

        if (hasForce) {
            obsCallout.classList.add('is-measured');
            obsCallout.innerHTML =
                '<strong>Skilled task to ML-ready output:</strong> Video shows a trained technician inserting the connector, while project-scoped <strong>force/tactile sensing</strong> captures axial seating resistance and detent snap—turning specialized execution into a synchronized training episode.';
        } else if (hasSpatial) {
            obsCallout.classList.add('is-baseline');
            obsCallout.innerHTML =
                '<strong>Multimodal spatial setup (project-dependent):</strong> Metric depth, 6-DoF pose, or motion trajectories require calibrated cameras or tracking hardware. Contact resistance during insertion remains unmeasured unless instrumented F/T or tactile sensors are added.';
        } else {
            obsCallout.classList.add('is-baseline');
            obsCallout.innerHTML =
                '<strong>Baseline video + annotations:</strong> Synchronized RGB frames, timestamps, and structured task events form a baseline ML dataset, while contact forces and metric 3D trajectories require project-dependent sensing hardware.';
        }
    }

    function updateTimelineUI(t) {
        const pct = (t / DURATION) * 100;
        const frameIdx = Math.min(TOTAL_FRAMES, Math.round(t * FPS));
        const currentPhase = getPhase(t);

        if (scrubber) scrubber.value = String(t.toFixed(2));
        if (timeReadout) timeReadout.textContent = `${t.toFixed(2)}s / ${DURATION.toFixed(2)}s · f${String(frameIdx).padStart(3, '0')}`;
        if (playBtn) playBtn.textContent = state.playing ? 'Pause' : 'Play';

        playheads.forEach((ph) => {
            ph.style.left = `${pct}%`;
        });

        phaseButtons.forEach((btn) => {
            const pId = btn.getAttribute('data-phase-id');
            btn.classList.toggle('active', pId === currentPhase.id);
        });

        trackRows.forEach((row) => {
            const key = row.getAttribute('data-track');
            const active = Boolean(state.channels[key]);
            row.classList.toggle('inactive', !active);
            const stateEl = row.querySelector('.track-state');
            if (stateEl) {
                const isDep = row.getAttribute('data-tier') === 'dependent';
                if (!active) stateEl.textContent = 'inactive';
                else stateEl.textContent = isDep ? 'active (hardware-scoped)' : 'active (baseline)';
            }
        });
    }

    function updateSchemaPreview(t) {
        if (!schemaOutput) return;
        const ch = state.channels;
        const k = sampleKinematics(t);
        const frameIdx = Math.min(TOTAL_FRAMES, Math.round(t * FPS));
        const tsNs = Math.round(t * 1e9);

        const lines = [];
        lines.push(`<span class="schema-comment">// Conceptual ML-ready episode (agreed per project)</span>`);
        lines.push(`{`);
        lines.push(`  <span class="schema-key">"dataset_profile"</span>: <span class="schema-val">"ml_ready_conceptual"</span>,`);
        lines.push(`  <span class="schema-key">"operator_skill"</span>: <span class="schema-val">"skilled_technician"</span>,`);
        lines.push(`  <span class="schema-key">"conceptual_demo"</span>: <span class="schema-warn">true</span>,`);
        lines.push(`  <span class="schema-key">"frame_index"</span>: ${frameIdx},`);
        lines.push(`  <span class="schema-key">"timestamp_ns"</span>: ${tsNs},`);
        lines.push(`  <span class="schema-key">"streams"</span>: {`);
        lines.push(
            ch.rgb
                ? `    <span class="schema-key">"rgb"</span>: <span class="schema-val">"cam0/${String(frameIdx).padStart(6, '0')}.png"</span>,`
                : `    <span class="schema-key">"rgb"</span>: <span class="schema-comment">null /* disabled */</span>,`
        );
        lines.push(
            ch.depth
                ? `    <span class="schema-key">"depth_m"</span>: <span class="schema-warn">"depth/${String(frameIdx).padStart(6, '0')}.png"</span>\n    <span class="schema-comment">/* requires stereo/depth cam */</span>`
                : `    <span class="schema-key">"depth_m"</span>: <span class="schema-comment">null /* project-dependent */</span>`
        );
        lines.push(`  },`);

        lines.push(`  <span class="schema-key">"measurements"</span>: {`);
        lines.push(
            ch.pose
                ? `    <span class="schema-key">"pose_6dof_mm"</span>: [${k.clearanceMm}, ${+(k.plugNormY * 45).toFixed(1)}, 0.0],`
                : `    <span class="schema-key">"pose_6dof_mm"</span>: <span class="schema-comment">null /* requires tracking */</span>,`
        );
        lines.push(
            ch.trajectory
                ? `    <span class="schema-key">"target_z_m"</span>: ${k.zDepthM},`
                : `    <span class="schema-key">"target_z_m"</span>: <span class="schema-comment">null /* project-dependent */</span>,`
        );
        lines.push(
            ch.force
                ? `    <span class="schema-key">"force_tactile"</span>: {\n      <span class="schema-key">"axial_norm"</span>: ${k.axialForceRel.toFixed(2)},\n      <span class="schema-key">"grip_norm"</span>: ${k.gripForceRel.toFixed(2)}\n    } <span class="schema-comment">/* requires F/T or tactile rig */</span>`
                : `    <span class="schema-key">"force_tactile"</span>: <span class="schema-comment">null</span>\n    <span class="schema-comment">/* cannot infer reliably from RGB */</span>`
        );
        lines.push(`  },`);

        lines.push(`  <span class="schema-key">"annotations"</span>: ${
            ch.events
                ? `{\n    <span class="schema-key">"phase"</span>: <span class="schema-val">"${k.phase.id}"</span>,\n    <span class="schema-key">"collar_locked"</span>: ${k.collarLockProgress > 0.85}\n  },`
                : `<span class="schema-comment">null /* events disabled */</span>,`
        }`);
        lines.push(`  <span class="schema-key">"qa_check"</span>: <span class="schema-val">"scoped_per_pilot"</span>`);
        lines.push(`}`);

        schemaOutput.innerHTML = lines.join('\n');
    }

    function syncPresetState() {
        const ch = state.channels;
        const isBaselineOnly = ch.rgb && ch.events && !ch.depth && !ch.pose && !ch.trajectory && !ch.force;
        const isFull = ch.rgb && ch.events && ch.depth && ch.pose && ch.trajectory && ch.force;
        presetButtons.forEach((btn) => {
            const p = btn.getAttribute('data-preset');
            btn.classList.toggle('active', (p === 'baseline' && isBaselineOnly) || (p === 'full' && isFull));
        });
    }

    function renderAll() {
        drawTaskViewport(state.time);
        updateTimelineUI(state.time);
        updateSchemaPreview(state.time);
        updateObservationCallout();
        syncPresetState();
    }

    // Channel Toggles
    modalityButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-channel');
            if (!(key in state.channels)) return;
            const next = !state.channels[key];
            state.channels[key] = next;
            btn.setAttribute('aria-pressed', next ? 'true' : 'false');
            renderAll();
        });
    });

    // Presets
    presetButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const preset = btn.getAttribute('data-preset');
            const full = preset === 'full';
            state.channels.rgb = true;
            state.channels.events = true;
            state.channels.depth = full;
            state.channels.pose = full;
            state.channels.trajectory = full;
            state.channels.force = full;

            modalityButtons.forEach((mBtn) => {
                const key = mBtn.getAttribute('data-channel');
                mBtn.setAttribute('aria-pressed', state.channels[key] ? 'true' : 'false');
            });
            renderAll();
        });
    });

    // Phase Jumps
    phaseButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const start = parseFloat(btn.getAttribute('data-phase-start'));
            if (!Number.isNaN(start)) {
                state.time = clamp(start + 0.45, 0, DURATION);
                renderAll();
            }
        });
    });

    // Transport Controls
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            state.playing = !state.playing;
            state.lastTs = null;
            updateTimelineUI(state.time);
        });
    }

    if (stepBackBtn) {
        stepBackBtn.addEventListener('click', () => {
            state.playing = false;
            state.time = clamp(state.time - 1 / FPS * 3, 0, DURATION);
            renderAll();
        });
    }

    if (stepFwdBtn) {
        stepFwdBtn.addEventListener('click', () => {
            state.playing = false;
            state.time = clamp(state.time + 1 / FPS * 3, 0, DURATION);
            renderAll();
        });
    }

    if (scrubber) {
        scrubber.addEventListener('input', () => {
            state.playing = false;
            state.time = parseFloat(scrubber.value) || 0;
            renderAll();
        });
    }

    // Offscreen Pause via IntersectionObserver
    const vizSection = document.getElementById('visualization');
    if ('IntersectionObserver' in window && vizSection) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    state.inView = entry.isIntersecting;
                });
            },
            { threshold: 0.05 }
        );
        observer.observe(vizSection);
    }

    // Animation Loop
    function tick(ts) {
        if (state.playing && state.inView && (!viewOverview || viewOverview.classList.contains('active'))) {
            if (state.lastTs !== null) {
                const dt = Math.min((ts - state.lastTs) / 1000, 0.1);
                state.time += dt;
                if (state.time > DURATION) {
                    state.time = 0;
                }
                drawTaskViewport(state.time);
                updateTimelineUI(state.time);
                updateSchemaPreview(state.time);
            }
            state.lastTs = ts;
        } else {
            state.lastTs = null;
        }
        window.requestAnimationFrame(tick);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        drawTaskViewport(state.time);
    });

    // Init
    handleHash();
    resizeCanvas();
    renderAll();
    window.requestAnimationFrame(tick);
})();

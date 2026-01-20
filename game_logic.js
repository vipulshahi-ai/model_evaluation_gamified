class Game {
    constructor() {
        this.content = {
            "curriculum": [
                {
                    "id": "accuracy_paradox",
                    "title": "The Accuracy Paradox",
                    "subtitle": "Level 1: Binary Classification",
                    "narrative": "A 'Lazy Model' for Diabetes prediction always predicts 'Healthy'. It looks successful, but is it? Audit the model and find the truth.",
                    "challenge": "Calculate the Accuracy and then build a Confusion Matrix to see the Recall for sick patients.",
                    "patients": [
                        { "id": 1, "status": "Sick", "prediction": "Healthy" },
                        { "id": 2, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 3, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 4, "status": "Sick", "prediction": "Healthy" },
                        { "id": 5, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 6, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 7, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 8, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 9, "status": "Healthy", "prediction": "Healthy" },
                        { "id": 10, "status": "Healthy", "prediction": "Healthy" }
                    ],
                    "questions": [
                        {
                            "text": "What is the Accuracy of this model? (Total correct / Total patients)",
                            "answer": 0.8,
                            "feedback": "Correct! 8 out of 10 predictions were right. But notice something..."
                        }
                    ],
                    "badge": "Fairness Champion"
                },
                {
                    "id": "darts_game",
                    "title": "The Darts Game",
                    "subtitle": "Level 2: Regression Metrics",
                    "narrative": "Predict house prices! See how different ways of measuring error change your perception of performance.",
                    "challenge": "Move the dots to minimize the error. Watch MAE, MSE, and R-Squared update live.",
                    "data": [
                        { "x": 1, "actual": 200, "predicted": 150 },
                        { "x": 2, "actual": 300, "predicted": 280 },
                        { "x": 3, "actual": 400, "predicted": 420 },
                        { "x": 4, "actual": 500, "predicted": 480 },
                        { "x": 5, "actual": 900, "predicted": 600 }
                    ],
                    "badge": "Outlier Hunter"
                },
                {
                    "id": "archers_range",
                    "title": "The Archer’s Range",
                    "subtitle": "Level 3: Bias vs. Variance",
                    "narrative": "A model is like an archer. Too rigid and it misses the target (Bias). Too loose and it's all over the place (Variance).",
                    "challenge": "Find the 'Sweet Spot' by adjusting the Model Complexity slider.",
                    "badge": "Bias Buster"
                },
                {
                    "id": "rotation_policy",
                    "title": "The Rotation Policy",
                    "subtitle": "Level 4: K-Fold Cross-Validation",
                    "narrative": "Don't trust a single test split. Rotate the testing slice to ensure your model is truly robust.",
                    "challenge": "Simulate the rotation and observe the variance in scores across folds.",
                    "badge": "Validation Veteran"
                }
            ],
            "knowledge_gates": [
                {
                    "question": "If a model has 100% accuracy on training data but only 60% on test data, what is the problem?",
                    "options": ["High Bias (Underfitting)", "High Variance (Overfitting)", "Low Complexity"],
                    "answer": "High Variance (Overfitting)"
                },
                {
                    "question": "Which metric is most sensitive to outliers?",
                    "options": ["MAE", "MSE", "Accuracy"],
                    "answer": "MSE"
                }
            ]
        };
        this.currentLevel = null;
        this.score = 0;
        this.badges = [];
        this.unlockedLevels = ['accuracy_paradox'];

        this.init();
    }

    init() {
        this.renderBadges();
        this.loadLevel('accuracy_paradox');
        this.initTouchSupport();
    }

    renderBadges() {
        const container = document.getElementById('badges-container');
        container.innerHTML = this.content.curriculum.map(level => `
            <div class="badge-item ${this.badges.includes(level.badge) ? 'unlocked' : ''}" id="badge-${level.id}">
                <div class="badge-icon"><i class="fas fa-medal"></i></div>
                <div>
                    <p class="text-xs font-bold text-white">${level.badge}</p>
                    <p class="text-[10px] text-slate-400">${level.title}</p>
                </div>
            </div>
        `).join('');
    }

    loadLevel(levelId) {
        const level = this.content.curriculum.find(l => l.id === levelId);
        this.currentLevel = level;

        // Update Sidebar UI
        document.querySelectorAll('.level-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.level === levelId) item.classList.add('active');
        });

        // Update Header
        document.getElementById('level-title').innerText = level.title;
        document.getElementById('level-subtitle').innerText = level.subtitle;

        // Render Game Area
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML = '';

        const narrative = document.createElement('div');
        narrative.className = 'card bg-slate-800/50 border-l-4 border-sky-400';
        narrative.innerHTML = `
            <p class="text-sky-400 font-bold text-sm mb-1 uppercase">Mission Briefing</p>
            <p class="text-slate-200">${level.narrative}</p>
        `;
        gameArea.appendChild(narrative);

        // Level Specific Rendering
        switch (levelId) {
            case 'accuracy_paradox': this.renderAccuracyParadox(); break;
            case 'darts_game': this.renderDartsGame(); break;
            case 'archers_range': this.renderArchersRange(); break;
            case 'rotation_policy': this.renderRotationPolicy(); break;
        }
    }

    // --- LEVEL 1: ACCURACY PARADOX ---
    renderAccuracyParadox() {
        const gameArea = document.getElementById('game-area');
        const container = document.createElement('div');
        container.className = 'space-y-8';
        container.innerHTML = `
            <div class="grid md:grid-cols-2 gap-8">
                <div class="card bg-slate-800">
                    <h3 class="font-bold mb-4">Patient Database (Model Inspector)</h3>
                    <p class="text-sm text-slate-400 mb-4">Drag patient records into the correct confusion matrix quadrants based on their Actual Status and Model Prediction.</p>
                    <div id="patients-pool" class="flex flex-wrap gap-2 p-4 bg-slate-900 rounded-lg min-h-[200px]">
                        ${this.currentLevel.patients.map(p => `
                            <div class="patient-card flex flex-col items-center justify-center text-center p-2 min-w-[100px]" draggable="true" ondragstart="game.handleDragStart(event)" id="patient-${p.id}" data-status="${p.status}" data-pred="${p.prediction}">
                                <span class="font-bold text-xs uppercase opacity-60">P#${p.id}</span>
                                <span class="text-xs font-bold">${p.status}</span>
                                <div class="mt-1 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500">
                                    Pred: ${p.prediction}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="card bg-slate-800">
                    <h3 class="font-bold mb-4 text-center">Confusion Matrix</h3>
                    <div class="matrix-grid">
                        <div></div>
                        <div class="text-center font-bold text-[10px] uppercase text-slate-500">Predicted:<br>Healthy</div>
                        <div class="text-center font-bold text-[10px] uppercase text-slate-500">Predicted:<br>Sick</div>
                        
                        <div class="flex items-center text-[10px] font-bold uppercase text-slate-500 leading-tight">Actual:<br>Healthy</div>
                        <div class="drop-zone" id="TN" ondragover="game.handleDragOver(event)" ondrop="game.handleDrop(event)">
                            <div class="text-[9px] font-bold text-slate-500 absolute top-2 left-2 z-10">TRUE NEGATIVE (TN)</div>
                        </div>
                        <div class="drop-zone" id="FP" ondragover="game.handleDragOver(event)" ondrop="game.handleDrop(event)">
                            <div class="text-[9px] font-bold text-slate-500 absolute top-2 left-2 z-10">FALSE POSITIVE (FP)</div>
                        </div>

                        <div class="flex items-center text-[10px] font-bold uppercase text-slate-500 leading-tight">Actual:<br>Sick</div>
                        <div class="drop-zone" id="FN" ondragover="game.handleDragOver(event)" ondrop="game.handleDrop(event)">
                            <div class="text-[9px] font-bold text-slate-500 absolute top-2 left-2 z-10">FALSE NEGATIVE (FN)</div>
                        </div>
                        <div class="drop-zone" id="TP" ondragover="game.handleDragOver(event)" ondrop="game.handleDrop(event)">
                            <div class="text-[9px] font-bold text-slate-500 absolute top-2 left-2 z-10">TRUE POSITIVE (TP)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card bg-slate-800 text-center">
                <h3 class="font-bold mb-6">Final Audit Calculations</h3>
                <div class="flex flex-wrap justify-center gap-8">
                    <div>
                        <p class="text-sm text-slate-400 mb-2">Calculated Accuracy</p>
                        <div class="flex items-center gap-2">
                            <input type="number" step="0.01" id="acc-input" class="text-center" placeholder="0.00">
                            <button class="btn-primary" onclick="game.checkAccuracy()">Verify</button>
                        </div>
                    </div>
                    <div>
                        <p class="text-sm text-slate-400 mb-2">Calculated Recall (for Sick)</p>
                        <div class="flex items-center gap-2">
                            <input type="number" step="0.01" id="rec-input" class="text-center" placeholder="0.00">
                            <button class="btn-primary" onclick="game.checkRecall()">Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gameArea.appendChild(container);
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const patientId = e.dataTransfer ? e.dataTransfer.getData('text') : this.touchState.patientId;
        const patient = document.getElementById(patientId);
        if (!patient) return;

        e.currentTarget.appendChild(patient);
        this.validateMatrix();
    }

    // --- MOBILE TOUCH SUPPORT ---
    initTouchSupport() {
        this.touchState = { patientId: null, targetZone: null };

        document.addEventListener('touchstart', (e) => {
            const patient = e.target.closest('.patient-card');
            if (patient) {
                this.touchState.patientId = patient.id;
                patient.style.opacity = '0.5';
                patient.style.zIndex = '1000';
            }
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!this.touchState.patientId) return;
            e.preventDefault(); // Prevent scrolling while dragging

            const touch = e.touches[0];
            const patient = document.getElementById(this.touchState.patientId);

            // Move the element with the touch
            patient.style.position = 'fixed';
            patient.style.left = (touch.clientX - patient.offsetWidth / 2) + 'px';
            patient.style.top = (touch.clientY - patient.offsetHeight / 2) + 'px';

            // Find potential drop zone
            const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
            const zone = elements.find(el => el.classList.contains('drop-zone'));

            document.querySelectorAll('.drop-zone').forEach(dz => dz.classList.remove('drag-over'));
            if (zone) {
                zone.classList.add('drag-over');
                this.touchState.targetZone = zone;
            } else {
                this.touchState.targetZone = null;
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (!this.touchState.patientId) return;

            const patient = document.getElementById(this.touchState.patientId);
            patient.style.opacity = '1';
            patient.style.position = 'static';
            patient.style.zIndex = '';

            if (this.touchState.targetZone) {
                this.touchState.targetZone.appendChild(patient);
                this.touchState.targetZone.classList.remove('drag-over');
                this.validateMatrix();
            }

            this.touchState.patientId = null;
            this.touchState.targetZone = null;
        });
    }

    validateMatrix() {
        const mapping = {
            'Healthy-Healthy': 'TN',
            'Healthy-Sick': 'FP',
            'Sick-Healthy': 'FN',
            'Sick-Sick': 'TP'
        };

        let correct = 0;
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const children = zone.querySelectorAll('.patient-card');
            children.forEach(p => {
                const status = p.dataset.status;
                const pred = p.dataset.pred;
                if (mapping[`${status}-${pred}`] === zone.id) {
                    p.style.borderColor = 'var(--pass-green)';
                    correct++;
                } else {
                    p.style.borderColor = 'var(--fail-orange)';
                }
                p.style.borderWidth = '2px';
            });
        });
    }

    checkAccuracy() {
        const val = parseFloat(document.getElementById('acc-input').value);
        if (val === 0.8) {
            alert("Correct! Accuracy = 8/10 = 80%. Seems high, right?");
            this.addScore(50);
        } else {
            alert("Try again. (Correct Predictions / Total)");
        }
    }

    checkRecall() {
        const val = parseFloat(document.getElementById('rec-input').value);
        if (val === 0) {
            alert("Exactly! Recall is 0%. The model caught ZERO sick patients despite 80% accuracy. This is the Accuracy Paradox!");
            this.unlockBadge('accuracy_paradox');
            this.addScore(100);
            this.showGate(0);
        } else {
            alert("Look at the True Positives (TP) for Sick patients. Recall = TP / (TP + FN)");
        }
    }

    // --- LEVEL 2: THE DARTS GAME ---
    renderDartsGame() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML += `
            <div class="grid md:grid-cols-3 gap-8">
                <div class="col-span-2 card bg-slate-800">
                    <canvas id="regressionChart" height="200"></canvas>
                    <p class="text-xs text-slate-400 mt-4 italic">Drag the predicted points (yellow) to match the actual house prices (blue) as closely as possible.</p>
                </div>
                <div class="space-y-4">
                    <div class="metric-box">
                        <div class="metric-label">MAE (Mean Absolute Error)</div>
                        <div id="mae-val" class="metric-value">0.0</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">MSE (Mean Squared Error)</div>
                        <div id="mse-val" class="metric-value">0.0</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">RMSE</div>
                        <div id="rmse-val" class="metric-value">0.0</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">R² Score (Fitness)</div>
                        <div id="r2-val" class="metric-value">0.0</div>
                        <div class="w-full bg-slate-700 h-2 rounded-full mt-2">
                            <div id="r2-bar" class="bg-sky-400 h-full rounded-full" style="width: 0%"></div>
                        </div>
                    </div>
                    <button class="btn-primary w-full" onclick="game.completeLevel2()">Submit Audit</button>
                </div>
            </div>
        `;

        this.initRegressionChart();
    }

    initRegressionChart() {
        const ctx = document.getElementById('regressionChart').getContext('2d');
        const data = this.currentLevel.data;

        this.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Actual Prices',
                        data: data.map(d => ({ x: d.x, y: d.actual })),
                        backgroundColor: '#38bdf8',
                        pointRadius: 8
                    },
                    {
                        label: 'Your Predictions',
                        data: data.map(d => ({ x: d.x, y: d.predicted })),
                        backgroundColor: '#fbbf24',
                        pointRadius: 10,
                        pointHitRadius: 25, // Larger area for touch
                        dragData: true
                    }
                ]
            },
            options: {
                responsive: true,
                onHover: (e) => {
                    const points = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (points.length) e.native.target.style.cursor = 'ns-resize';
                    else e.native.target.style.cursor = 'default';
                },
                onClick: (e) => {
                    const points = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (points.length && points[0].datasetIndex === 1) {
                        const index = points[0].index;
                        const value = this.chart.scales.y.getPixelForValue(e.y); // This logic needs fix for actual click-to-move
                        // Simple approach: toggle or cycle for now or handle mousemove
                    }
                },
                scales: {
                    y: { beginAtZero: true, max: 1000 },
                    x: { type: 'linear', position: 'bottom', max: 6 }
                },
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                }
            }
        });

        // Add custom drag simulation since standard Chart.js doesn't do draggable points natively well
        let dragging = false;
        let dragIndex = -1;

        ctx.canvas.addEventListener('mousedown', (e) => {
            const points = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
            if (points.length && points[0].datasetIndex === 1) {
                dragging = true;
                dragIndex = points[0].index;
            }
        });

        ctx.canvas.addEventListener('mousemove', (e) => {
            if (dragging) {
                const yValue = this.chart.scales.y.getValueForPixel(e.offsetY);
                this.chart.data.datasets[1].data[dragIndex].y = Math.round(yValue);
                this.chart.update('none');
                this.calculateRegressionMetrics();
            }
        });

        ctx.canvas.addEventListener('mouseup', () => {
            dragging = false;
        });

        // Touch handlers for chart
        ctx.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = ctx.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            // Detection on touch needs to be more lenient (intersect: false)
            const points = this.chart.getElementsAtEventForMode({ x, y }, 'nearest', { intersect: false }, true);
            if (points.length && points[0].datasetIndex === 1) {
                dragging = true;
                dragIndex = points[0].index;
                if (e.cancelable) e.preventDefault();
            }
        }, { passive: false });

        ctx.canvas.addEventListener('touchmove', (e) => {
            if (dragging) {
                const touch = e.touches[0];
                const rect = ctx.canvas.getBoundingClientRect();
                const yValue = this.chart.scales.y.getValueForPixel(touch.clientY - rect.top);
                this.chart.data.datasets[1].data[dragIndex].y = Math.round(yValue);
                this.chart.update('none');
                this.calculateRegressionMetrics();
                if (e.cancelable) e.preventDefault();
            }
        }, { passive: false });

        ctx.canvas.addEventListener('touchend', () => {
            dragging = false;
        });

        this.calculateRegressionMetrics();
    }

    calculateRegressionMetrics() {
        const actuals = this.chart.data.datasets[0].data.map(d => d.y);
        const preds = this.chart.data.datasets[1].data.map(d => d.y);
        const n = actuals.length;

        let sumAbsErr = 0;
        let sumSqErr = 0;
        actuals.forEach((a, i) => {
            sumAbsErr += Math.abs(a - preds[i]);
            sumSqErr += Math.pow(a - preds[i], 2);
        });

        const mae = sumAbsErr / n;
        const mse = sumSqErr / n;
        const rmse = Math.sqrt(mse);

        // R2 = 1 - (SSres / SStot)
        const meanActual = actuals.reduce((a, b) => a + b, 0) / n;
        let ssTot = 0;
        actuals.forEach(a => ssTot += Math.pow(a - meanActual, 2));
        const r2 = 1 - (sumSqErr / ssTot);

        document.getElementById('mae-val').innerText = mae.toFixed(1);
        document.getElementById('mse-val').innerText = Math.round(mse);
        document.getElementById('rmse-val').innerText = rmse.toFixed(1);
        const displayR2 = Math.max(0, r2).toFixed(2);
        document.getElementById('r2-val').innerText = displayR2;
        document.getElementById('r2-bar').style.width = (displayR2 * 100) + '%';
    }

    completeLevel2() {
        const r2 = parseFloat(document.getElementById('r2-val').innerText);
        if (r2 > 0.9) {
            alert("Excellent! You've matched the prices almost perfectly.");
            this.unlockBadge('darts_game');
            this.addScore(150);
            this.showGate(1);
        } else {
            alert("The R2 Score is too low. Move the yellow dots closer to the blue dots!");
        }
    }

    // --- LEVEL 3: ARCHER'S RANGE ---
    renderArchersRange() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML += `
            <div class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="card bg-slate-800 flex flex-col items-center">
                        <p class="text-xs font-bold text-sky-400 mb-2 uppercase tracking-widest">Training Data (Known)</p>
                        <canvas id="knownCanvas" width="300" height="300" class="bg-slate-900 rounded-full border-4 border-slate-700"></canvas>
                        <p class="text-[10px] text-slate-400 mt-2">Performance on data the model has already seen.</p>
                    </div>
                    <div class="card bg-slate-800 flex flex-col items-center">
                        <p class="text-xs font-bold text-orange-400 mb-2 uppercase tracking-widest">Test Data (Unknown)</p>
                        <canvas id="unknownCanvas" width="300" height="300" class="bg-slate-900 rounded-full border-4 border-slate-700"></canvas>
                        <p class="text-[10px] text-slate-400 mt-2">Performance on new, unseen data.</p>
                    </div>
                </div>

                <div class="card bg-slate-800 space-y-8">
                    <div>
                        <h3 class="font-bold mb-2">Model Complexity Slider</h3>
                        <input type="range" id="complexity-slider" min="0" max="100" value="10" 
                            class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer custom-slider"
                            oninput="game.updateArcherRange()">
                        <div class="flex justify-between text-xs text-slate-400 mt-2">
                            <span>Simple (Linear)</span>
                            <span>Optimal</span>
                            <span>Complex (Polynomial)</span>
                        </div>
                    </div>
                    
                    <div id="archer-feedback" class="p-4 rounded-lg bg-slate-900">
                        <p id="complexity-label" class="font-bold text-sky-400">Low Complexity</p>
                        <p id="complexity-desc" class="text-sm text-slate-400">The model is underfitting. It's consistent but consistently wrong (High Bias).</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="metric-box">
                            <div class="metric-label">Bias (Avg Error)</div>
                            <div id="bias-indicator" class="font-bold text-orange-400 uppercase">High</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-label">Variance (Consistency)</div>
                            <div id="variance-indicator" class="font-bold text-green-400 uppercase">Low</div>
                        </div>
                    </div>
                    
                    <button class="btn-primary w-full" onclick="game.checkSweetSpot()">Verify Sweet Spot</button>
                </div>
            </div>
        `;
        this.updateArcherRange();
    }

    updateArcherRange() {
        const slider = document.getElementById('complexity-slider');
        const val = parseInt(slider.value);
        const knownCanvas = document.getElementById('knownCanvas');
        const unknownCanvas = document.getElementById('unknownCanvas');

        const drawTarget = (canvas, bias, variance, isOverfitting) => {
            const ctx = canvas.getContext('2d');
            const center = canvas.width / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Target Rings
            const colors = ['#f8fafc', '#1e293b', '#38bdf8', '#ef4444', '#fbbf24'];
            const radii = [140, 110, 80, 50, 15];
            radii.forEach((r, i) => {
                ctx.beginPath();
                ctx.arc(center, center, r, 0, Math.PI * 2);
                ctx.fillStyle = colors[i];
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.stroke();
            });

            // Draw Arrows
            for (let i = 0; i < 15; i++) {
                const offsetX = bias + (Math.random() - 0.5) * variance;
                const offsetY = bias + (Math.random() - 0.5) * variance;

                ctx.beginPath();
                ctx.arc(center + offsetX, center + offsetY, 4, 0, Math.PI * 2);
                ctx.fillStyle = isOverfitting ? '#f43f5e' : '#f8fafc';
                ctx.fill();
                ctx.strokeStyle = '#020617';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        };

        let label, desc, biasIndicator, varIndicator;
        let k_bias, k_var, u_bias, u_var, isOverfitting = false;

        if (val < 30) {
            // Low Complexity: Both bad (Bias)
            k_bias = u_bias = 60;
            k_var = u_var = 15;
            label = "High Bias (Underfitting)";
            desc = "The model is too simple. It performs poorly on both training (Known) and test (Unknown) data.";
            biasIndicator = 'High';
            varIndicator = 'Low';
        } else if (val > 70) {
            // High Complexity: Known is perfect, Unknown is scattered (Variance)
            k_bias = 0; k_var = 5;
            u_bias = 10; u_var = 120;
            isOverfitting = true;
            label = "High Variance (Overfitting)";
            desc = "The model has 'memorized' the training data (Perfect Bullseye) but fails on new data because it's chasing noise.";
            biasIndicator = 'Low';
            varIndicator = 'High';
        } else {
            // Sweet Spot: Both good
            k_bias = u_bias = 10;
            k_var = u_var = 25;
            label = "The Sweet Spot!";
            desc = "The model balance is perfect. It generalizes well to both known and unknown data.";
            biasIndicator = 'Low';
            varIndicator = 'Low';
        }

        drawTarget(knownCanvas, k_bias, k_var, false);
        drawTarget(unknownCanvas, u_bias, u_var, isOverfitting);

        document.getElementById('complexity-label').innerText = label;
        document.getElementById('complexity-desc').innerText = desc;
        document.getElementById('bias-indicator').innerText = biasIndicator;
        document.getElementById('bias-indicator').style.color = biasIndicator === 'Low' ? 'var(--pass-green)' : 'var(--fail-orange)';
        document.getElementById('variance-indicator').innerText = varIndicator;
        document.getElementById('variance-indicator').style.color = varIndicator === 'Low' ? 'var(--pass-green)' : 'var(--fail-orange)';
    }

    checkSweetSpot() {
        const val = parseInt(document.getElementById('complexity-slider').value);
        if (val >= 40 && val <= 60) {
            alert("Bullseye! You found the optimal trade-off.");
            this.unlockBadge('archers_range');
            this.addScore(200);
        } else {
            alert("Keep searching for the balance where both Bias and Variance are low.");
        }
    }

    // --- LEVEL 4: ROTATION POLICY ---
    renderRotationPolicy() {
        const gameArea = document.getElementById('game-area');
        gameArea.innerHTML += `
            <div class="card bg-slate-800">
                <div class="flex justify-between items-center mb-8">
                    <h3 class="font-bold">K-Fold Cross-Validation Visualizer</h3>
                    <button class="btn-primary" onclick="game.startKFoldAnimation()">Run Rotation</button>
                </div>
                
                <div id="kfold-container" class="space-y-4">
                    <!-- Folds will be rendered here -->
                </div>

                <div class="grid grid-cols-3 gap-8 mt-12">
                    <div class="metric-box">
                        <div class="metric-label">Current Fold Score</div>
                        <div id="fold-score" class="metric-value">0%</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Average Score (Real Accuracy)</div>
                        <div id="avg-score" class="metric-value">0%</div>
                    </div>
                    <div class="metric-box">
                        <div class="metric-label">Standard Deviation</div>
                        <div id="std-score" class="metric-value">0.0</div>
                    </div>
                </div>
            </div>
        `;

        this.initKFolds();
    }

    initKFolds() {
        const container = document.getElementById('kfold-container');
        container.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const foldRow = document.createElement('div');
            foldRow.className = 'flex gap-2 items-center';
            foldRow.innerHTML = `
                <div class="text-xs font-bold w-12">Fold ${i + 1}</div>
                <div class="flex-1 flex gap-1">
                    ${Array(10).fill(0).map((_, j) => `<div class="h-8 flex-1 rounded bg-slate-700 transition-colors duration-500 kfold-block" data-fold="${i}" data-index="${j}"></div>`).join('')}
                </div>
                <div class="text-xs font-mono w-16 text-right fold-result" id="fold-res-${i}">--</div>
            `;
            container.appendChild(foldRow);
        }
    }

    async startKFoldAnimation() {
        const scores = [82, 78, 85, 81, 79];
        const blocks = document.querySelectorAll('.kfold-block');
        const resContainers = document.querySelectorAll('.fold-result');

        for (let i = 0; i < 5; i++) {
            // Reset all
            blocks.forEach(b => b.className = 'h-8 flex-1 rounded bg-sky-600 transition-colors duration-500');
            // Shift test fold
            blocks.forEach(b => {
                const foldIdx = Math.floor(parseInt(b.dataset.index) / 2);
                if (foldIdx === i) {
                    b.classList.remove('bg-sky-600');
                    b.classList.add('bg-orange-400');
                }
            });

            document.getElementById('fold-score').innerText = scores[i] + '%';
            resContainers[i].innerText = scores[i] + '%';
            resContainers[i].classList.add('text-sky-400');

            await new Promise(r => setTimeout(r, 1000));
        }

        const avg = scores.reduce((a, b) => a + b, 0) / 5;
        document.getElementById('avg-score').innerText = avg.toFixed(1) + '%';
        document.getElementById('std-score').innerText = '2.4%';

        this.unlockBadge('rotation_policy');
        this.addScore(250);
        alert("Rotation Complete! Notice how the average score is more representative than any single fold.");
    }

    // --- SHARED UTILS ---
    addScore(pts) {
        this.score += pts;
        document.getElementById('total-score').innerText = this.score;
        document.getElementById('total-score').classList.add('pass-animation');
        setTimeout(() => document.getElementById('total-score').classList.remove('pass-animation'), 500);
    }

    unlockBadge(levelId) {
        const level = this.content.curriculum.find(l => l.id === levelId);
        if (!this.badges.includes(level.badge)) {
            this.badges.push(level.badge);
            this.renderBadges();
            const badgeEl = document.getElementById(`badge-${levelId}`);
            badgeEl.classList.add('unlocked', 'pass-animation');
        }
    }

    showGate(index) {
        const gate = document.getElementById('knowledge-gate');
        const data = this.content.knowledge_gates[index];
        document.getElementById('gate-question').innerText = data.question;
        const optionsContainer = document.getElementById('gate-options');
        optionsContainer.innerHTML = data.options.map(opt => `
            <button class="bg-slate-700 hover:bg-slate-600 p-3 rounded text-sm transition" onclick="game.checkGateAnswer('${opt}', '${data.answer}')">${opt}</button>
        `).join('');
        gate.style.display = 'flex';
    }

    checkGateAnswer(selected, correct) {
        const feedback = document.getElementById('gate-feedback');
        feedback.classList.remove('hidden');
        if (selected === correct) {
            feedback.innerText = "Correct! You've mastered this concept.";
            feedback.style.color = 'var(--pass-green)';
            this.addScore(50);
            setTimeout(() => {
                document.getElementById('knowledge-gate').style.display = 'none';
                feedback.classList.add('hidden');
            }, 1500);
        } else {
            feedback.innerText = "Wrong. Think again!";
            feedback.style.color = 'var(--fail-orange)';
        }
    }
}

const game = new Game();

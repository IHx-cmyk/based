export const dashboardHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZAILEYS - Bot Control Panel</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        :root {
            --bg-color: #060911;
            --card-bg: rgba(13, 19, 33, 0.65);
            --card-border: rgba(255, 255, 255, 0.05);
            --text-primary: #f3f4f6;
            --text-secondary: #9ca3af;
            
            /* Varied Accents */
            --accent-cyan: #06b6d4;
            --accent-emerald: #10b981;
            --accent-blue: #3b82f6;
            --accent-amber: #f59e0b;
            --accent-coral: #f43f5e;
            
            --success-color: #10b981;
            --error-color: #ef4444;
            --warning-color: #f59e0b;
            --font-family: 'Outfit', sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-color);
            background-image: 
                radial-gradient(at 5% 5%, rgba(6, 182, 212, 0.12) 0px, transparent 40%),
                radial-gradient(at 95% 95%, rgba(16, 185, 129, 0.1) 0px, transparent 40%),
                radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.05) 0px, transparent 60%);
            background-attachment: fixed;
            color: var(--text-primary);
            font-family: var(--font-family);
            min-height: 100vh;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
            border-left: 4px solid var(--accent-cyan);
        }

        .logo-container {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .logo-text h1 {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-emerald) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 1px;
        }

        .logo-text p {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .connection-status {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(0, 0, 0, 0.25);
            padding: 0.5rem 1rem;
            border-radius: 99px;
            border: 1px solid var(--card-border);
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--text-secondary);
        }

        .status-dot.connected {
            background-color: var(--success-color);
            box-shadow: 0 0 10px var(--success-color);
            animation: pulse 2s infinite;
        }

        .status-dot.connecting {
            background-color: var(--warning-color);
            box-shadow: 0 0 10px var(--warning-color);
            animation: pulse 1.5s infinite;
        }

        .status-dot.disconnected {
            background-color: var(--error-color);
            box-shadow: 0 0 10px var(--error-color);
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
        }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .card:hover {
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.12);
        }

        .card-ping { border-top: 4px solid var(--accent-cyan); }
        .card-ram { border-top: 4px solid var(--accent-emerald); }
        .card-uptime { border-top: 4px solid var(--accent-amber); }
        .card-db { border-top: 4px solid var(--accent-blue); }

        .card-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }

        .card-title {
            font-size: 0.9rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }

        .card-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .card-ping .card-icon { color: var(--accent-cyan); }
        .card-ram .card-icon { color: var(--accent-emerald); }
        .card-uptime .card-icon { color: var(--accent-amber); }
        .card-db .card-icon { color: var(--accent-blue); }

        .card-value {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .card-desc {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 99px;
            overflow: hidden;
            margin-top: 0.75rem;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-emerald) 0%, var(--accent-cyan) 100%);
            border-radius: 99px;
            width: 0%;
            transition: width 0.5s ease-out;
        }

        .main-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
        }

        @media (max-width: 900px) {
            .main-content {
                grid-template-columns: 1fr;
            }
        }

        .chart-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-left: 4px solid var(--accent-blue);
        }

        .chart-container {
            position: relative;
            height: 280px;
            width: 100%;
        }

        .table-card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            border-left: 4px solid var(--accent-amber);
        }

        .title-container-flex {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-primary);
        }

        .title-icon {
            display: flex;
            align-items: center;
            color: var(--text-secondary);
        }

        .chart-card .title-icon { color: var(--accent-blue); }
        .table-card .title-icon { color: var(--accent-amber); }

        .table-container {
            overflow-y: auto;
            max-height: 280px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }

        th, td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--card-border);
            font-size: 0.9rem;
        }

        th {
            color: var(--text-secondary);
            font-weight: 500;
            position: sticky;
            top: 0;
            background: #0d1321;
        }

        td {
            color: var(--text-primary);
        }

        .badge {
            display: inline-block;
            padding: 0.25rem 0.6rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .badge-1 {
            background: rgba(245, 158, 11, 0.15);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .badge-2 {
            background: rgba(6, 182, 212, 0.15);
            color: #22d3ee;
            border: 1px solid rgba(6, 182, 212, 0.3);
        }

        .badge-3 {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-other {
            background: rgba(255, 255, 255, 0.08);
            color: #e5e7eb;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .maintenance-section {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 1.5rem;
            backdrop-filter: blur(12px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            border-left: 4px solid var(--accent-coral);
        }

        .maintenance-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .maintenance-text h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .maintenance-text p {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .btn-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }

        .btn {
            font-family: var(--font-family);
            font-size: 0.9rem;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: white;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%);
            box-shadow: 0 4px 14px rgba(6, 182, 212, 0.3);
        }

        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(6, 182, 212, 0.4);
        }

        .btn-danger {
            background: linear-gradient(135deg, var(--accent-coral) 0%, #ef4444 100%);
            box-shadow: 0 4px 14px rgba(244, 63, 94, 0.3);
        }

        .btn-danger:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(244, 63, 94, 0.4);
        }

        .no-data-msg {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
            color: var(--text-secondary);
            font-style: italic;
        }
    </style>
</head>
<body>

    <header>
        <div class="logo-container">
            <!-- Bot Logo SVG (Server Stack/Message hybrid) -->
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#06b6d4" />
                        <stop offset="100%" stop-color="#10b981" />
                    </linearGradient>
                </defs>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <div class="logo-text">
                <h1>ZAILEYS PANEL</h1>
                <p>Dashboard Monitoring & Pengendalian Bot WhatsApp</p>
            </div>
        </div>
        <div class="connection-status">
            <div id="statusDot" class="status-dot disconnected"></div>
            <span id="statusText">Memuat...</span>
        </div>
    </header>

    <!-- Top Stats Row -->
    <div class="dashboard-grid">
        <!-- Ping Card -->
        <div class="card card-ping">
            <div class="card-header-flex">
                <span class="card-title">Ping / Latensi</span>
                <span class="card-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </span>
            </div>
            <div id="latencyVal" class="card-value">-- ms</div>
            <div class="card-desc" id="latencyDesc">Memeriksa koneksi...</div>
        </div>
        
        <!-- RAM Card -->
        <div class="card card-ram">
            <div class="card-header-flex">
                <span class="card-title">Penggunaan RAM</span>
                <span class="card-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
                </span>
            </div>
            <div id="ramVal" class="card-value">-- / -- MB</div>
            <div id="ramDesc" class="card-desc">--% Terpakai</div>
            <div class="progress-bar">
                <div id="ramProgress" class="progress-fill" style="width: 0%"></div>
            </div>
        </div>

        <!-- Uptime Card -->
        <div class="card card-uptime">
            <div class="card-header-flex">
                <span class="card-title">Uptime Sistem</span>
                <span class="card-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </span>
            </div>
            <div id="uptimeVal" class="card-value">--d --h --m</div>
            <div class="card-desc" id="systemPlatform">Memuat platform...</div>
        </div>

        <!-- Database Card -->
        <div class="card card-db">
            <div class="card-header-flex">
                <span class="card-title">Total Database</span>
                <span class="card-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
                </span>
            </div>
            <div id="dbVal" class="card-value">-- Chats</div>
            <div id="dbDesc" class="card-desc">-- Grup Terdeteksi</div>
        </div>
    </div>

    <!-- Main Content (Charts and Tables) -->
    <div class="main-content">
        <!-- Message Activity Chart -->
        <div class="card chart-card">
            <div class="title-container-flex">
                <span class="title-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                </span>
                <span class="card-title">Aktivitas Chat (7 Hari Terakhir)</span>
            </div>
            <div class="chart-container" id="lineChartContainer">
                <canvas id="lineChart"></canvas>
            </div>
        </div>

        <!-- Top Users Table -->
        <div class="card table-card">
            <div class="title-container-flex">
                <span class="title-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </span>
                <span class="card-title">User Paling Aktif</span>
            </div>
            <div class="table-container">
                <table id="topUsersTable">
                    <thead>
                        <tr>
                            <th>Pengguna</th>
                            <th>Jumlah Chat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="2" style="text-align: center; color: var(--text-secondary);">Memuat...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="main-content" style="margin-top: -0.5rem;">
        <!-- Top Groups Table -->
        <div class="card table-card" style="grid-column: span 2; border-left: 4px solid var(--accent-emerald);">
            <div class="title-container-flex">
                <span class="title-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6" y2="6.01"></line><line x1="6" y1="18" x2="6" y2="18.01"></line></svg>
                </span>
                <span class="card-title">Grup Paling Aktif</span>
            </div>
            <div class="table-container">
                <table id="topGroupsTable">
                    <thead>
                        <tr>
                            <th>Nama Grup</th>
                            <th>Jumlah Chat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="2" style="text-align: center; color: var(--text-secondary);">Memuat...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Maintenance / Clean Actions -->
    <div class="maintenance-section">
        <div class="maintenance-info">
            <span style="color: var(--accent-coral);">
                <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </span>
            <div class="maintenance-text">
                <h3>Pemeliharaan & Pembersihan Bot</h3>
                <p>Bersihkan cache database pesan atau lakukan reset sesi masuk WhatsApp agar bot tetap ringan.</p>
            </div>
        </div>
        <div class="btn-group">
            <button onclick="clearCache()" class="btn btn-primary">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3L6 15"></path><path d="M9 12l-4 4"></path><path d="M12 9l-4 4"></path><path d="M15 6l-4 4"></path><path d="M5 21h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2z"></path></svg>
                <span>Bersihkan Cache Pesan</span>
            </button>
            <button onclick="resetSession()" class="btn btn-danger">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                <span>Reset Sesi & Logout</span>
            </button>
        </div>
    </div>

    <script>
        let lineChart = null;

        // Fetch data initially and periodically
        async function fetchStats() {
            try {
                const startFetch = Date.now();
                const res = await fetch('/api/stats');
                const data = await res.json();
                const pingTime = Date.now() - startFetch;

                // 1. Connection Status
                const dot = document.getElementById('statusDot');
                const text = document.getElementById('statusText');
                dot.className = 'status-dot ' + data.connection.state;
                
                let meName = data.connection.me ? (data.connection.me.name || data.connection.me.id.split('@')[0]) : '';
                text.innerText = data.connection.state === 'connected' 
                    ? 'Connected (' + meName + ')' 
                    : data.connection.state.charAt(0).toUpperCase() + data.connection.state.slice(1);

                // 2. Latency/Ping
                document.getElementById('latencyVal').innerText = pingTime + ' ms';
                document.getElementById('latencyDesc').innerText = pingTime < 100 ? 'Fast connection' : (pingTime < 250 ? 'Stable' : 'Slow');

                // 3. RAM Info
                const ramUsed = (data.system.usedMemory / 1024 / 1024).toFixed(0);
                const ramTotal = (data.system.totalMemory / 1024 / 1024).toFixed(0);
                document.getElementById('ramVal').innerText = ramUsed + ' / ' + ramTotal + ' MB';
                document.getElementById('ramDesc').innerText = data.system.memoryPercentage + '% Terpakai';
                document.getElementById('ramProgress').style.width = data.system.memoryPercentage + '%';

                // 4. Uptime
                const uptimeDays = Math.floor(data.system.uptime / (3600 * 24));
                const uptimeHours = Math.floor((data.system.uptime % (3600 * 24)) / 3600);
                const uptimeMins = Math.floor((data.system.uptime % 3600) / 60);
                document.getElementById('uptimeVal').innerText = uptimeDays + 'd ' + uptimeHours + 'h ' + uptimeMins + 'm';
                document.getElementById('systemPlatform').innerText = data.system.os.toUpperCase() + ' • Node ' + data.system.nodeVersion;

                // 5. DB Stats
                document.getElementById('dbVal').innerText = data.db.chats + ' Chats';
                document.getElementById('dbDesc').innerText = data.db.groups + ' Grup • ' + data.db.contacts + ' Kontak';

                // 6. Draw Line Chart
                updateLineChart(data.stats.daily);

                // 7. Update Tables
                updateTables(data.stats.users, data.stats.groups);

            } catch (err) {
                console.error("Gagal mengambil statistik:", err);
                document.getElementById('statusText').innerText = "Koneksi Putus";
                document.getElementById('statusDot').className = 'status-dot disconnected';
            }
        }

        function updateLineChart(dailyData) {
            const ctx = document.getElementById('lineChart').getContext('2d');
            const dates = Object.keys(dailyData || {}).sort();
            const counts = dates.map(d => dailyData[d]);

            if (dates.length === 0) {
                document.getElementById('lineChartContainer').innerHTML = '<div class="no-data-msg">Belum ada aktivitas chat yang terekam</div>';
                return;
            }

            if (lineChart) {
                lineChart.data.labels = dates;
                lineChart.data.datasets[0].data = counts;
                lineChart.update();
            } else {
                // Create gradient for line chart background
                const gradient = ctx.createLinearGradient(0, 0, 0, 280);
                gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
                gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

                lineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Jumlah Pesan',
                            data: counts,
                            borderColor: '#06b6d4',
                            backgroundColor: gradient,
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#9ca3af' }
                            },
                            y: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#9ca3af', precision: 0 }
                            }
                        }
                    }
                });
            }
        }

        function updateTables(users, groups) {
            // Update Users
            const userTableBody = document.querySelector('#topUsersTable tbody');
            const sortedUsers = Object.entries(users || {})
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5);

            if (sortedUsers.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">Tidak ada data pengguna</td></tr>';
            } else {
                userTableBody.innerHTML = sortedUsers.map(([jid, info], index) => {
                    const badgeClass = index === 0 ? 'badge-1' : (index === 1 ? 'badge-2' : (index === 2 ? 'badge-3' : 'badge-other'));
                    return \`
                        <tr>
                            <td><strong>\${info.name}</strong><br><span style="font-size: 0.75rem; color: var(--text-secondary);">\${jid.split('@')[0]}</span></td>
                            <td><span class="badge \${badgeClass}">\${info.count} pesan</span></td>
                        </tr>
                    \`;
                }).join('');
            }

            // Update Groups
            const groupTableBody = document.querySelector('#topGroupsTable tbody');
            const sortedGroups = Object.entries(groups || {})
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 5);

            if (sortedGroups.length === 0) {
                groupTableBody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: var(--text-secondary);">Tidak ada data grup</td></tr>';
            } else {
                groupTableBody.innerHTML = sortedGroups.map(([jid, info], index) => {
                    const badgeClass = index === 0 ? 'badge-1' : (index === 1 ? 'badge-2' : (index === 2 ? 'badge-3' : 'badge-other'));
                    return \`
                        <tr>
                            <td><strong>\${info.name}</strong><br><span style="font-size: 0.75rem; color: var(--text-secondary);">\${jid}</span></td>
                            <td><span class="badge \${badgeClass}">\${info.count} pesan</span></td>
                        </tr>
                    \`;
                }).join('');
            }
        }

        async function clearCache() {
            if (!confirm('Apakah Anda yakin ingin membersihkan cache database pesan bot? Tindakan ini aman dan tidak akan mengeluarkan bot dari WhatsApp maupun menghapus statistik grafik.')) return;
            try {
                const res = await fetch('/api/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'cache' })
                });
                const result = await res.json();
                if (result.success) {
                    alert('Sukses: Cache database pesan berhasil dibersihkan!');
                    fetchStats();
                } else {
                    alert('Gagal: ' + result.error);
                }
            } catch (err) {
                alert('Terjadi kesalahan: ' + err);
            }
        }

        async function resetSession() {
            if (!confirm('Apakah Anda yakin ingin melakukan reset sesi? Tindakan ini akan memutus koneksi bot dari WhatsApp dan menghapus berkas login. Anda harus melakukan pairing ulang setelah ini.')) return;
            try {
                const res = await fetch('/api/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'all' })
                });
                const result = await res.json();
                if (result.success) {
                    alert('Sukses: Sesi WhatsApp dicabut dan dibersihkan. Terminal bot akan merestart untuk meminta kode pairing baru.');
                    window.location.reload();
                } else {
                    alert('Gagal: ' + result.error);
                }
            } catch (err) {
                alert('Terjadi kesalahan: ' + err);
            }
        }

        // Run fetch on load and every 5 seconds
        fetchStats();
        setInterval(fetchStats, 5000);
    </script>
</body>
</html>
`;

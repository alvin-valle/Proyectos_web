// ==========================================
// VARIABLES GLOBALES Y CONTROL DE MODAL
// ==========================================
let currentMethod = '';
let myChart = null;

function closeModal() {
    const modal = document.getElementById('welcomeModal');
    modal.classList.add('hidden');
    setTimeout(() => { modal.style.display = 'none'; }, 500);
}

// ==========================================
// 1. ENRUTADOR Y CONTROL DE INTERFAZ
// ==========================================
function loadMethod(method) {
    currentMethod = method;
    clearData(); 
    
    const title = document.getElementById('method-title');
    const inputsContainer = document.getElementById('inputs-container');
    let inputsHTML = '<div class="input-grid">';

    let needsTolAndIter = true; 

    if (method === 'bolzano') {
        title.innerText = 'Teorema de Bolzano';
        needsTolAndIter = false;
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Límite Inferior (a)</label><input type="number" id="a" value="1" step="any"></div>
            <div class="input-group"><label>Límite Superior (b)</label><input type="number" id="b" value="2" step="any"></div>
        `;
    } 
    else if (method === 'biseccion' || method === 'regla_falsa') {
        title.innerText = method === 'biseccion' ? 'Método de Bisección' : 'Regla Falsa (Falsa Posición)';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Límite Inferior (a)</label><input type="number" id="a" value="1" step="any"></div>
            <div class="input-group"><label>Límite Superior (b)</label><input type="number" id="b" value="2" step="any"></div>
        `;
    }
    else if (method === 'secante') {
        title.innerText = 'Método de la Secante';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Valor Inicial (p0)</label><input type="number" id="p0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial (p1)</label><input type="number" id="p1" value="2" step="any"></div>
        `;
    }
    else if (method === 'newton') {
        title.innerText = 'Método de Newton-Raphson';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="x^3 + 4*x^2 - 10"></div>
            <div class="input-group"><label>Punto Inicial (p0)</label><input type="number" id="p0" value="1.5" step="any"></div>
        `;
    }
    else if (method === 'punto_fijo') {
        title.innerText = 'Iteración de Punto Fijo';
        inputsHTML += `
            <div class="input-group"><label>Función g(x)</label><input type="text" id="func" value="(10 - 4*x^2)^(1/3)"></div>
            <div class="input-group"><label>Valor Inicial (p0)</label><input type="number" id="p0" value="1.5" step="any"></div>
        `;
    }
    else if (method === 'muller') {
        title.innerText = 'Método de Müller';
        inputsHTML += `
            <div class="input-group"><label>Función f(x)</label><input type="text" id="func" value="16*x^4 - 40*x^3 + 5*x^2 + 20*x + 6"></div>
            <div class="input-group"><label>x0</label><input type="number" id="x0" value="0.5" step="any"></div>
            <div class="input-group"><label>x1</label><input type="number" id="x1" value="-0.5" step="any"></div>
            <div class="input-group"><label>x2</label><input type="number" id="x2" value="0.0" step="any"></div>
        `;
    }
    else if (method === 'horner') {
        title.innerText = 'Método de Horner';
        needsTolAndIter = false;
        inputsHTML += `
            <div class="input-group"><label>Coeficientes (Mayor a menor)</label><input type="text" id="coefs" value="2, 0, -3, 3, -4"></div>
            <div class="input-group"><label>Punto (x0)</label><input type="number" id="x0" value="-2" step="any"></div>
        `;
    }
    else if (method === 'bairstow') {
        title.innerText = 'Método de Bairstow';
        inputsHTML += `
            <div class="input-group"><label>Coeficientes (Mayor a menor)</label><input type="text" id="coefs" value="1, 1, 3, 4, 6"></div>
            <div class="input-group"><label>Valor (r0)</label><input type="number" id="r0" value="-2.1" step="any"></div>
            <div class="input-group"><label>Valor (s0)</label><input type="number" id="s0" value="-1.9" step="any"></div>
        `;
    }
    else if (method === 'newton_multivariable') {
        title.innerText = 'Newton-Raphson Multivariable';
        inputsHTML += `
            <div class="input-group"><label>f1(x,y,z)</label><input type="text" id="f1" value="x^2 + y^2 + z^2 - 9"></div>
            <div class="input-group"><label>f2(x,y,z)</label><input type="text" id="f2" value="x^2 - y - z"></div>
            <div class="input-group"><label>f3(x,y,z) (Dejar vacío si es 2x2)</label><input type="text" id="f3" value="x - z"></div>
            <div class="input-group"><label>Valor Inicial x0</label><input type="number" id="x0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial y0</label><input type="number" id="y0" value="1" step="any"></div>
            <div class="input-group"><label>Valor Inicial z0 (Si aplica)</label><input type="number" id="z0" value="1" step="any"></div>
        `;
    }

    if (needsTolAndIter) {
        inputsHTML += `
            <div class="input-group"><label>Tolerancia (TOL)</label><input type="number" id="tol" value="0.0001" step="any"></div>
            <div class="input-group"><label>Iteraciones (N)</label><input type="number" id="iter" value="20"></div>
        `;
    }
    
    inputsHTML += `<div class="input-group"><label>&nbsp;</label><button class="btn btn-primary" onclick="runAlgorithm()">Calcular</button></div></div>`;
    
    inputsContainer.innerHTML = inputsHTML;
    inputsContainer.classList.remove('fade-in');
    void inputsContainer.offsetWidth; 
    inputsContainer.classList.add('fade-in');
}

function clearData() {
    document.getElementById('tableHead').innerHTML = '';
    document.getElementById('tableBody').innerHTML = '';
    if (myChart) { myChart.destroy(); myChart = null; }
}

function exportExcel() {
    const table = document.getElementById('resultsTable');
    if (!table || table.rows.length <= 1) { alert("No hay datos para exportar."); return; }
    const wb = XLSX.utils.table_to_book(table, {sheet: "Resultados"});
    XLSX.writeFile(wb, `Resultados_${currentMethod}.xlsx`);
}

function f(funcString, x_val) {
    try { return math.evaluate(funcString, { x: x_val }); } 
    catch (error) { alert("Error en la función."); throw error; }
}

function runAlgorithm() {
    try {
        if (currentMethod === 'bolzano') runBolzano();
        else if (currentMethod === 'biseccion') runBisection();
        else if (currentMethod === 'regla_falsa') runReglaFalsa();
        else if (currentMethod === 'secante') runSecante();
        else if (currentMethod === 'newton') runNewton();
        else if (currentMethod === 'punto_fijo') runPuntoFijo();
        else if (currentMethod === 'muller') runMuller();
        else if (currentMethod === 'horner') runHorner();
        else if (currentMethod === 'bairstow') runBairstow();
        else if (currentMethod === 'newton_multivariable') runNewtonMultivariable();
    } catch (e) {
        alert("Ocurrió un error matemático.");
        console.error(e);
    }
}

// ==========================================
// FUNCIÓN PARA GENERAR EL APARTADO DE ANÁLISIS
// ==========================================
function generateAnalysisSummary(negativeIters, zeroErrorIter, colSpan) {
    let html = `<tr style="background-color: #f8fafc;"><td colspan="${colSpan}" style="text-align: left; padding: 15px; border-top: 2px solid var(--primary);">`;
    html += `<strong style="color: var(--primary); font-size: 1.1em;">📊 Apartado de Análisis de Iteración:</strong><br><br>`;
    
    // Análisis de Negativos
    if (negativeIters.length > 0) {
        html += `🔸 <strong style="color: #ea580c;">Iteración Negativa:</strong> El valor calculado (Raíz/Factor) cruzó hacia el lado negativo en las iteraciones: <strong>${negativeIters.join(', ')}</strong>.<br>`;
    } else {
        html += `🔹 <strong>Signo Constante:</strong> La iteración se mantuvo en valores positivos en todo el proceso.<br>`;
    }

    // Análisis de Error Cero
    if (zeroErrorIter !== -1) {
        html += `✅ <strong style="color: #16a34a;">Error Cero Logrado:</strong> El error se volvió exactamente <strong>0</strong> en la iteración <strong>${zeroErrorIter}</strong>. ¡Se encontró la solución analítica exacta!<br>`;
    } else {
        html += `📉 <strong>Tolerancia Alcanzada:</strong> El método se detuvo por el criterio de tolerancia sin llegar al cero absoluto.<br>`;
    }
    
    html += `</td></tr>`;
    return html;
}

// ==========================================
// LÓGICA DE MÉTODOS NUMÉRICOS
// ==========================================

function runBolzano() {
    const funcStr = document.getElementById('func').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const fa = f(funcStr, a);
    const fb = f(funcStr, b);
    const tbody = document.getElementById('tableBody');
    
    document.getElementById('tableHead').innerHTML = `<tr><th>Límite a</th><th>Límite b</th><th>f(a)</th><th>f(b)</th><th>f(a)*f(b)</th><th>Conclusión</th></tr>`;
    
    const product = fa * fb;
    const conclusion = product < 0 ? "Cambio de signo: EXISTE al menos una raíz." : "No hay cambio de signo: NO se garantiza raíz.";
    tbody.innerHTML = `<tr><td>${a}</td><td>${b}</td><td>${fa.toFixed(4)}</td><td>${fb.toFixed(4)}</td><td>${product.toFixed(4)}</td><td style="color: ${product < 0 ? 'green' : 'red'}; font-weight: bold;">${conclusion}</td></tr>`;
    
    plotFunction(funcStr, a, b, null);
}

function runBisection() {
    const funcStr = document.getElementById('func').value;
    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    let fa = f(funcStr, a); let fb = f(funcStr, b);
    if (fa * fb > 0) { alert("Error: f(a) y f(b) deben tener signos opuestos."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>n</th><th>a</th><th>b</th><th>p_n (Raíz)</th><th>f(p_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, fp, error = 100, p_old = a;
    let negativeIters = [];
    let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        p = a + (b - a) / 2;
        fp = f(funcStr, p);
        if (i > 1) error = Math.abs((p - p_old) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0 && i > 1) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        
        tbody.innerHTML += `<tr><td>${i}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td style="${pStyle}">${p.toFixed(6)}</td><td>${fp.toFixed(6)}</td><td>${i === 1 ? '-' : error.toFixed(6)}</td></tr>`;
        
        if (fp === 0 || (b - a) / 2 < tol || error === 0) {
            if (fp === 0) zeroErrorIter = i;
            break;
        }
        
        if (fa * fp > 0) { a = p; fa = fp; } else { b = p; }
        p_old = p;
    }
    
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, parseFloat(document.getElementById('a').value), parseFloat(document.getElementById('b').value), p);
}

function runReglaFalsa() {
    const funcStr = document.getElementById('func').value;
    let a = parseFloat(document.getElementById('a').value);
    let b = parseFloat(document.getElementById('b').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    let fa = f(funcStr, a); let fb = f(funcStr, b);
    if (fa * fb > 0) { alert("Error: f(a) y f(b) deben tener signos opuestos."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>a</th><th>b</th><th>Raíz (p)</th><th>f(p)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p = a, p_old = a, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        p = b - (fb * (b - a)) / (fb - fa);
        let fp = f(funcStr, p);
        if (i > 1) error = Math.abs((p - p_old) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0 && i > 1) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';

        tbody.innerHTML += `<tr><td>${i}</td><td>${a.toFixed(6)}</td><td>${b.toFixed(6)}</td><td style="${pStyle}">${p.toFixed(6)}</td><td>${fp.toFixed(6)}</td><td>${i === 1 ? '-' : error.toFixed(6)}</td></tr>`;
        
        if (Math.abs(fp) === 0) zeroErrorIter = i;
        if (Math.abs(fp) < tol || error < tol || error === 0) break;
        
        if (fa * fp < 0) { b = p; fb = fp; } else { a = p; fa = fp; }
        p_old = p;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, parseFloat(document.getElementById('a').value), parseFloat(document.getElementById('b').value), p);
}

function runSecante() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    let p1 = parseFloat(document.getElementById('p1').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    let f0 = f(funcStr, p0); let f1 = f(funcStr, p1);
    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_n-1</th><th>p_n</th><th>Raíz (p_n+1)</th><th>f(p_n+1)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        if (f1 - f0 === 0) { alert("Error: División por cero en Secante."); break; }
        p = p1 - (f1 * (p1 - p0)) / (f1 - f0);
        let fp = f(funcStr, p);
        error = Math.abs((p - p1) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';

        tbody.innerHTML += `<tr><td>${i}</td><td>${p0.toFixed(6)}</td><td>${p1.toFixed(6)}</td><td style="${pStyle}">${p.toFixed(6)}</td><td>${fp.toFixed(6)}</td><td>${error.toFixed(6)}</td></tr>`;
        
        if (Math.abs(fp) === 0) zeroErrorIter = i;
        if (Math.abs(fp) < tol || error < tol || error === 0) break;
        
        p0 = p1; f0 = f1;
        p1 = p;  f1 = fp;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, p0 - 2, p + 2, p);
}

function runNewton() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    const node = math.parse(funcStr); const code = node.compile();
    const derivative = math.derivative(node, 'x'); const derivCode = derivative.compile();

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_n-1</th><th>f(p_n-1)</th><th>f'(p_n-1)</th><th>Raíz (p_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        let fp0 = code.evaluate({ x: p0 });
        let dfp0 = derivCode.evaluate({ x: p0 });

        if (dfp0 === 0) { alert("Error: La derivada es cero."); break; }
        p = p0 - (fp0 / dfp0);
        error = Math.abs((p - p0) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';

        tbody.innerHTML += `<tr><td>${i}</td><td>${p0.toFixed(6)}</td><td>${fp0.toFixed(6)}</td><td>${dfp0.toFixed(6)}</td><td style="${pStyle}">${p.toFixed(6)}</td><td>${error.toFixed(6)}</td></tr>`;
        
        let checkZero = Math.abs(code.evaluate({x: p}));
        if (checkZero === 0) zeroErrorIter = i;
        if (checkZero < tol || error < tol || error === 0) break;
        p0 = p;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 6);
    plotFunction(funcStr, p0 - 3, p + 3, p);
}

function runPuntoFijo() {
    const funcStr = document.getElementById('func').value;
    let p0 = parseFloat(document.getElementById('p0').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>p_n-1</th><th>p_n = g(p_n-1)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 1; i <= maxIter; i++) {
        p = f(funcStr, p0);
        error = Math.abs((p - p0) / p);

        if (p < 0) negativeIters.push(i);
        if (error === 0) zeroErrorIter = i;

        let pStyle = p < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';

        tbody.innerHTML += `<tr><td>${i}</td><td>${p0.toFixed(6)}</td><td style="${pStyle}">${p.toFixed(6)}</td><td>${error.toFixed(6)}</td></tr>`;
        
        if (error < tol || error === 0) break;
        p0 = p;
        if (!isFinite(p) || i === maxIter) {
            tbody.innerHTML += `<tr><td colspan="4" style="color: red; text-align:center;">El método divergió o alcanzó iteraciones máximas.</td></tr>`;
            break;
        }
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 4);
    plotPuntoFijo(funcStr, p0 - 2, p + 2, p);
}

function runMuller() {
    const funcStr = document.getElementById('func').value;
    let x0 = math.complex(document.getElementById('x0').value);
    let x1 = math.complex(document.getElementById('x1').value);
    let x2 = math.complex(document.getElementById('x2').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    const f_complex = (val) => math.evaluate(funcStr, { x: val });

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>x_n (Raíz)</th><th>f(x_n)</th><th>Error</th></tr>`;
    tbody.innerHTML = '';

    let h1, h2, d1, d2, a, b, c, D, E, h, p, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let i = 3; i <= maxIter + 2; i++) {
        h1 = math.subtract(x1, x0); h2 = math.subtract(x2, x1);
        d1 = math.divide(math.subtract(f_complex(x1), f_complex(x0)), h1);
        d2 = math.divide(math.subtract(f_complex(x2), f_complex(x1)), h2);
        a = math.divide(math.subtract(d2, d1), math.add(h2, h1));
        b = math.add(d2, math.multiply(h2, a));
        c = f_complex(x2);
        
        let b2 = math.pow(b, 2);
        let four_ac = math.multiply(4, math.multiply(a, c));
        D = math.sqrt(math.subtract(b2, four_ac));
        
        let E1 = math.add(b, D); let E2 = math.subtract(b, D);
        E = (math.abs(E1) > math.abs(E2)) ? E1 : E2;
        
        h = math.divide(math.multiply(-2, c), E);
        p = math.add(x2, h); 
        error = math.abs(h); 

        // Evaluamos si la parte real de la raíz compleja se vuelve negativa
        if (p.re < 0) negativeIters.push(i-2);
        if (error === 0) zeroErrorIter = i-2;

        let pStyle = p.re < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        let pFormat = p.im === 0 ? p.re.toFixed(6) : `${p.re.toFixed(6)} ${p.im > 0 ? '+' : '-'} ${Math.abs(p.im).toFixed(6)}i`;
        let fpFormat = f_complex(p).im === 0 ? f_complex(p).re.toFixed(6) : `${f_complex(p).re.toFixed(6)} + ${f_complex(p).im.toFixed(6)}i`;

        tbody.innerHTML += `<tr><td>${i-2}</td><td style="${pStyle}">${pFormat}</td><td>${fpFormat}</td><td>${error.toFixed(6)}</td></tr>`;
        
        if (error < tol || error === 0) break;
        x0 = x1; x1 = x2; x2 = p;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 4);
    plotFunction(funcStr, -3, 3, p.im === 0 ? p.re : null);
}

function runBairstow() {
    const a = document.getElementById('coefs').value.split(',').map(Number);
    let r = parseFloat(document.getElementById('r0').value);
    let s = parseFloat(document.getElementById('s0').value);
    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);
    const N = a.length - 1;

    if (a.some(isNaN) || N < 2) { alert("Ingresa al menos 3 coeficientes numéricos separados por comas."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>Iteración</th><th>r_n</th><th>s_n</th><th>Δr</th><th>Δs</th><th>Error (r)</th><th>Error (s)</th></tr>`;
    tbody.innerHTML = '';

    let b = new Array(N + 1).fill(0); let c = new Array(N + 1).fill(0);
    let errorR = 100, errorS = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let iter = 1; iter <= maxIter; iter++) {
        b[0] = a[0]; b[1] = a[1] + r * b[0];
        for (let k = 2; k <= N; k++) { b[k] = a[k] + r * b[k-1] + s * b[k-2]; }

        c[0] = b[0]; c[1] = b[1] + r * c[0];
        for (let k = 2; k <= N; k++) { c[k] = b[k] + r * c[k-1] + s * c[k-2]; }

        const detD = (c[N-2] * c[N-2]) - (c[N-1] * c[N-3]);
        if (detD === 0) { alert("Determinante cero. El método falla."); break; }

        const deltaR = ((-b[N-1] * c[N-2]) - (-b[N] * c[N-3])) / detD;
        const deltaS = ((c[N-1] * -b[N]) - (c[N-2] * -b[N-1])) / detD;

        r += deltaR; s += deltaS;
        errorR = Math.abs(deltaR / r); errorS = Math.abs(deltaS / s);

        if (r < 0 || s < 0) negativeIters.push(iter);
        if (errorR === 0 && errorS === 0) zeroErrorIter = iter;

        let rStyle = r < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';
        let sStyle = s < 0 ? 'color: #ea580c; font-weight: bold;' : 'font-weight: bold;';

        tbody.innerHTML += `<tr><td>${iter}</td><td style="${rStyle}">${r.toFixed(6)}</td><td style="${sStyle}">${s.toFixed(6)}</td><td>${deltaR.toFixed(6)}</td><td>${deltaS.toFixed(6)}</td><td>${errorR.toFixed(6)}</td><td>${errorS.toFixed(6)}</td></tr>`;

        if ((errorR < tol && errorS < tol) || (errorR === 0 && errorS === 0)) break;
    }
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, 7);
    if (myChart) { myChart.destroy(); myChart = null; }
}

function runNewtonMultivariable() {
    const f1_str = document.getElementById('f1').value.trim();
    const f2_str = document.getElementById('f2').value.trim();
    const f3_str = document.getElementById('f3').value.trim();

    let vars = ['x', 'y']; let funcs = [f1_str, f2_str];
    let x0 = parseFloat(document.getElementById('x0').value);
    let y0 = parseFloat(document.getElementById('y0').value);
    let vals = [x0, y0];

    if (f3_str !== '') { vars.push('z'); funcs.push(f3_str); vals.push(parseFloat(document.getElementById('z0').value || 0)); }

    const tol = parseFloat(document.getElementById('tol').value);
    const maxIter = parseInt(document.getElementById('iter').value);

    let f_compiled = funcs.map(func => math.compile(func));
    let J_compiled = [];
    for (let i = 0; i < funcs.length; i++) {
        let row = [];
        for (let j = 0; j < vars.length; j++) { row.push(math.derivative(funcs[i], vars[j]).compile()); }
        J_compiled.push(row);
    }

    const tbody = document.getElementById('tableBody');
    let headerHTML = `<tr><th>Iteración</th>`;
    vars.forEach(v => headerHTML += `<th>${v}_n</th>`);
    headerHTML += `<th>Error Máximo</th></tr>`;
    document.getElementById('tableHead').innerHTML = headerHTML;
    tbody.innerHTML = '';

    let X = vals, error = 100;
    let negativeIters = []; let zeroErrorIter = -1;

    for (let iter = 1; iter <= maxIter; iter++) {
        let scope = {};
        vars.forEach((v, idx) => scope[v] = X[idx]);

        let F_val = f_compiled.map(func => func.evaluate(scope));
        let J_val = [];
        for (let i = 0; i < funcs.length; i++) {
            let row = [];
            for (let j = 0; j < vars.length; j++) { row.push(J_compiled[i][j].evaluate(scope)); }
            J_val.push(row);
        }

        try {
            let J_inv = math.inv(J_val);
            let delta = math.multiply(J_inv, F_val);
            let X_new = math.subtract(X, delta);

            error = 0;
            for(let k = 0; k < vars.length; k++) {
                let e = Math.abs(delta[k] / X_new[k]);
                if(e > error) error = e;
            }

            // Registrar si alguna variable en la iteración fue negativa
            if (X_new.some(val => val < 0)) negativeIters.push(iter);
            if (error === 0) zeroErrorIter = iter;

            X = X_new;
            let rowHTML = `<td>${iter}</td>`;
            X.forEach(val => {
                let style = val < 0 ? 'color: #ea580c; font-weight: bold;' : '';
                rowHTML += `<td style="${style}">${val.toFixed(6)}</td>`;
            });
            rowHTML += `<td>${error.toFixed(6)}</td>`;
            tbody.innerHTML += `<tr>${rowHTML}</tr>`;

            if (error < tol || error === 0) break;
            
        } catch (err) { alert("La Matriz Jacobiana es singular en este punto."); break; }
    }
    
    // Colspan = Variables + (Iteración y Error)
    tbody.innerHTML += generateAnalysisSummary(negativeIters, zeroErrorIter, vars.length + 2);
    if (myChart) { myChart.destroy(); myChart = null; }
}

function runHorner() {
    // Horner no es iterativo como los demás, por lo que su estructura original se mantiene limpia
    const a = document.getElementById('coefs').value.split(',').map(Number);
    const x0 = parseFloat(document.getElementById('x0').value);
    const N = a.length - 1; 

    if (a.some(isNaN)) { alert("Ingresa los coeficientes correctamente separados por comas."); return; }

    const tbody = document.getElementById('tableBody');
    document.getElementById('tableHead').innerHTML = `<tr><th>k</th><th>Coeficiente a_k</th><th>d_k (para P)</th><th>d_k (para Q / P')</th></tr>`;
    tbody.innerHTML = '';

    let y = a[0]; let z = a[0]; 

    tbody.innerHTML += `<tr><td>0</td><td>${a[0]}</td><td>${y}</td><td>${z}</td></tr>`;
    for (let j = 1; j < N; j++) {
        y = x0 * y + a[j];
        z = x0 * z + y;
        tbody.innerHTML += `<tr><td>${j}</td><td>${a[j]}</td><td>${y}</td><td>${z}</td></tr>`;
    }
    y = x0 * y + a[N]; 
    tbody.innerHTML += `<tr><td>${N}</td><td>${a[N]}</td><td style="font-weight:bold; color:var(--primary);">${y}</td><td>-</td></tr>`;
    tbody.innerHTML += `<tr style="background-color: #e2e8f0;"><td colspan="4" style="text-align:left; padding: 15px;"><strong>Resultados Finales:</strong><br>P(${x0}) = <strong>${y}</strong><br>P'(${x0}) = <strong>${z}</strong></td></tr>`;

    if (myChart) { myChart.destroy(); myChart = null; }
}

// ==========================================
// 6. FUNCIONES DE DIBUJO (CHART.JS)
// ==========================================
function plotFunction(funcStr, a, b, root) {
    const ctx = document.getElementById('mathChart').getContext('2d');
    let xValues = [], yValues = [], margin = (b - a) * 0.5;
    for (let x = a - margin; x <= b + margin; x += 0.1) {
        xValues.push(x.toFixed(2));
        yValues.push(f(funcStr, x));
    }
    if (myChart) myChart.destroy(); 
    const datasets = [{ label: `f(x) = ${funcStr}`, data: yValues, borderColor: '#2563eb', borderWidth: 2, fill: false, pointRadius: 0 }];
    if (root !== null) datasets.push({ label: 'Raíz Aproximada', data: [{x: root, y: f(funcStr, root)}], backgroundColor: '#ef4444', pointRadius: 6, type: 'scatter' });

    myChart = new Chart(ctx, { type: 'line', data: { labels: xValues, datasets: datasets }, options: { responsive: true, maintainAspectRatio: false, plugins: { zoom: { zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy', }, pan: { enabled: true, mode: 'xy' } } } } });
}

function plotPuntoFijo(funcStr, a, b, root) {
    const ctx = document.getElementById('mathChart').getContext('2d');
    let xValues = [], yValues = [], identityValues = [];
    for (let x = a; x <= b; x += 0.1) {
        xValues.push(x.toFixed(2));
        yValues.push(f(funcStr, x));
        identityValues.push(x); 
    }
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, { type: 'line', data: { labels: xValues, datasets: [ { label: `g(x) = ${funcStr}`, data: yValues, borderColor: '#2563eb', borderWidth: 2, fill: false, pointRadius: 0 }, { label: `y = x`, data: identityValues, borderColor: '#10b981', borderWidth: 2, borderDash: [5, 5], fill: false, pointRadius: 0 }, { label: 'Punto Fijo (Raíz)', data: [{x: root, y: root}], backgroundColor: '#ef4444', pointRadius: 6, type: 'scatter' } ] }, options: { responsive: true, maintainAspectRatio: false } });
}

// ==========================================
// ARRANQUE DINÁMICO
// ==========================================
window.onload = function() {
    document.getElementById('method-title').innerText = 'Dashboard Principal';
    document.getElementById('inputs-container').innerHTML = `
        <div class="fade-in" style="text-align:center; padding: 40px; width: 100%;">
            <h2 style="color: var(--primary); margin-bottom:15px;">¡Panel listo!</h2>
            <p style="font-size: 1.1em; color: #64748b;">Selecciona un método en el menú de la izquierda para comenzar a calcular.</p>
        </div>
    `;
};
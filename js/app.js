// =============================================================================
// APLICACIÓN PRINCIPAL: MATEMÁTICAS 4.º · TEMA 2
// La Suma y la Resta: Propiedades, Operaciones Combinadas, Estimación y Problemas
// Compatible con iPad iOS 12.5.8+ y Navegadores Modernos
// =============================================================================

var safeStorage = {
  get: function(key, defaultVal) {
    try {
      var val = localStorage.getItem(key);
      return val !== null ? val : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  },
  set: function(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }
};

function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setVal(id, val) {
  var el = document.getElementById(id);
  if (el) el.value = val;
}

class MathAppTema2 {
  constructor() {
    this.currentTab = 'home';
    this.studentName = safeStorage.get('olivia_math_name', 'Olivia');
    this.stars = parseInt(safeStorage.get('olivia_math_stars_t2', '0'), 10);
    this.activeScenarioIndex = 0;
    this.scenario = MathData.scenarios[0];

    // Estados para la balanza interactiva
    this.balancePanLeft = [];
    this.balancePanRight = [];

    // Estados para Desafío Express
    this.quizQuestions = [];
    this.quizCurrentIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];

    // Estados para Arcade
    this.arcadeScore = 0;
    this.arcadeStreak = 0;
    this.arcadeCurrent = null;

    this.init();
  }

  init() {
    this.updateUserUI();
    this.renderScenarioSelector();
    this.bindEvents();
    this.loadScenario(0);
    this.navigate('home');
  }

  updateUserUI() {
    const starsEl = document.getElementById('header-stars');
    const nameEl = document.getElementById('header-student-name');
    if (starsEl) starsEl.textContent = this.stars;
    if (nameEl) nameEl.textContent = this.studentName;
  }

  addStars(count = 1) {
    this.stars += count;
    safeStorage.set('olivia_math_stars_t2', this.stars.toString());
    this.updateUserUI();
    if (window.sound) sound.playCorrect();
  }

  renderScenarioSelector() {
    const selectEl = document.getElementById('scenario-select');
    if (!selectEl) return;
    selectEl.innerHTML = '';
    MathData.scenarios.forEach((sc, idx) => {
      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `${sc.icon} ${sc.name} (${sc.badge})`;
      if (idx === this.activeScenarioIndex) opt.selected = true;
      selectEl.appendChild(opt);
    });

    selectEl.addEventListener('change', (e) => {
      this.loadScenario(parseInt(e.target.value, 10));
    });
  }

  loadScenario(index) {
    this.activeScenarioIndex = index;
    this.scenario = MathData.scenarios[index];
    this.renderScenarioHeader();
    this.renderBaseMission();
    this.renderCombinedOperations();
    this.renderEstimations();
    this.resetBalance();
  }

  renderScenarioHeader() {
    const sc = this.scenario;
    const banner = document.getElementById('scenario-banner');
    if (banner) {
      banner.innerHTML = `
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white border-2 border-amber-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
              ${sc.icon}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl md:text-2xl font-black font-display text-slate-800">${sc.name}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">${sc.badge}</span>
              </div>
              <p class="text-slate-600 text-sm mt-1">${sc.description}</p>
            </div>
          </div>
          <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-right w-full md:w-auto">
            <span class="text-xs uppercase font-black text-amber-700 tracking-wider block">Peso Total Masa Base</span>
            <span class="text-3xl font-black text-amber-900">${MathUtils.formatGrams(sc.baseTotalWeight)}</span>
          </div>
        </div>
      `;
    }

    // Renderizar tarjetas de ingredientes de la masa base
    const ingContainer = document.getElementById('base-ingredients-list');
    if (ingContainer) {
      const ings = sc.ingredients;
      ingContainer.innerHTML = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-amber-50/80 border-2 border-amber-200 p-3 rounded-2xl text-center">
            <span class="text-2xl">${ings.harina.icon}</span>
            <div class="font-black text-slate-800 text-sm mt-1">${ings.harina.name}</div>
            <div class="text-amber-800 font-extrabold text-lg">${ings.harina.weight} g</div>
          </div>
          <div class="bg-blue-50/80 border-2 border-blue-200 p-3 rounded-2xl text-center">
            <span class="text-2xl">${ings.azucar.icon}</span>
            <div class="font-black text-slate-800 text-sm mt-1">${ings.azucar.name}</div>
            <div class="text-blue-800 font-extrabold text-lg">${ings.azucar.weight} g</div>
          </div>
          <div class="bg-purple-50/80 border-2 border-purple-200 p-3 rounded-2xl text-center">
            <span class="text-2xl">${ings.levadura.icon}</span>
            <div class="font-black text-slate-800 text-sm mt-1">${ings.levadura.name}</div>
            <div class="text-purple-800 font-extrabold text-lg">${ings.levadura.weight} g</div>
          </div>
          <div class="bg-emerald-50/80 border-2 border-emerald-200 p-3 rounded-2xl text-center">
            <span class="text-2xl">${ings.mantequilla.icon}</span>
            <div class="font-black text-slate-800 text-sm mt-1">${ings.mantequilla.name}</div>
            <div class="text-emerald-800 font-extrabold text-lg">${ings.mantequilla.weight} g</div>
          </div>
        </div>
      `;
    }
  }

  // ===========================================================================
  // 1. MISIÓN PROPIEDADES (CONMUTATIVA, ASOCIATIVA, HUECOS)
  // ===========================================================================
  renderBaseMission() {
    const sc = this.scenario;
    const ing = sc.ingredients;

    // Ejercicio 1A: Conmutativa Harina + Azúcar
    const c1El = document.getElementById('prop-comm-1');
    if (c1El) {
      c1El.innerHTML = `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-800">1. Aplica la Propiedad Conmutativa:</span>
            <span class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg font-bold">${ing.harina.name} + ${ing.azucar.name}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-lg font-black text-slate-700">
            <span>${ing.harina.weight} + ${ing.azucar.weight} =</span>
            <input type="number" id="comm1-left" class="w-20 p-2 text-center border-2 border-amber-300 rounded-xl" placeholder="___">
            <span>+</span>
            <input type="number" id="comm1-right" class="w-20 p-2 text-center border-2 border-amber-300 rounded-xl" placeholder="___">
            <span>=</span>
            <input type="number" id="comm1-res" class="w-24 p-2 text-center border-2 border-emerald-400 rounded-xl" placeholder="Total">
            <button onclick="app.checkCommutative1()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar
            </button>
          </div>
          <div id="comm1-feedback" class="text-sm font-bold"></div>
          <p class="text-xs text-slate-500 italic">¿Qué ingredientes se mezclaron a la izquierda y cuáles a la derecha? A la izquierda primero ${ing.harina.name} y luego ${ing.azucar.name}; a la derecha al revés.</p>
        </div>
      `;
    }

    // Ejercicio 1B: Conmutativa Harina + Mantequilla
    const c2El = document.getElementById('prop-comm-2');
    if (c2El) {
      c2El.innerHTML = `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-800">2. Conmutativa: ${ing.harina.name} + ${ing.mantequilla.name}</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-lg font-black text-slate-700">
            <span>${ing.harina.weight} + ${ing.mantequilla.weight} =</span>
            <input type="number" id="comm2-left" class="w-20 p-2 text-center border-2 border-amber-300 rounded-xl" placeholder="___">
            <span>+</span>
            <input type="number" id="comm2-right" class="w-20 p-2 text-center border-2 border-amber-300 rounded-xl" placeholder="___">
            <span>=</span>
            <input type="number" id="comm2-res" class="w-24 p-2 text-center border-2 border-emerald-400 rounded-xl" placeholder="Total">
            <button onclick="app.checkCommutative2()" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar
            </button>
          </div>
          <div id="comm2-feedback" class="text-sm font-bold"></div>
        </div>
      `;
    }

    // Ejercicio Asociativa 1: Harina + (Levadura + Sal/Mantequilla)
    const a1El = document.getElementById('prop-assoc-1');
    if (a1El) {
      a1El.innerHTML = `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-800">3. Aplica la Propiedad Asociativa:</span>
            <span class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg font-bold">Tres ingredientes agrupados</span>
          </div>
          <p class="text-sm text-slate-600">Calcula agrupando de dos formas distintas: <strong>${ing.harina.weight} + (${ing.levadura.weight} + ${ing.mantequilla.weight})</strong> y <strong>(${ing.harina.weight} + ${ing.levadura.weight}) + ${ing.mantequilla.weight}</strong>.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
            <div>
              <div class="font-bold text-xs text-purple-800 mb-1">Forma 1: Primero el paréntesis (${ing.levadura.weight} + ${ing.mantequilla.weight})</div>
              <div class="flex items-center gap-2 text-base font-bold">
                <span>${ing.harina.weight} + </span>
                <input type="number" id="assoc1-step1" class="w-20 p-1.5 text-center border-2 border-purple-300 rounded-lg" placeholder="Paréntesis">
                <span>=</span>
                <input type="number" id="assoc1-res1" class="w-24 p-1.5 text-center border-2 border-emerald-400 rounded-lg" placeholder="Total">
              </div>
            </div>
            <div>
              <div class="font-bold text-xs text-purple-800 mb-1">Forma 2: Primero (${ing.harina.weight} + ${ing.levadura.weight})</div>
              <div class="flex items-center gap-2 text-base font-bold">
                <input type="number" id="assoc1-step2" class="w-20 p-1.5 text-center border-2 border-purple-300 rounded-lg" placeholder="Paréntesis">
                <span>+ ${ing.mantequilla.weight} =</span>
                <input type="number" id="assoc1-res2" class="w-24 p-1.5 text-center border-2 border-emerald-400 rounded-lg" placeholder="Total">
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div id="assoc1-feedback" class="text-sm font-bold"></div>
            <button onclick="app.checkAssociative1()" class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar Asociativa
            </button>
          </div>
        </div>
      `;
    }

    // Ejercicio Huecos con Incógnitas (Ejercicio 2 del examen con otros números)
    const hEl = document.getElementById('prop-holes-container');
    if (hEl) {
      // Usamos números conceptualmente idénticos pero con valores propios del escenario
      const extraG = sc.extraIngredients[0].weight; // ej 45 g
      const extraG2 = sc.extraIngredients[1].weight; // ej 75 g
      hEl.innerHTML = `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 text-base">4. Completa los huecos aplicando propiedades:</h3>
            <span class="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-lg font-bold">Inspirado en el Examen</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Hueco Conmutativa A -->
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <span class="text-xs font-bold text-amber-900 block">Igualdad Conmutativa A:</span>
              <div class="flex items-center gap-1.5 font-black text-sm text-slate-700">
                <span>${ing.harina.weight} + </span>
                <input type="number" id="hole-a1" class="w-16 p-1 text-center border-2 border-amber-300 rounded-lg bg-white" placeholder="___">
                <span>= ${extraG} + </span>
                <input type="number" id="hole-a2" class="w-16 p-1 text-center border-2 border-amber-300 rounded-lg bg-white" placeholder="___">
              </div>
              <span class="text-[11px] text-slate-500 block">¿A qué ingrediente corresponde el ${extraG} g? Al ${sc.extraIngredients[0].name}.</span>
            </div>

            <!-- Hueco Conmutativa B -->
            <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <span class="text-xs font-bold text-blue-900 block">Igualdad Conmutativa B:</span>
              <div class="flex items-center gap-1.5 font-black text-sm text-slate-700">
                <input type="number" id="hole-b1" class="w-16 p-1 text-center border-2 border-blue-300 rounded-lg bg-white" placeholder="___">
                <span>+ ${ing.azucar.weight} = </span>
                <input type="number" id="hole-b2" class="w-16 p-1 text-center border-2 border-blue-300 rounded-lg bg-white" placeholder="___">
                <span>+ ${extraG2}</span>
              </div>
              <span class="text-[11px] text-slate-500 block">¿A qué ingrediente corresponde el ${extraG2} g? A las ${sc.extraIngredients[1].name}.</span>
            </div>

            <!-- Hueco Asociativa C -->
            <div class="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
              <span class="text-xs font-bold text-purple-900 block">Igualdad Asociativa C:</span>
              <div class="flex flex-wrap items-center gap-1 font-black text-xs text-slate-700">
                <span>${ing.harina.weight} + (</span>
                <input type="number" id="hole-c1" class="w-14 p-1 text-center border-2 border-purple-300 rounded-lg bg-white" placeholder="___">
                <span>+ ${ing.levadura.weight}) = (</span>
                <input type="number" id="hole-c2" class="w-14 p-1 text-center border-2 border-purple-300 rounded-lg bg-white" placeholder="___">
                <span>+ 120) + </span>
                <input type="number" id="hole-c3" class="w-14 p-1 text-center border-2 border-purple-300 rounded-lg bg-white" placeholder="___">
              </div>
            </div>

            <!-- Hueco Asociativa D -->
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <span class="text-xs font-bold text-emerald-900 block">Igualdad Asociativa D:</span>
              <div class="flex flex-wrap items-center gap-1 font-black text-xs text-slate-700">
                <span>(${ing.azucar.weight} + </span>
                <input type="number" id="hole-d1" class="w-14 p-1 text-center border-2 border-emerald-300 rounded-lg bg-white" placeholder="___">
                <span>) + 20 = </span>
                <input type="number" id="hole-d2" class="w-14 p-1 text-center border-2 border-emerald-300 rounded-lg bg-white" placeholder="___">
                <span>+ (${sc.extraIngredients[0].weight} + </span>
                <input type="number" id="hole-d3" class="w-14 p-1 text-center border-2 border-emerald-300 rounded-lg bg-white" placeholder="___">
                <span>)</span>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div id="holes-feedback" class="text-sm font-bold"></div>
            <button onclick="app.checkHoles()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition">
              Comprobar Todos los Huecos
            </button>
          </div>
        </div>
      `;
    }
  }

  checkCommutative1() {
    const sc = this.scenario;
    const a = sc.ingredients.harina.weight;
    const b = sc.ingredients.azucar.weight;
    const uL = getVal('comm1-left');
    const uR = getVal('comm1-right');
    const uRes = getVal('comm1-res');
    const fb = document.getElementById('comm1-feedback');

    const res = MathUtils.validateCommutative(a, b, uL, uR, uRes);
    if (res.success) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Excelente, Olivia! ${b} + ${a} = ${res.expectedSum}. El orden no cambia el total. ⭐`;
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      if (!res.isOrderSwapped) {
        fb.textContent = `Fíjate en el orden: debes invertir los números (${b} + ${a}).`;
      } else {
        fb.textContent = `El orden está bien, pero la suma debe dar ${res.expectedSum}.`;
      }
      if (window.sound) sound.playWrong();
    }
  }

  checkCommutative2() {
    const sc = this.scenario;
    const a = sc.ingredients.harina.weight;
    const b = sc.ingredients.mantequilla.weight;
    const uL = getVal('comm2-left');
    const uR = getVal('comm2-right');
    const uRes = getVal('comm2-res');
    const fb = document.getElementById('comm2-feedback');

    const res = MathUtils.validateCommutative(a, b, uL, uR, uRes);
    if (res.success) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Correcto! ${b} + ${a} = ${res.expectedSum}. ⭐`;
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Recuerda poner primero ${b}, después ${a} y su suma que es ${res.expectedSum}.`;
      if (window.sound) sound.playWrong();
    }
  }

  checkAssociative1() {
    const sc = this.scenario;
    const h = sc.ingredients.harina.weight;
    const l = sc.ingredients.levadura.weight;
    const m = sc.ingredients.mantequilla.weight;

    const s1 = MathUtils.parseNumber(getVal('assoc1-step1'));
    const r1 = MathUtils.parseNumber(getVal('assoc1-res1'));
    const s2 = MathUtils.parseNumber(getVal('assoc1-step2'));
    const r2 = MathUtils.parseNumber(getVal('assoc1-res2'));
    const fb = document.getElementById('assoc1-feedback');

    const expectedParen1 = l + m;
    const expectedTotal = h + l + m;
    const expectedParen2 = h + l;

    const ok1 = (s1 === expectedParen1 && r1 === expectedTotal);
    const ok2 = (s2 === expectedParen2 && r2 === expectedTotal);

    if (ok1 && ok2) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Magia asociativa demostrada! En ambas formas da exactamente ${expectedTotal} g. ⭐`;
      this.addStars(2);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Revisa los cálculos: el paréntesis (${l} + ${m}) da ${expectedParen1}, y (${h} + ${l}) da ${expectedParen2}. El total debe ser ${expectedTotal}.`;
      if (window.sound) sound.playWrong();
    }
  }

  checkHoles() {
    const sc = this.scenario;
    const ing = sc.ingredients;
    const extraG = sc.extraIngredients[0].weight;
    const extraG2 = sc.extraIngredients[1].weight;

    const a1 = MathUtils.parseNumber(getVal('hole-a1'));
    const a2 = MathUtils.parseNumber(getVal('hole-a2'));
    const b1 = MathUtils.parseNumber(getVal('hole-b1'));
    const b2 = MathUtils.parseNumber(getVal('hole-b2'));

    const c1 = MathUtils.parseNumber(getVal('hole-c1'));
    const c2 = MathUtils.parseNumber(getVal('hole-c2'));
    const c3 = MathUtils.parseNumber(getVal('hole-c3'));

    const d1 = MathUtils.parseNumber(getVal('hole-d1'));
    const d2 = MathUtils.parseNumber(getVal('hole-d2'));
    const d3 = MathUtils.parseNumber(getVal('hole-d3'));

    const fb = document.getElementById('holes-feedback');

    // Comprobaciones
    const okA = (a1 === extraG && a2 === ing.harina.weight);
    const okB = (b1 === extraG2 && b2 === ing.azucar.weight);
    const okC = (c1 === 120 && c2 === ing.harina.weight && c3 === ing.levadura.weight);
    const okD = (d1 === extraG && d2 === ing.azucar.weight && d3 === 20);

    let aciertos = 0;
    if (okA) aciertos++;
    if (okB) aciertos++;
    if (okC) aciertos++;
    if (okD) aciertos++;

    if (aciertos === 4) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Perfecto, Olivia! Has completado todos los huecos con precisión de maestra pastelera. ⭐⭐`;
      this.addStars(2);
    } else {
      fb.className = "text-sm font-bold text-amber-700";
      fb.textContent = `Llevas ${aciertos} de 4 igualdades correctas. Revisa que los números de la izquierda y la derecha sean exactamente los mismos sumandos.`;
      if (window.sound) sound.playWrong();
    }
  }

  // ===========================================================================
  // 2. MISIÓN OPERACIONES COMBINADAS (EJERCICIO 3 DEL EXAMEN)
  // ===========================================================================
  renderCombinedOperations() {
    const sc = this.scenario;
    const ing = sc.ingredients;
    const ob = sc.openBags;
    const sack1 = sc.sack1kg;
    const sack5 = sc.sack5kg;
    const comp = sc.twoBasesVsOther;

    const container = document.getElementById('combined-challenges-container');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Reto 1: Peso entero de la masa base -->
        <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
              <span>⚖️</span> Reto 1: ¿Cuánto pesará un producto entero hecho solo con la masa base?
            </h3>
            <span class="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl font-black">Operación Combinada de Suma</span>
          </div>
          <p class="text-slate-600 text-sm">Escribe la operación combinada sumando los 4 ingredientes de la masa base (${ing.harina.name}: ${ing.harina.weight} g, ${ing.azucar.name}: ${ing.azucar.weight} g, ${ing.levadura.name}: ${ing.levadura.weight} g, ${ing.mantequilla.name}: ${ing.mantequilla.weight} g):</p>
          <div class="flex flex-wrap items-center gap-3">
            <input type="text" id="comb-r1-expr" class="flex-1 min-w-[200px] p-2.5 border-2 border-amber-300 rounded-xl font-mono text-base" placeholder="${ing.harina.weight} + ${ing.azucar.weight} + ${ing.levadura.weight} + ${ing.mantequilla.weight}">
            <span>=</span>
            <input type="number" id="comb-r1-res" class="w-28 p-2.5 text-center border-2 border-emerald-400 rounded-xl font-bold text-lg" placeholder="Total g">
            <button onclick="app.checkComb1()" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar
            </button>
          </div>
          <div id="comb-r1-fb" class="text-sm font-bold"></div>
        </div>

        <!-- Reto 2: Dos masas base frente a otro producto -->
        <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
              <span>🥖</span> Reto 2: Comparación de Dos Lotes
            </h3>
            <span class="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-xl font-black">Suma y Resta</span>
          </div>
          <p class="text-slate-600 text-sm">¿Cuánto más pesarán dos productos de masa base que otro especial (${comp.otherName}) que pesa <strong>${comp.otherWeight} g</strong>?</p>
          <div class="p-3 bg-blue-50 rounded-xl text-xs text-blue-900 font-bold">
            💡 Pista: Primero calculas el peso de los dos lotes juntos (${sc.baseTotalWeight} + ${sc.baseTotalWeight}) y luego restas los ${comp.otherWeight} g.
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-bold text-slate-700">(${sc.baseTotalWeight} + ${sc.baseTotalWeight}) − ${comp.otherWeight} =</span>
            <input type="number" id="comb-r2-step1" class="w-24 p-2 text-center border-2 border-blue-300 rounded-xl font-bold" placeholder="2 bases">
            <span>− ${comp.otherWeight} =</span>
            <input type="number" id="comb-r2-res" class="w-28 p-2 text-center border-2 border-emerald-400 rounded-xl font-bold text-lg" placeholder="Diferencia">
            <button onclick="app.checkComb2()" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar
            </button>
          </div>
          <div id="comb-r2-fb" class="text-sm font-bold"></div>
        </div>

        <!-- Reto 3: Paquetes abiertos y la harina que falta -->
        <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
              <span>📦</span> Reto 3: Los Tres Paquetes Abiertos
            </h3>
            <span class="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-xl font-black">Con Paréntesis</span>
          </div>
          <p class="text-slate-600 text-sm">
            En la alacena hay 3 paquetes abiertos con <strong>${ob.bag1} g</strong>, <strong>${ob.bag2} g</strong> y <strong>${ob.bag3} g</strong> de ${ing.harina.name}.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Caso A: Para hacer 1 masa -->
            <div class="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
              <span class="text-xs font-black text-purple-900 block">A) ¿Cuánta harina falta para hacer 1 masa base (${ob.neededOne} g)?</span>
              <div class="text-xs font-bold text-slate-600">Operación: ${ob.neededOne} − (${ob.bag1} + ${ob.bag2} + ${ob.bag3})</div>
              <div class="flex items-center gap-2">
                <span>${ob.neededOne} − </span>
                <input type="number" id="comb-r3-sum" class="w-20 p-1.5 text-center border-2 border-purple-300 rounded-lg" placeholder="Suma">
                <span>=</span>
                <input type="number" id="comb-r3-res1" class="w-24 p-1.5 text-center border-2 border-emerald-400 rounded-lg font-bold" placeholder="Faltan g">
              </div>
            </div>

            <!-- Caso B: Para hacer 2 masas -->
            <div class="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-2">
              <span class="text-xs font-black text-purple-900 block">B) ¿Y cuánta falta para hacer 2 masas base (${ob.neededTwo} g)?</span>
              <div class="text-xs font-bold text-slate-600">Operación: ${ob.neededTwo} − (${ob.bag1} + ${ob.bag2} + ${ob.bag3})</div>
              <div class="flex items-center gap-2">
                <span>${ob.neededTwo} − </span>
                <input type="number" id="comb-r3-sum2" class="w-20 p-1.5 text-center border-2 border-purple-300 rounded-lg" placeholder="Suma">
                <span>=</span>
                <input type="number" id="comb-r3-res2" class="w-24 p-1.5 text-center border-2 border-emerald-400 rounded-lg font-bold" placeholder="Faltan g">
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div id="comb-r3-fb" class="text-sm font-bold"></div>
            <button onclick="app.checkComb3()" class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar Harina Faltante
            </button>
          </div>
        </div>

        <!-- Reto 4: El Gran Saco Despensero (Conversión kg a g y Gastos) -->
        <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 text-lg flex items-center gap-2">
              <span>🌾</span> Reto 4: El Gran Saco Despensero (1 kg y 5 kg)
            </h3>
            <span class="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl font-black">Conversión kg a gramos</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Saco de 1 kg -->
            <div class="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
              <span class="text-xs font-black text-amber-900 block">Saco A: Paquete de 1 kg</span>
              <p class="text-xs text-slate-600">
                De 1 kg gasté <strong>${sack1.spentAlb} g</strong> para empanadillas y <strong>${sack1.spentBech} g</strong> para bechamel. ¿Cuánta harina quedará si luego preparo una masa base (<strong>${sack1.spentBase} g</strong>)?
              </p>
              <div class="text-xs font-bold text-amber-800">1 kg = 1.000 g</div>
              <div class="flex items-center gap-2 font-bold text-sm">
                <span>1.000 − (</span>
                <input type="number" id="comb-r4a-spent" class="w-20 p-1 text-center border-2 border-amber-300 rounded-lg bg-white" placeholder="Gasto">
                <span>) =</span>
                <input type="number" id="comb-r4a-res" class="w-24 p-1 text-center border-2 border-emerald-400 rounded-lg bg-white font-bold" placeholder="Queda g">
              </div>
            </div>

            <!-- Saco de 5 kg (Modelo A del Examen) -->
            <div class="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
              <span class="text-xs font-black text-emerald-900 block">Saco B: Gran Saco de 5 kg</span>
              <p class="text-xs text-slate-600">
                De 5 kg gasté <strong>${sack5.spentCake} g</strong> en magdalenas, <strong>${sack5.spentPancakes} g</strong> en tortitas y <strong>${sack5.spentSauce} g</strong> en crema. Después hago una masa base (<strong>${sack5.spentBase} g</strong>). ¿Cuánto queda?
              </p>
              <div class="text-xs font-bold text-emerald-800">5 kg = 5.000 g</div>
              <div class="flex items-center gap-2 font-bold text-sm">
                <span>5.000 − (</span>
                <input type="number" id="comb-r4b-spent" class="w-24 p-1 text-center border-2 border-emerald-300 rounded-lg bg-white" placeholder="Gasto total">
                <span>) =</span>
                <input type="number" id="comb-r4b-res" class="w-28 p-1 text-center border-2 border-emerald-400 rounded-lg bg-white font-bold" placeholder="Queda g">
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div id="comb-r4-fb" class="text-sm font-bold"></div>
            <button onclick="app.checkComb4()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar Sacos
            </button>
          </div>
        </div>
      </div>
    `;
  }

  checkComb1() {
    const sc = this.scenario;
    const r = MathUtils.parseNumber(getVal('comb-r1-res'));
    const fb = document.getElementById('comb-r1-fb');
    if (r === sc.baseTotalWeight) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Bravo! El peso entero de la masa base es ${sc.baseTotalWeight} g. ⭐`;
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Revisa la suma de los 4 ingredientes: debe dar ${sc.baseTotalWeight} g.`;
      if (window.sound) sound.playWrong();
    }
  }

  checkComb2() {
    const sc = this.scenario;
    const comp = sc.twoBasesVsOther;
    const s1 = MathUtils.parseNumber(getVal('comb-r2-step1'));
    const r = MathUtils.parseNumber(getVal('comb-r2-res'));
    const fb = document.getElementById('comb-r2-fb');

    const okStep = (s1 === comp.twoBasesWeight);
    const okRes = (r === comp.difference);

    if (okStep && okRes) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Genial! Dos lotes pesan ${comp.twoBasesWeight} g, que son ${comp.difference} g más que los ${comp.otherWeight} g. ⭐`;
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Dos lotes pesan ${comp.twoBasesWeight} g. Al restarle ${comp.otherWeight} g, la diferencia es ${comp.difference} g.`;
      if (window.sound) sound.playWrong();
    }
  }

  checkComb3() {
    const sc = this.scenario;
    const ob = sc.openBags;
    const totalHave = ob.bag1 + ob.bag2 + ob.bag3;

    const s1 = MathUtils.parseNumber(getVal('comb-r3-sum'));
    const r1 = MathUtils.parseNumber(getVal('comb-r3-res1'));
    const s2 = MathUtils.parseNumber(getVal('comb-r3-sum2'));
    const r2 = MathUtils.parseNumber(getVal('comb-r3-res2'));
    const fb = document.getElementById('comb-r3-fb');

    const okA = (s1 === totalHave && r1 === ob.missingOne);
    const okB = (s2 === totalHave && r2 === ob.missingTwo);

    if (okA && okB) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Impecable! Los 3 paquetes suman ${totalHave} g. Para 1 masa faltan ${ob.missingOne} g y para 2 masas faltan ${ob.missingTwo} g. ⭐⭐`;
      this.addStars(2);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Los paquetes abiertos suman ${totalHave} g (${ob.bag1} + ${ob.bag2} + ${ob.bag3}). Revisa las restas: ${ob.neededOne} − ${totalHave} y ${ob.neededTwo} − ${totalHave}.`;
      if (window.sound) sound.playWrong();
    }
  }

  checkComb4() {
    const sc = this.scenario;
    const s1 = sc.sack1kg;
    const s5 = sc.sack5kg;
    const totalSpent1 = s1.spentAlb + s1.spentBech + s1.spentBase;
    const totalSpent5 = s5.spentCake + s5.spentPancakes + s5.spentSauce + s5.spentBase;

    const uSpent1 = MathUtils.parseNumber(getVal('comb-r4a-spent'));
    const uRes1 = MathUtils.parseNumber(getVal('comb-r4a-res'));
    const uSpent5 = MathUtils.parseNumber(getVal('comb-r4b-spent'));
    const uRes5 = MathUtils.parseNumber(getVal('comb-r4b-res'));
    const fb = document.getElementById('comb-r4-fb');

    const ok1 = (uSpent1 === totalSpent1 && uRes1 === s1.remaining);
    const ok5 = (uSpent5 === totalSpent5 && uRes5 === s5.remaining);

    if (ok1 && ok5) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Sobresaliente! En el saco de 1 kg quedan ${s1.remaining} g y en el de 5 kg quedan ${s5.remaining} g. ⭐⭐`;
      this.addStars(2);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `En el saco 1: gasto total = ${totalSpent1} g, queda = ${s1.remaining} g. En el saco 2: gasto = ${totalSpent5} g, queda = ${s5.remaining} g.`;
      if (window.sound) sound.playWrong();
    }
  }

  // ===========================================================================
  // 3. MISIÓN ESTIMACIONES Y REDONDEOS (EJERCICIO 4 Y 5 DEL EXAMEN)
  // ===========================================================================
  renderEstimations() {
    const sc = this.scenario;
    const sp = sc.specialRecipes;
    const el = document.getElementById('estimations-container');
    if (!el) return;

    el.innerHTML = `
      <div class="space-y-6">
        <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200">
          <h3 class="font-black text-amber-900 text-base flex items-center gap-2">
            <span>📏</span> La Regla de Oro del Redondeo a las Centenas (4.º Primaria)
          </h3>
          <p class="text-sm text-slate-700 mt-1">
            Miramos la cifra de las <strong>decenas</strong>: si es <strong>5 o mayor</strong> (5, 6, 7, 8, 9), la centena <strong>sube a la siguiente</strong>. Si es <strong>menor que 5</strong> (0, 1, 2, 3, 4), la centena <strong>se mantiene</strong>.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Receta Especial A -->
          <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-black text-slate-800 text-base">${sp.specialA.name}</h4>
              <span class="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg font-bold">Especial A</span>
            </div>
            <ul class="text-xs text-slate-600 space-y-1">
              <li>• Masa base: <strong>${sc.baseTotalWeight} g</strong></li>
              <li>• ${sp.specialA.extra1.name}: <strong>${sp.specialA.extra1.weight} g</strong></li>
              <li>• ${sp.specialA.extra2.name}: <strong>${sp.specialA.extra2.weight} g</strong></li>
            </ul>
            <div class="pt-2 border-t border-slate-100 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span>Peso exacto:</span>
                <input type="number" id="est-a-exact" class="w-24 p-1 text-center border-2 border-slate-300 rounded-lg" placeholder="Exacto">
              </div>
              <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Peso estimado (a centenas):</span>
                <input type="number" id="est-a-approx" class="w-24 p-1 text-center border-2 border-amber-400 rounded-lg bg-amber-50 font-black" placeholder="Aprox.">
              </div>
            </div>
          </div>

          <!-- Receta Especial B -->
          <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="font-black text-slate-800 text-base">${sp.specialB.name}</h4>
              <span class="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-lg font-bold">Especial B</span>
            </div>
            <ul class="text-xs text-slate-600 space-y-1">
              <li>• Masa base: <strong>${sc.baseTotalWeight} g</strong></li>
              <li>• ${sp.specialB.extra1.name}: <strong>${sp.specialB.extra1.weight} g</strong></li>
              <li>• ${sp.specialB.extra2.name}: <strong>${sp.specialB.extra2.weight} g</strong></li>
            </ul>
            <div class="pt-2 border-t border-slate-100 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold">
                <span>Peso exacto:</span>
                <input type="number" id="est-b-exact" class="w-24 p-1 text-center border-2 border-slate-300 rounded-lg" placeholder="Exacto">
              </div>
              <div class="flex items-center justify-between text-xs font-bold text-purple-900">
                <span>Peso estimado (a centenas):</span>
                <input type="number" id="est-b-approx" class="w-24 p-1 text-center border-2 border-purple-400 rounded-lg bg-purple-50 font-black" placeholder="Aprox.">
              </div>
            </div>
          </div>
        </div>

        <!-- Preguntas de comparación estimando -->
        <div class="p-5 bg-white rounded-2xl border-2 border-amber-200 shadow-sm space-y-4">
          <h4 class="font-black text-slate-800 text-base">Contesta realizando estimaciones a las centenas:</h4>
          
          <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <p class="text-sm text-slate-700">
              1. ¿Cuánto pesa una <strong>${sp.comparison1.targetName} de ${sp.comparison1.targetWeight} g</strong> de menos frente al <strong>${sp.specialA.name}</strong>, aproximadamente?
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500">Diferencia estimada:</span>
              <input type="number" id="est-comp1-res" class="w-28 p-1.5 text-center border-2 border-amber-400 rounded-lg font-black" placeholder="Aprox. g">
            </div>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl space-y-2">
            <p class="text-sm text-slate-700">
              2. ¿Y cuánto pesa un <strong>${sp.comparison2.targetName} de ${sp.comparison2.targetWeight} g</strong> de más frente a la <strong>${sp.specialB.name}</strong>, aproximadamente?
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-slate-500">Diferencia estimada:</span>
              <input type="number" id="est-comp2-res" class="w-28 p-1.5 text-center border-2 border-purple-400 rounded-lg font-black" placeholder="Aprox. g">
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <div id="est-feedback" class="text-sm font-bold"></div>
            <button onclick="app.checkEstimations()" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar Estimaciones
            </button>
          </div>
        </div>
      </div>
    `;
  }

  checkEstimations() {
    const sc = this.scenario;
    const sp = sc.specialRecipes;

    const uExA = MathUtils.parseNumber(getVal('est-a-exact'));
    const uApA = MathUtils.parseNumber(getVal('est-a-approx'));
    const uExB = MathUtils.parseNumber(getVal('est-b-exact'));
    const uApB = MathUtils.parseNumber(getVal('est-b-approx'));

    const uC1 = MathUtils.parseNumber(getVal('est-comp1-res'));
    const uC2 = MathUtils.parseNumber(getVal('est-comp2-res'));
    const fb = document.getElementById('est-feedback');

    const okA = (uExA === sp.specialA.exactWeight && uApA === sp.specialA.approxWeightHundreds);
    const okB = (uExB === sp.specialB.exactWeight && uApB === sp.specialB.approxWeightHundreds);
    const okC1 = (uC1 === sp.comparison1.approxDiff);
    const okC2 = (uC2 === sp.comparison2.approxDiff);

    let count = 0;
    if (okA) count++;
    if (okB) count++;
    if (okC1) count++;
    if (okC2) count++;

    if (count === 4) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Puntería matemática perfecta! Todas las estimaciones y pesos exactos están correctos. ⭐⭐`;
      this.addStars(2);
    } else {
      fb.className = "text-sm font-bold text-amber-700";
      fb.textContent = `Llevas ${count} de 4 comprobaciones correctas. Recuerda redondear a la centena más cercana (por ejemplo ${sp.specialA.exactWeight} g se redondea a ${sp.specialA.approxWeightHundreds} g).`;
      if (window.sound) sound.playWrong();
    }
  }

  // ===========================================================================
  // 4. MISIÓN DETECTIVE (ASOCIAR EXPRESIONES Y PRUEBA DE LA RESTA)
  // ===========================================================================
  renderDetective() {
    const container = document.getElementById('detective-container');
    if (!container) return;

    container.innerHTML = MathData.detectiveChallenges.map((ch, idx) => `
      <div class="p-5 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="font-black text-slate-800 text-lg">${ch.title}</h3>
          <span class="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-xl font-black">Modelo A</span>
        </div>

        ${ch.expression ? `
          <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-center">
            <span class="text-xs text-indigo-800 font-bold block mb-1">Operación Combinada:</span>
            <span class="text-2xl font-black font-mono text-indigo-950">${ch.expression}</span>
          </div>
        ` : ''}

        <p class="text-sm font-bold text-slate-700">${ch.question}</p>

        ${ch.options ? `
          <div class="space-y-2">
            ${ch.options.map((opt, oIdx) => `
              <label class="flex items-start gap-3 p-3 rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition">
                <input type="radio" name="det-opt-${idx}" value="${oIdx}" class="mt-1 w-4 h-4 text-indigo-600">
                <span class="text-xs md:text-sm text-slate-700">${opt.text}</span>
              </label>
            `).join('')}
          </div>
          <div class="flex items-center justify-between pt-2">
            <div id="det-fb-${idx}" class="text-sm font-bold"></div>
            <button onclick="app.checkDetectiveOption(${idx})" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar Enigma
            </button>
          </div>
        ` : ''}

        ${ch.formula ? `
          <div class="p-3 bg-amber-50 rounded-xl text-xs font-bold text-amber-900">
            📌 Fórmula: <strong>${ch.formula}</strong> | ${ch.hint}
          </div>
          <div class="flex items-center gap-3 font-bold text-sm">
            <span>Respuesta:</span>
            <input type="number" id="det-math-input-${idx}" class="w-32 p-2 text-center border-2 border-indigo-300 rounded-xl font-bold" placeholder="Tu número">
            <button onclick="app.checkDetectiveMath(${idx})" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-sm transition">
              Comprobar
            </button>
          </div>
          <div id="det-fb-${idx}" class="text-sm font-bold"></div>
        ` : ''}
      </div>
    `).join('');
  }

  checkDetectiveOption(chIdx) {
    const ch = MathData.detectiveChallenges[chIdx];
    const radios = document.getElementsByName(`det-opt-${chIdx}`);
    let selected = -1;
    for (let r of radios) {
      if (r.checked) {
        selected = parseInt(r.value, 10);
        break;
      }
    }
    const fb = document.getElementById(`det-fb-${chIdx}`);
    if (selected === -1) {
      fb.className = "text-sm font-bold text-amber-600";
      fb.textContent = "Elige una opción antes de comprobar.";
      return;
    }

    const opt = ch.options[selected];
    if (opt.isCorrect) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = opt.explanation + " ⭐";
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = opt.explanation;
      if (window.sound) sound.playWrong();
    }
  }

  checkDetectiveMath(chIdx) {
    const ch = MathData.detectiveChallenges[chIdx];
    const val = MathUtils.parseNumber(getVal(`det-math-input-${chIdx}`));
    const fb = document.getElementById(`det-fb-${chIdx}`);

    const expected = ch.minuendoExpected || ch.sustraendoExpected;
    if (val === expected) {
      fb.className = "text-sm font-bold text-emerald-600";
      fb.textContent = `¡Resuelto como una auténtica detective de números! El valor exacto es ${expected}. ⭐`;
      this.addStars(1);
    } else {
      fb.className = "text-sm font-bold text-rose-600";
      fb.textContent = `Piénsalo de nuevo: ${ch.hint} (Resultado esperado: ${expected}).`;
      if (window.sound) sound.playWrong();
    }
  }

  // ===========================================================================
  // 5. LABORATORIO BALANZA INTERACTIVA
  // ===========================================================================
  resetBalance() {
    this.balancePanLeft = [];
    this.balancePanRight = [];
    this.updateBalanceUI();
  }

  addToBalance(side, name, weight, icon) {
    const item = { name, weight, icon, id: Date.now() + Math.random() };
    if (side === 'left') {
      this.balancePanLeft.push(item);
    } else {
      this.balancePanRight.push(item);
    }
    if (window.sound) sound.playPop();
    this.updateBalanceUI();
  }

  removeFromBalance(side, id) {
    if (side === 'left') {
      this.balancePanLeft = this.balancePanLeft.filter(x => x.id !== id);
    } else {
      this.balancePanRight = this.balancePanRight.filter(x => x.id !== id);
    }
    this.updateBalanceUI();
  }

  updateBalanceUI() {
    const leftList = document.getElementById('balance-left-items');
    const rightList = document.getElementById('balance-right-items');
    const leftWeightEl = document.getElementById('balance-left-weight');
    const rightWeightEl = document.getElementById('balance-right-weight');
    const armEl = document.getElementById('balance-arm-indicator');
    const statusEl = document.getElementById('balance-status-badge');

    const totalL = this.balancePanLeft.reduce((acc, c) => acc + c.weight, 0);
    const totalR = this.balancePanRight.reduce((acc, c) => acc + c.weight, 0);

    if (leftWeightEl) leftWeightEl.textContent = `${totalL} g`;
    if (rightWeightEl) rightWeightEl.textContent = `${totalR} g`;

    if (leftList) {
      leftList.innerHTML = this.balancePanLeft.map(it => `
        <span onclick="app.removeFromBalance('left', ${it.id})" class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-rose-100 text-amber-900 hover:text-rose-900 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs" title="Toca para quitar">
          ${it.icon} ${it.name} (${it.weight}g) ✕
        </span>
      `).join('') || '<span class="text-xs text-slate-400 italic">Plato vacío</span>';
    }

    if (rightList) {
      rightList.innerHTML = this.balancePanRight.map(it => `
        <span onclick="app.removeFromBalance('right', ${it.id})" class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 hover:bg-rose-100 text-blue-900 hover:text-rose-900 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs" title="Toca para quitar">
          ${it.icon} ${it.name} (${it.weight}g) ✕
        </span>
      `).join('') || '<span class="text-xs text-slate-400 italic">Plato vacío</span>';
    }

    if (armEl && statusEl) {
      armEl.classList.remove('tilt-left', 'tilt-right', 'balanced');
      if (totalL === 0 && totalR === 0) {
        statusEl.className = "px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-600";
        statusEl.textContent = "Balanza Vacía";
      } else if (totalL === totalR) {
        armEl.classList.add('balanced');
        statusEl.className = "px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 animate-pop-success";
        statusEl.textContent = "⚖️ ¡Perfecto Equilibrio! (Propiedad Demostrada)";
        if (window.sound) sound.playBalance();
      } else if (totalL > totalR) {
        armEl.classList.add('tilt-left');
        statusEl.className = "px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800";
        statusEl.textContent = `Pesa más el lado izquierdo (+${totalL - totalR} g)`;
      } else {
        armEl.classList.add('tilt-right');
        statusEl.className = "px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800";
        statusEl.textContent = `Pesa más el lado derecho (+${totalR - totalL} g)`;
      }
    }
  }

  // Carga una demostración de conmutativa en la balanza
  loadCommutativeDemo() {
    this.resetBalance();
    const sc = this.scenario;
    const h = sc.ingredients.harina;
    const a = sc.ingredients.azucar;

    // Lado izquierdo: Harina + Azúcar
    this.addToBalance('left', h.name, h.weight, h.icon);
    this.addToBalance('left', a.name, a.weight, a.icon);

    // Lado derecho: Azúcar + Harina (orden inverso)
    this.addToBalance('right', a.name, a.weight, a.icon);
    this.addToBalance('right', h.name, h.weight, h.icon);
  }

  // ===========================================================================
  // 6. DESAFÍO EXPRESS (QUIZ SOBRE 10)
  // ===========================================================================
  startExpressQuiz() {
    // Tomar 10 preguntas aleatorias del pool
    const shuffled = [...MathData.expressQuizPool].sort(() => 0.5 - Math.random());
    this.quizQuestions = shuffled.slice(0, 10);
    this.quizCurrentIndex = 0;
    this.quizScore = 0;
    this.quizAnswers = [];
    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const container = document.getElementById('quiz-dynamic-card');
    if (!container) return;

    if (this.quizCurrentIndex >= this.quizQuestions.length) {
      this.renderQuizResults();
      return;
    }

    const q = this.quizQuestions[this.quizCurrentIndex];
    const qNum = this.quizCurrentIndex + 1;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between text-xs font-black text-slate-500">
          <span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg">Tema: ${q.topic}</span>
          <span>Pregunta ${qNum} de 10</span>
        </div>

        <div class="w-full bg-slate-100 rounded-full h-2">
          <div class="bg-amber-500 h-2 rounded-full transition-all duration-300" style="width: ${(qNum / 10) * 100}%"></div>
        </div>

        <h3 class="text-base md:text-lg font-black text-slate-800 leading-snug">${q.question}</h3>

        <div class="space-y-2 pt-2">
          ${q.options.map((opt, idx) => `
            <button onclick="app.selectQuizAnswer(${idx})" class="w-full text-left p-3.5 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-slate-800 font-bold text-sm transition flex items-center justify-between group">
              <span>${opt}</span>
              <span class="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-white">
                ${String.fromCharCode(65 + idx)}
              </span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (window.sound && window.sound.voiceEnabled) {
      sound.speakText(q.question);
    }
  }

  selectQuizAnswer(optIdx) {
    const q = this.quizQuestions[this.quizCurrentIndex];
    const isCorrect = (optIdx === q.answer);
    if (isCorrect) {
      this.quizScore++;
      if (window.sound) sound.playCorrect();
    } else {
      if (window.sound) sound.playWrong();
    }

    this.quizAnswers.push({
      question: q.question,
      chosen: q.options[optIdx],
      correct: q.options[q.answer],
      isCorrect,
      explanation: q.explanation
    });

    this.quizCurrentIndex++;
    this.renderQuizQuestion();
  }

  renderQuizResults() {
    const container = document.getElementById('quiz-dynamic-card');
    if (!container) return;

    const score = this.quizScore;
    const isMaster = score >= 9;
    if (isMaster && typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      if (window.sound) sound.playFanfare();
    }

    this.addStars(score);

    container.innerHTML = `
      <div class="text-center space-y-4 py-4">
        <div class="text-5xl">${isMaster ? '🏆' : (score >= 6 ? '👏' : '💪')}</div>
        <h3 class="text-2xl font-black font-display text-slate-800">
          ${isMaster ? '¡Extraordinario, Olivia!' : (score >= 6 ? '¡Buen trabajo, Olivia!' : '¡A seguir practicando!')}
        </h3>
        <div class="text-4xl font-black text-amber-600 font-display">
          ${score} / 10
        </div>
        <p class="text-sm text-slate-600 max-w-md mx-auto">
          ${isMaster ? 'Has demostrado dominar a la perfección las propiedades de la suma, las operaciones combinadas y las estimaciones del Tema 2.' : 'Has repasado muy bien. Revisa a continuación cada pregunta para consolidar todos los conceptos.'}
        </p>

        <div class="pt-4 flex justify-center gap-3">
          <button onclick="app.startExpressQuiz()" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm shadow-md transition">
            🔄 Repetir Desafío
          </button>
          <button onclick="app.navigate('diploma')" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm shadow-md transition">
            🎓 Ver Mi Diploma
          </button>
        </div>

        <!-- Revisión de respuestas -->
        <div class="text-left space-y-3 pt-6 border-t border-slate-200">
          <h4 class="font-black text-slate-800 text-sm">Revisión de Preguntas:</h4>
          ${this.quizAnswers.map((ans, idx) => `
            <div class="p-3 rounded-xl border ${ans.isCorrect ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/50'} text-xs space-y-1">
              <div class="font-bold text-slate-800">${idx + 1}. ${ans.question}</div>
              <div class="${ans.isCorrect ? 'text-emerald-700' : 'text-rose-700'} font-black">
                Tu respuesta: ${ans.chosen} ${ans.isCorrect ? '✓' : '✗'}
              </div>
              ${!ans.isCorrect ? `<div class="text-slate-600">Correcta: <strong>${ans.correct}</strong></div>` : ''}
              <div class="text-slate-500 italic mt-0.5">${ans.explanation}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ===========================================================================
  // 7. ARCADE DEL CHEF REPOSTERO (CÁLCULO RÁPIDO)
  // ===========================================================================
  startArcade() {
    this.arcadeScore = 0;
    this.arcadeStreak = 0;
    this.nextArcadeQuestion();
  }

  nextArcadeQuestion() {
    const ch = MathUtils.randomChoice(MathData.arcadeChallenges);
    this.arcadeCurrent = ch;
    this.renderArcadeCard();
  }

  renderArcadeCard() {
    const el = document.getElementById('arcade-card-content');
    if (!el || !this.arcadeCurrent) return;

    const ch = this.arcadeCurrent;
    const streakEl = document.getElementById('arcade-streak');
    if (streakEl) streakEl.textContent = this.arcadeStreak;

    el.innerHTML = `
      <div class="text-center space-y-4">
        <span class="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
          Racha actual: ${this.arcadeStreak} 🔥
        </span>
        <div class="text-2xl md:text-3xl font-black font-display text-slate-900 py-3">
          ${ch.q}
        </div>

        ${ch.options ? `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            ${ch.options.map(opt => `
              <button onclick="app.submitArcadeOption('${opt}')" class="p-3 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-500 hover:bg-amber-50 font-black text-sm text-slate-800 transition shadow-2xs">
                ${opt}
              </button>
            `).join('')}
          </div>
        ` : `
          <div class="flex items-center justify-center gap-2">
            <input type="number" id="arcade-input" class="w-32 p-3 text-center border-2 border-amber-400 rounded-2xl text-xl font-black shadow-inner" placeholder="?" autofocus>
            <button onclick="app.submitArcadeInput()" class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-sm shadow-md transition">
              ¡Listo!
            </button>
          </div>
        `}

        <div id="arcade-feedback" class="text-sm font-bold min-h-[24px]"></div>
      </div>
    `;

    const inp = document.getElementById('arcade-input');
    if (inp) {
      inp.focus();
      inp.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') this.submitArcadeInput();
      });
    }
  }

  submitArcadeOption(opt) {
    const isOk = (opt === this.arcadeCurrent.answer);
    this.handleArcadeResult(isOk);
  }

  submitArcadeInput() {
    const val = MathUtils.parseNumber(getVal('arcade-input'));
    const isOk = (val === this.arcadeCurrent.answer);
    this.handleArcadeResult(isOk);
  }

  handleArcadeResult(isOk) {
    const fb = document.getElementById('arcade-feedback');
    if (isOk) {
      this.arcadeStreak++;
      this.arcadeScore += 10;
      this.addStars(1);
      if (fb) {
        fb.className = "text-sm font-bold text-emerald-600";
        fb.textContent = "¡Rápido y perfecto! +10 puntos ⭐";
      }
      setTimeout(() => this.nextArcadeQuestion(), 600);
    } else {
      this.arcadeStreak = 0;
      if (fb) {
        fb.className = "text-sm font-bold text-rose-600";
        fb.textContent = `¡Casi! La respuesta correcta era ${this.arcadeCurrent.answer}. ¡Ánimo!`;
      }
      if (window.sound) sound.playWrong();
      setTimeout(() => this.nextArcadeQuestion(), 1200);
    }
  }

  // ===========================================================================
  // NAVEGACIÓN ENTRE PESTAÑAS
  // ===========================================================================
  navigate(tab) {
    this.currentTab = tab;
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));

    // Mostrar activa
    const activeView = document.getElementById(`view-${tab}`);
    if (activeView) activeView.classList.remove('hidden');

    // Actualizar botones de navegación
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === tab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (tab === 'detective') {
      this.renderDetective();
    } else if (tab === 'express') {
      this.startExpressQuiz();
    } else if (tab === 'arcade') {
      this.startArcade();
    } else if (tab === 'diploma') {
      this.renderDiploma();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderDiploma() {
    const nameEl = document.getElementById('diploma-name');
    const dateEl = document.getElementById('diploma-date');
    const starsEl = document.getElementById('diploma-stars');
    if (nameEl) nameEl.textContent = this.studentName;
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (starsEl) starsEl.textContent = this.stars;
  }

  bindEvents() {
    // Botones de pestañas
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        if (target) this.navigate(target);
      });
    });

    // Botón de sonido
    const sBtn = document.getElementById('toggle-sound-btn');
    if (sBtn) {
      sBtn.addEventListener('click', () => {
        const enabled = sound.toggleSound();
        sBtn.textContent = enabled ? '🔊' : '🔇';
      });
    }

    // Botón de voz
    const vBtn = document.getElementById('toggle-voice-btn');
    if (vBtn) {
      vBtn.addEventListener('click', () => {
        const enabled = sound.toggleVoice();
        vBtn.textContent = enabled ? '🗣️' : '🤐';
      });
    }
  }
}

// Inicialización global
window.addEventListener('DOMContentLoaded', () => {
  window.app = new MathAppTema2();
});

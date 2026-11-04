// =============================================================================
// UTILIDADES MATEMÁTICAS · TEMA 2 (4.º DE PRIMARIA)
// Operaciones con números naturales, propiedades, estimaciones y validación
// =============================================================================

const MathUtils = {
  // Limpia y extrae un entero a partir de cualquier texto escrito por el alumno
  parseNumber(input) {
    if (typeof input === 'number') return isNaN(input) ? null : input;
    if (!input) return null;
    // Eliminar 'g', 'kg', espacios, puntos de miles
    let cleaned = input.toString()
      .replace(/kg/gi, '')
      .replace(/g/gi, '')
      .replace(/\./g, '')
      .replace(/\s+/g, '')
      .trim();
    if (cleaned === '') return null;
    const n = parseInt(cleaned, 10);
    return isNaN(n) ? null : n;
  },

  // Formato español de número con puntos de miles (ej: 1250 -> "1.250")
  formatNumber(n) {
    if (n === null || n === undefined || isNaN(n)) return '';
    return n.toLocaleString('es-ES');
  },

  // Formato en gramos: "915 g", "1.250 g"
  formatGrams(n) {
    return `${this.formatNumber(n)} g`;
  },

  // Normalizar cadenas para comprobaciones semánticas y texto libre
  normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita tildes
      .replace(/[.,;:()\-–—_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Redondeo de 4º de primaria (a decenas, centenas o millares)
  // Regla del 5: si la cifra del orden inferior es >= 5, redondea hacia arriba; si es < 5, mantiene
  roundTo(number, order = 100) {
    if (number === null || isNaN(number)) return 0;
    return Math.round(number / order) * order;
  },

  // Estimación de una suma: redondea cada sumando y los suma
  estimateSum(numbers, order = 100) {
    return numbers.reduce((acc, curr) => acc + this.roundTo(curr, order), 0);
  },

  // Estimación de una resta: redondea minuendo y sustraendo y los resta
  estimateDiff(minuend, subtrahend, order = 100) {
    return this.roundTo(minuend, order) - this.roundTo(subtrahend, order);
  },

  // Comprueba si una respuesta de conmutativa es válida
  // Para a + b: el estudiante debe escribir en el otro lado b + a y el resultado (a + b)
  validateCommutative(a, b, userLeft, userRight, userResult) {
    const numLeft = this.parseNumber(userLeft);
    const numRight = this.parseNumber(userRight);
    const numRes = this.parseNumber(userResult);

    const expectedSum = a + b;
    const isSumCorrect = numRes === expectedSum;

    // El orden conmutado debe ser b + a
    const isOrderSwapped = (numLeft === b && numRight === a);
    const isOrderOriginal = (numLeft === a && numRight === b);

    return {
      success: isSumCorrect && isOrderSwapped,
      isSumCorrect,
      isOrderSwapped,
      isOrderOriginal,
      expectedLeft: b,
      expectedRight: a,
      expectedSum
    };
  },

  // Comprueba la propiedad asociativa:
  // Caso A: a + (b + c) = (a + b) + c  o viceversa
  validateAssociativeStep({ a, b, c, isLeftGrouped, userStepIntermediate, userStepFinal, userFinalTotal }) {
    const total = a + b + c;
    const interExpected = isLeftGrouped ? (a + b) : (b + c);
    const singleExpected = isLeftGrouped ? c : a;

    const uInter = this.parseNumber(userStepIntermediate);
    const uSingle = this.parseNumber(userStepFinal);
    const uTotal = this.parseNumber(userFinalTotal);

    const success = (uInter === interExpected) &&
                    (uSingle === singleExpected) &&
                    (uTotal === total);

    return {
      success,
      interExpected,
      singleExpected,
      total,
      uInter,
      uSingle,
      uTotal
    };
  },

  // Evalúa de manera segura una operación combinada de enteros simples con sumas, restas y paréntesis
  // Ejemplos: "5000 - (1257 + 245 + 80 + 500)", "1258 - (861 + 300)"
  safeEvalCombined(exprStr) {
    if (!exprStr) return null;
    let s = exprStr.replace(/g/gi, '').replace(/\./g, '').replace(/\s+/g, '');
    // Verificar que solo contiene dígitos, +, -, (, )
    if (!/^[\d\+\-\(\)]+$/.test(s)) return null;

    try {
      // Usar Function con parseo seguro de solo números y operadores
      // Para evitar vulnerabilidades de eval, validamos con estricta regex
      const fn = new Function(`'use strict'; return (${s});`);
      const val = fn();
      return typeof val === 'number' && !isNaN(val) ? val : null;
    } catch (e) {
      return null;
    }
  },

  // Comprobar la prueba de la resta: Minuendo = Sustraendo + Diferencia
  validateSubtractionProof(minuend, subtrahend, diff) {
    const m = this.parseNumber(minuend);
    const s = this.parseNumber(subtrahend);
    const d = this.parseNumber(diff);

    if (m === null || s === null || d === null) return { valid: false };

    const mathOk = (m - s === d);
    const proofOk = (s + d === m);

    return {
      valid: mathOk && proofOk,
      mathOk,
      proofOk,
      expectedMinuend: s + d
    };
  },

  // Generador de números aleatorios en rango inclusive
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathUtils;
}

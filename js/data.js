// =============================================================================
// BANCO DE DATOS, CASUÍSTICAS Y GUÍA DE ESTUDIO · TEMA 2 MATEMÁTICAS 4.º
// La Suma y la Resta: Propiedades, Operaciones Combinadas, Estimación y Problemas
// =============================================================================

const MathData = {
  // ---------------------------------------------------------------------------
  // 1. ESCENARIOS TEMÁTICOS CURADOS (VARIEDAD RICA, CONCEPTOS ANÁLOGOS AL EXAMEN)
  // ---------------------------------------------------------------------------
  scenarios: [
    {
      id: "obrador_reposteria",
      name: "🧁 Aventura 1: El Gran Obrador de Repostería Creativa",
      badge: "Recomendado",
      themeColor: "amber",
      icon: "🧁",
      description: "Prepara masas para bizcochos esponjosos, mezcla ingredientes aromáticos y calcula el peso de deliciosos pasteles artesanos.",
      contextTitle: "INGREDIENTES DE LA MASA BASE PARA UN BIZCOCHO ARTESANO:",
      baseUnit: "g",
      ingredients: {
        harina: { name: "Harina de repostería", weight: 450, icon: "🌾" },
        azucar: { name: "Azúcar moreno", weight: 280, icon: "🍬" },
        levadura: { name: "Levadura en polvo", weight: 16, icon: "✨" },
        mantequilla: { name: "Mantequilla artesana", weight: 120, icon: "🧈" }
      },
      // Peso total masa base = 450 + 280 + 16 + 120 = 866 g
      baseTotalWeight: 866,

      // Ingredientes adicionales para combinar
      extraIngredients: [
        { id: "cacao", name: "Cacao puro en polvo", weight: 45, icon: "🍫" },
        { id: "pepitas", name: "Pepitas de chocolate con leche", weight: 75, icon: "🍪" },
        { id: "nueces", name: "Nueces picadas de California", weight: 90, icon: "🥜" },
        { id: "vainilla", name: "Esencia aromática de vainilla", weight: 14, icon: "🍯" }
      ],

      // Problemas de harina abierta (Concepto del examen con números diferentes)
      openBags: {
        bag1: 145,
        bag2: 210,
        bag3: 85,
        // Total que tiene = 145 + 210 + 85 = 440 g
        // Harina necesaria para 1 bizcocho = 450 g -> Le faltan 450 - 440 = 10 g
        neededOne: 450,
        missingOne: 10,
        // Para 2 bizcochos = 900 g -> Le faltan 900 - 440 = 460 g
        neededTwo: 900,
        missingTwo: 460
      },

      // Gastos del saco despensero (1 kg y 5 kg)
      sack1kg: {
        totalGrams: 1000,
        spentAlb: 65,    // gastó en empanadillas
        spentBech: 95,   // gastó en bechamel
        spentBase: 450,  // masa base
        // Total gastado = 65 + 95 + 450 = 610 g
        // Restante = 1000 - 610 = 390 g
        remaining: 390
      },
      sack5kg: {
        totalGrams: 5000,
        spentCake: 1140, // en magdalenas caseras
        spentPancakes: 380, // en tortitas
        spentSauce: 75,     // en crema pastelera
        spentBase: 450,     // masa base
        // Total gastado = 1140 + 380 + 75 + 450 = 2045 g
        // Restante = 5000 - 2045 = 2955 g
        remaining: 2955
      },

      // Comparaciones de panes/bizcochos
      twoBasesVsOther: {
        otherName: "Bizcocho rústico de avena integral",
        otherWeight: 980,
        // 2 masas base = 866 + 866 = 1732 g
        // Diferencia = 1732 - 980 = 752 g
        twoBasesWeight: 1732,
        difference: 752
      },

      // Recetas especiales para estimaciones y redondeos
      specialRecipes: {
        specialA: {
          name: "Bizcocho Bombón de Chocolate",
          extra1: { name: "Pepitas de chocolate", weight: 75 },
          extra2: { name: "Cacao puro en polvo", weight: 45 },
          // Total exacto: 866 + 75 + 45 = 986 g
          exactWeight: 986,
          // Redondeado a centenas: 900 + 100 + 0 (o 870 + 80 + 50)
          approxWeightHundreds: 1000 // 900 + 100 + 0 = 1000
        },
        specialB: {
          name: "Tarta Campestre de Nueces y Miel",
          extra1: { name: "Nueces picadas", weight: 90 },
          extra2: { name: "Miel pura de azahar", weight: 115 },
          // Total exacto: 866 + 90 + 115 = 1071 g
          exactWeight: 1071,
          approxWeightHundreds: 1100
        },
        comparison1: {
          targetName: "Torta Glaseada de Frutas",
          targetWeight: 720,
          // ¿Cuánto pesa de menos frente a Bizcocho Bombón (exacto 986, aprox 1000 - 700 = 300 g)?
          approxDiff: 300
        },
        comparison2: {
          targetName: "Pastel Nupcial Imperial",
          targetWeight: 1500,
          // ¿Cuánto pesa de más frente a Tarta Campestre (aprox 1500 - 1100 = 400 g)?
          approxDiff: 400
        }
      }
    },

    {
      id: "pizzeria_italiana",
      name: "🍕 Aventura 2: La Pizzería Artesana de la Nonna",
      badge: "Sabor Tradicional",
      themeColor: "emerald",
      icon: "🍕",
      description: "Elabora la auténtica masa napolitana crujiente, distribuye ingredientes mediterráneos y calcula horneadas de pizzas.",
      contextTitle: "INGREDIENTES DE LA MASA BASE PARA UNA PIZZA MEDIANA:",
      baseUnit: "g",
      ingredients: {
        harina: { name: "Harina de fuerza italiana", weight: 400, icon: "🌾" },
        azucar: { name: "Agua tibia de manantial", weight: 260, icon: "💧" },
        levadura: { name: "Levadura fresca prensada", weight: 12, icon: "✨" },
        mantequilla: { name: "Aceite de oliva virgen extra", weight: 28, icon: "🫒" }
      },
      // Total base: 400 + 260 + 12 + 28 = 700 g
      baseTotalWeight: 700,

      extraIngredients: [
        { id: "tomate", name: "Salsa de tomate casera", weight: 140, icon: "🍅" },
        { id: "mozzarella", name: "Mozzarella di bufala rallada", weight: 180, icon: "🧀" },
        { id: "jamon", name: "Jamón cocido en taquitos", weight: 85, icon: "🥓" },
        { id: "champinon", name: "Champiñones laminados", weight: 70, icon: "🍄" }
      ],

      openBags: {
        bag1: 150,
        bag2: 175,
        bag3: 45,
        // Total = 150 + 175 + 45 = 370 g
        neededOne: 400,
        missingOne: 30, // 400 - 370 = 30
        neededTwo: 800,
        missingTwo: 430 // 800 - 370 = 430
      },

      sack1kg: {
        totalGrams: 1000,
        spentAlb: 80,   // para masa de focaccia
        spentBech: 120, // para bechamel de lasaña
        spentBase: 400, // masa pizza
        // Total gastado: 80 + 120 + 400 = 600 g
        // Restante: 1000 - 600 = 400 g
        remaining: 400
      },
      sack5kg: {
        totalGrams: 5000,
        spentCake: 1280, // calzones
        spentPancakes: 320, // masa de panecillos
        spentSauce: 90,     // espesar caldos
        spentBase: 400,     // masa base
        // Total = 1280 + 320 + 90 + 400 = 2090 g
        // Restante = 5000 - 2090 = 2910 g
        remaining: 2910
      },

      twoBasesVsOther: {
        otherName: "Calzone Relleno Familiar",
        otherWeight: 890,
        // 2 bases = 700 + 700 = 1400 g
        // Diferencia = 1400 - 890 = 510 g
        twoBasesWeight: 1400,
        difference: 510
      },

      specialRecipes: {
        specialA: {
          name: "Pizza Margarita Suprema",
          extra1: { name: "Salsa de tomate casera", weight: 140 },
          extra2: { name: "Mozzarella di bufala", weight: 180 },
          // Total exacto: 700 + 140 + 180 = 1020 g
          exactWeight: 1020,
          approxWeightHundreds: 1000
        },
        specialB: {
          name: "Pizza Capricciosa",
          extra1: { name: "Jamón en taquitos", weight: 85 },
          extra2: { name: "Champiñones frescos", weight: 70 },
          // Total exacto: 700 + 85 + 70 = 855 g
          exactWeight: 855,
          approxWeightHundreds: 900
        },
        comparison1: {
          targetName: "Focaccia al Romero",
          targetWeight: 610,
          // Aprox frente a Margarita (1000 - 600 = 400 g)
          approxDiff: 400
        },
        comparison2: {
          targetName: "Pizza Metro Familiar",
          targetWeight: 1400,
          // Aprox frente a Capricciosa (1400 - 900 = 500 g)
          approxDiff: 500
        }
      }
    },

    {
      id: "alquimia_ciencia",
      name: "🧪 Aventura 3: El Laboratorio Alquímico de Pociones",
      badge: "Mágico y Científico",
      themeColor: "purple",
      icon: "🧪",
      description: "Formula pócimas brillantes, pesa polvos mágicos en balanzas de precisión y calcula las mezclas del gran mago.",
      contextTitle: "INGREDIENTES DE LA FÓRMULA BASE PARA UN ELIXIR LUMINOSO:",
      baseUnit: "g",
      ingredients: {
        harina: { name: "Polvo de hojas lunares", weight: 360, icon: "🍃" },
        azucar: { name: "Agua de manantial cristalino", weight: 320, icon: "💧" },
        levadura: { name: "Cristales de roca brillante", weight: 18, icon: "💎" },
        mantequilla: { name: "Esencia de flores doradas", weight: 22, icon: "🌸" }
      },
      // Total base: 360 + 320 + 18 + 22 = 720 g
      baseTotalWeight: 720,

      extraIngredients: [
        { id: "raiz", name: "Raíz de mandrágora molida", weight: 65, icon: "🪴" },
        { id: "ambar", name: "Gotas de ámbar del bosque", weight: 45, icon: "🍯" },
        { id: "estrella", name: "Polvo de cometa fugaz", weight: 110, icon: "⭐" },
        { id: "escamas", name: "Escamas de dragón marino", weight: 30, icon: "🐉" }
      ],

      openBags: {
        bag1: 120,
        bag2: 165,
        bag3: 50,
        // Total = 120 + 165 + 50 = 335 g
        neededOne: 360,
        missingOne: 25, // 360 - 335 = 25
        neededTwo: 720,
        missingTwo: 385 // 720 - 335 = 385
      },

      sack1kg: {
        totalGrams: 1000,
        spentAlb: 90,   // para poción de sueño
        spentBech: 110, // para ungüento brillante
        spentBase: 360, // fórmula base
        // Total gastado: 90 + 110 + 360 = 560 g
        // Restante: 1000 - 560 = 440 g
        remaining: 440
      },
      sack5kg: {
        totalGrams: 5000,
        spentCake: 1350,
        spentPancakes: 290,
        spentSauce: 80,
        spentBase: 360,
        // Total = 1350 + 290 + 80 + 360 = 2080 g
        // Restante = 5000 - 2080 = 2920 g
        remaining: 2920
      },

      twoBasesVsOther: {
        otherName: "Brebaje Concentrado de las Sombras",
        otherWeight: 950,
        // 2 bases = 720 + 720 = 1440 g
        // Diferencia = 1440 - 950 = 490 g
        twoBasesWeight: 1440,
        difference: 490
      },

      specialRecipes: {
        specialA: {
          name: "Poción de la Vista de Águila",
          extra1: { name: "Raíz de mandrágora", weight: 65 },
          extra2: { name: "Polvo de cometa", weight: 110 },
          // Total exacto: 720 + 65 + 110 = 895 g
          exactWeight: 895,
          approxWeightHundreds: 900
        },
        specialB: {
          name: "Elixir del Aliento de Dragón",
          extra1: { name: "Gotas de ámbar", weight: 45 },
          extra2: { name: "Escamas marinas", weight: 30 },
          // Total exacto: 720 + 45 + 30 = 795 g
          exactWeight: 795,
          approxWeightHundreds: 800
        },
        comparison1: {
          targetName: "Frasco Ligero de Salvia",
          targetWeight: 490,
          // Aprox frente a Vista de Águila (900 - 500 = 400 g)
          approxDiff: 400
        },
        comparison2: {
          targetName: "Caldero de Furia Elemental",
          targetWeight: 1300,
          // Aprox frente a Aliento de Dragón (1300 - 800 = 500 g)
          approxDiff: 500
        }
      }
    }
  ],

  // ---------------------------------------------------------------------------
  // 2. EJERCICIOS DEL DETECTIVE (MODELO A - RAZONAMIENTO Y DEDUCCIÓN INVERSA)
  // ---------------------------------------------------------------------------
  detectiveChallenges: [
    {
      id: "det_1",
      title: "🔎 Enigma 1: La Expresión Oculta de la Despensa",
      question: "¿Qué problema de la vida real representa exactamente la siguiente operación combinada?",
      expression: "(280 + 45) + (450 + 16 + 14)",
      options: [
        {
          id: "opt_a",
          text: "En un bol mezclamos azúcar (280 g) y cacao (45 g), y en otro bol mezclamos harina (450 g), levadura (16 g) y vainilla (14 g). Al final unimos los dos boles.",
          isCorrect: true,
          explanation: "¡Exacto! El primer paréntesis agrupa los dos primeros ingredientes y el segundo agrupa los tres siguientes. La suma entre paréntesis junta ambos boles."
        },
        {
          id: "opt_b",
          text: "Teníamos un paquete de 280 g y le fuimos restando sucesivamente 45 g, 450 g, 16 g y 14 g.",
          isCorrect: false,
          explanation: "No es correcto, porque todos los signos son sumas (+), no hay ninguna resta en la expresión."
        },
        {
          id: "opt_c",
          text: "Multiplicamos el peso del azúcar por el de la harina y le sumamos la levadura.",
          isCorrect: false,
          explanation: "No hay ninguna multiplicación (x) en esta expresión."
        }
      ],
      stepByStep: {
        step1Label: "Primer bol (280 + 45):",
        step1Expected: 325,
        step2Label: "Segundo bol (450 + 16 + 14):",
        step2Expected: 480,
        step3Label: "Total juntos (325 + 480):",
        step3Expected: 805
      }
    },
    {
      id: "det_2",
      title: "🔎 Enigma 2: El Misterio del Saco Restante",
      question: "¿Qué situación representa la operación combinada: 1.450 − (650 + 320)?",
      expression: "1.450 − (650 + 320)",
      options: [
        {
          id: "opt_a",
          text: "En un saco había 1.450 g de harina. Se gastaron 650 g para hacer galletas y 320 g para hacer bizcochos. Queremos saber cuánta harina queda en el saco.",
          isCorrect: true,
          explanation: "¡Correcto! Primero se suma el gasto total dentro del paréntesis (650 + 320 = 970 g) y luego se resta del total que había en el saco (1.450 g)."
        },
        {
          id: "opt_b",
          text: "Compramos tres sacos de harina que pesan 1.450 g, 650 g y 320 g para juntarlos todos.",
          isCorrect: false,
          explanation: "Si se juntaran todos los sacos, la operación sería 1.450 + 650 + 320 sin restas."
        },
        {
          id: "opt_c",
          text: "Teníamos 650 g y compramos 320 g más para llegar a 1.450 g.",
          isCorrect: false,
          explanation: "Esa situación buscaría lo que falta, pero la expresión calcula directamente lo que queda en el saco grande."
        }
      ],
      stepByStep: {
        step1Label: "Gasto total dentro del paréntesis (650 + 320):",
        step1Expected: 970,
        step2Label: "Harina que queda (1.450 − 970):",
        step2Expected: 480
      }
    },
    {
      id: "det_3",
      title: "🔎 Enigma 3: La Prueba Mágica de la Resta",
      question: "En una resta, el sustraendo es 845 y la diferencia es 375. ¿Cuál es el minuendo?",
      formula: "Minuendo = Sustraendo + Diferencia",
      hint: "Recuerda la regla de oro: M = S + D. Si sumas lo que restaste y lo que sobró, obtienes lo que había al principio.",
      sustraendo: 845,
      diferencia: 375,
      minuendoExpected: 1220
    },
    {
      id: "det_4",
      title: "🔎 Enigma 4: El Sustraendo Desconocido",
      question: "El panadero tenía 2.500 g de masa (Minuendo). Después de hornear le quedaron 1.180 g (Diferencia). ¿Cuántos gramos gastó (Sustraendo)?",
      formula: "Sustraendo = Minuendo − Diferencia",
      hint: "Para averiguar lo que se gastó, resta lo que quedó de lo que había al inicio.",
      minuendo: 2500,
      diferencia: 1180,
      sustraendoExpected: 1320
    }
  ],

  // ---------------------------------------------------------------------------
  // 3. BANCO DE PREGUNTAS DEL DESAFÍO EXPRESS (TEST EVALUATIVO SOBRE 10)
  // ---------------------------------------------------------------------------
  expressQuizPool: [
    {
      id: "q1",
      topic: "Propiedad Conmutativa",
      question: "Si 450 + 280 = 730, ¿cuánto es 280 + 450 según la propiedad conmutativa?",
      options: ["630", "730", "750", "830"],
      answer: 1, // "730"
      explanation: "La propiedad conmutativa dice que el orden de los sumandos no cambia el resultado: 450 + 280 = 280 + 450 = 730."
    },
    {
      id: "q2",
      topic: "Propiedad Asociativa",
      question: "En la operación (300 + 150) + 50, ¿cuál es la forma correcta de asociar según la propiedad asociativa?",
      options: [
        "(300 + 50) − 150",
        "300 + (150 + 50)",
        "(300 + 150) × 50",
        "300 − (150 + 50)"
      ],
      answer: 1,
      explanation: "La propiedad asociativa permite agrupar de diferente forma manteniendo las sumas: (300 + 150) + 50 = 300 + (150 + 50) = 500."
    },
    {
      id: "q3",
      topic: "Operaciones Combinadas",
      question: "¿Cuál es el resultado de la operación combinada: 1.000 − (250 + 350)?",
      options: ["400", "500", "300", "450"],
      answer: 0,
      explanation: "Primero se resuelve el paréntesis: 250 + 350 = 600. Después: 1.000 − 600 = 400."
    },
    {
      id: "q4",
      topic: "Conversión de Unidades",
      question: "Para hacer una tarta se necesitan 600 g de harina. Si tenemos un paquete de 1 kg, ¿cuántos gramos nos quedarán?",
      options: ["300 g", "400 g", "500 g", "1.600 g"],
      answer: 1,
      explanation: "1 kg = 1.000 g. Si gastamos 600 g, nos quedan: 1.000 − 600 = 400 g."
    },
    {
      id: "q5",
      topic: "Estimación a las Centenas",
      question: "Estima la suma 485 + 312 redondeando a las centenas más cercanas:",
      options: ["700", "800", "900", "790"],
      answer: 1,
      explanation: "485 se aproxima a 500 y 312 se aproxima a 300. Sumando las estimaciones: 500 + 300 = 800."
    },
    {
      id: "q6",
      topic: "Estimación de Diferencias",
      question: "Una hogaza pesa 1.185 g y un panecillo 215 g. ¿Cuánto más pesa la hogaza aproximadamente (redondeando a centenas)?",
      options: ["900 g", "1.000 g", "800 g", "1.100 g"],
      answer: 1,
      explanation: "1.185 se redondea a 1.200 y 215 se redondea a 200. Restando: 1.200 − 200 = 1.000 g."
    },
    {
      id: "q7",
      topic: "Prueba de la Resta",
      question: "Si una resta está bien hecha, ¿qué igualdad debe cumplirse siempre?",
      options: [
        "Sustraendo = Minuendo + Diferencia",
        "Minuendo = Sustraendo + Diferencia",
        "Diferencia = Minuendo + Sustraendo",
        "Minuendo = Sustraendo − Diferencia"
      ],
      answer: 1,
      explanation: "La prueba de la resta es: Minuendo = Sustraendo + Diferencia (M = S + D)."
    },
    {
      id: "q8",
      topic: "Elemento Neutro",
      question: "¿Cuál es el elemento neutro de la suma?",
      options: ["El 1", "El 10", "El 0", "El 100"],
      answer: 2,
      explanation: "El elemento neutro de la suma es el 0, porque cualquier número sumado a 0 se queda igual (ej: 450 + 0 = 450)."
    },
    {
      id: "q9",
      topic: "Operaciones sin Paréntesis",
      question: "¿En qué orden se resuelve una operación combinada sin paréntesis como 500 − 120 + 80?",
      options: [
        "De derecha a izquierda",
        "Primero siempre la suma y luego la resta",
        "De izquierda a derecha en el orden en que aparecen",
        "Da igual el orden, siempre da lo mismo"
      ],
      answer: 2,
      explanation: "Sin paréntesis se calcula estrictamente de izquierda a derecha: 500 − 120 = 380, y luego 380 + 80 = 460."
    },
    {
      id: "q10",
      topic: "Problema de Paquetes Abiertos",
      question: "En tres botes hay 120 g, 230 g y 50 g de azúcar. Si necesitamos 500 g en total, ¿cuánto nos falta?",
      options: ["100 g", "150 g", "200 g", "80 g"],
      answer: 0,
      explanation: "Juntamos lo que hay: 120 + 230 + 50 = 400 g. Para llegar a 500 g: 500 − 400 = 100 g."
    },
    {
      id: "q11",
      topic: "Términos de la Resta",
      question: "En la resta 850 − 320 = 530, ¿cómo se llama el número 850?",
      options: ["Sustraendo", "Minuendo", "Diferencia", "Sumando"],
      answer: 1,
      explanation: "El primer número del que se resta es el Minuendo. El que se resta es el Sustraendo y el resultado es la Diferencia."
    },
    {
      id: "q12",
      topic: "Hueco Conmutativo",
      question: "¿Qué número falta en el hueco para que se cumpla la igualdad: 340 + ___ = 90 + 340?",
      options: ["340", "90", "430", "250"],
      answer: 1,
      explanation: "Por la propiedad conmutativa: 340 + 90 = 90 + 340. En el hueco debe ir el 90."
    }
  ],

  // ---------------------------------------------------------------------------
  // 4. RETOS DE ARCADE (CHEF REPOSTERO - AGILIDAD MENTAL)
  // ---------------------------------------------------------------------------
  arcadeChallenges: [
    // Amigos del 100 y 1.000 (Cálculo mental esencial para estimaciones)
    { type: "friend100", q: "35 + ___ = 100", target: 100, given: 35, answer: 65 },
    { type: "friend100", q: "72 + ___ = 100", target: 100, given: 72, answer: 28 },
    { type: "friend100", q: "48 + ___ = 100", target: 100, given: 48, answer: 52 },
    { type: "friend1000", q: "650 + ___ = 1.000", target: 1000, given: 650, answer: 350 },
    { type: "friend1000", q: "420 + ___ = 1.000", target: 1000, given: 420, answer: 580 },
    { type: "friend1000", q: "810 + ___ = 1.000", target: 1000, given: 810, answer: 190 },

    // Identificación rápida de propiedad
    {
      type: "identify",
      q: "¿Qué propiedad es: 56 + 18 = 18 + 56?",
      options: ["Conmutativa", "Asociativa", "Elemento Neutro"],
      answer: "Conmutativa"
    },
    {
      type: "identify",
      q: "¿Qué propiedad es: (20 + 30) + 40 = 20 + (30 + 40)?",
      options: ["Conmutativa", "Asociativa", "Elemento Neutro"],
      answer: "Asociativa"
    },
    {
      type: "identify",
      q: "¿Qué propiedad es: 940 + 0 = 940?",
      options: ["Conmutativa", "Asociativa", "Elemento Neutro"],
      answer: "Elemento Neutro"
    },

    // Paréntesis express
    { type: "parenthesis", q: "(40 + 60) − 30 = ___", answer: 70 },
    { type: "parenthesis", q: "100 − (25 + 25) = ___", answer: 50 },
    { type: "parenthesis", q: "200 − (80 + 20) = ___", answer: 100 },
    { type: "parenthesis", q: "(150 + 50) + 80 = ___", answer: 280 }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathData;
}

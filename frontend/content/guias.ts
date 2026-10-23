/* Guides content. Plain typed data (no markdown dependency): each guide is rendered by
   pages/guias/[slug].vue and listed by pages/guias/index.vue. dateModified must be updated by
   hand, together with the sitemap lastmod, only when the text really changes. */

export type GuiaBlock =
  | { type: 'p'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }

export interface GuiaSection {
  heading: string
  blocks: GuiaBlock[]
}

export interface Guia {
  slug: string
  title: string
  /** Shorter title for <title> and og:title (the brand suffix is added by the pages). */
  metaTitle: string
  /** Meta description, 85-155 characters. */
  description: string
  datePublished: string
  dateModified: string
  readingMinutes: number
  /** Short answer to the search intent, shown right under the H1. */
  intro: string
  sections: GuiaSection[]
}

/** Author of every guide: the same Person entity declared on /quienes-somos. */
export const guiaAuthor = {
  '@type': 'Person',
  '@id': 'https://werawoof.com/#brayan',
  name: 'Brayan Vidal Romero',
  url: 'https://werawoof.com/quienes-somos',
} as const

export const guias: Guia[] = [
  {
    slug: 'como-organizar-un-playdate-seguro-para-tu-perro',
    title: 'Cómo organizar un playdate seguro para tu perro',
    metaTitle: 'Cómo organizar un playdate seguro para tu perro',
    description:
      'Guía práctica para organizar un playdate seguro: cómo elegir al otro perro, el lugar, la primera presentación y las señales para parar el juego.',
    datePublished: '2026-10-04',
    dateModified: '2026-10-04',
    readingMinutes: 5,
    intro:
      'Un playdate seguro es un encuentro planeado entre dos perros que se llevan bien, en un lugar tranquilo y con los dos dueños atentos. Para organizarlo, elige un compañero de tamaño y energía parecidos, escoge un espacio neutral, presenta a los perros con calma y revisa que ambos tengan vacunas y desparasitación al día. Si algo se tensa, separa el juego con calma y retómalo otro día.',
    sections: [
      {
        heading: 'Qué es un playdate y por qué vale la pena',
        blocks: [
          {
            type: 'p',
            text: 'Un playdate es una cita de juego entre perros: un rato acordado de antemano para que convivan, corran y se huelan sin la prisa de un paseo normal. Para muchos perros es la mejor forma de gastar energía, practicar sus modales con otros perros y salir de la rutina de la colonia.',
          },
          {
            type: 'p',
            text: 'Para los dueños también tiene su lado bueno: conoces a otras personas que entienden tu preocupación por el bienestar del perro y puedes comparar dudas sobre comida, veterinarios o entrenamiento. La clave está en que sea un encuentro organizado y no un cruce casual con alguien que no conoces, porque en un playdate tú decides con quién, dónde y bajo qué condiciones.',
          },
        ],
      },
      {
        heading: 'Cómo elegir al compañero de juego ideal',
        blocks: [
          {
            type: 'p',
            text: 'No todos los perros se llevan con todos, y eso es normal. Antes de organizar nada, platica con el otro dueño y pregunta lo básico:',
          },
          {
            type: 'ul',
            items: [
              'Tamaño y fuerza: un perro muy grande puede lastimar a uno pequeño sin querer, aunque solo esté jugando. Busca parejas de tamaño parecido o, al menos, de juego suave.',
              'Nivel de energía: un cachorro intenso puede agotar a un perro mayor. Si los dos tienen un ritmo parecido, el juego fluye mejor.',
              'Estilo de juego: hay perros que persiguen, otros que luchan, otros que prefieren olfatear. Los estilos compatibles evitan malentendidos.',
              'Historial: pregunta si ha tenido peleas, si cuida juguetes o comida, y cómo reacciona con perros desconocidos.',
              'Salud: vacunas al día, desparasitación y, en el caso de las hembras, si están en celo.',
            ],
          },
          {
            type: 'p',
            text: 'Si tu perro es tímido o reactivo, dilo desde el principio. Un dueño honesto vale más que diez perros perfectos, y es mucho mejor acordar un ritmo lento que improvisar sobre la marcha.',
          },
        ],
      },
      {
        heading: 'El lugar: neutral, tranquilo y con salida',
        blocks: [
          {
            type: 'p',
            text: 'El mejor lugar para una primera cita es un espacio neutral, donde ninguno de los dos perros sienta que es su territorio. Evita el patio o la casa de uno de ellos la primera vez, porque la defensa del territorio es una causa común de tensión.',
          },
          {
            type: 'ul',
            items: [
              'Elige un parque con espacio suficiente para que los perros puedan alejarse el uno del otro si lo necesitan.',
              'Revisa que no haya basura, vidrios, plantas tóxicas ni agua estancada.',
              'Evita horas de mucho calor o de mucha gente. Temprano en la mañana o al atardecer suele ser más cómodo.',
              'Confirma las reglas del lugar: algunos parques exigen correa o tienen horarios para perros.',
              'Lleva agua fresca y un recipiente, aunque el lugar tenga fuentes.',
            ],
          },
        ],
      },
      {
        heading: 'La primera presentación, paso a paso',
        blocks: [
          {
            type: 'p',
            text: 'Los primeros minutos definen el tono del encuentro. No hace falta ningún truco, pero sí paciencia:',
          },
          {
            type: 'ol',
            items: [
              'Empiecen con un paseo en paralelo. Caminen a unos metros de distancia, con los perros con correa, hasta que se vean relajados y sin tirar.',
              'Acerquen a los perros poco a poco, de lado y no de frente. Un acercamiento frontal y directo se puede interpretar como un desafío.',
              'Dejen que se huelan unos segundos y llámenlos para separarlos con una pausa corta. Repetir esto ayuda a que se calmen.',
              'Si el lenguaje corporal es suelto, con cuerpo flexible y cola relajada, pueden soltar la correa en una zona segura. Si hay rigidez, gruñidos o mirada fija, sigan caminando juntos con correa un rato más.',
              'Mantengan la primera sesión corta, de unos 20 a 30 minutos. Es mejor terminar con ganas de más que con cansancio y nervios.',
            ],
          },
        ],
      },
      {
        heading: 'Señales de que el juego está bien',
        blocks: [
          {
            type: 'p',
            text: 'Un buen juego se ve alternado y relajado. Fíjate en estas señales:',
          },
          {
            type: 'ul',
            items: [
              'Se turnan los roles: uno persigue y luego el otro.',
              'Hacen la reverencia de juego, con el pecho abajo y la cola arriba.',
              'Se detienen por voluntad propia y retoman después.',
              'Tienen el cuerpo suelto, con la boca abierta y la lengua relajada.',
            ],
          },
          {
            type: 'h3',
            text: 'Señales de que hay que intervenir',
          },
          {
            type: 'ul',
            items: [
              'Un perro intenta esconderse, se pega a su dueño o intenta huir.',
              'El juego es siempre de uno que persigue y otro que escapa, sin pausas.',
              'Hay cuerpos rígidos, labios levantados, gruñidos serios o mirada fija.',
              'Alguien defiende un juguete, la comida o a su dueño.',
            ],
          },
          {
            type: 'p',
            text: 'Si ves cualquiera de estas señales, interrumpe con calma: llama a tu perro, hazle una pausa y, si no se relaja, termina el encuentro. No hay que regañar a nadie ni sacar conclusiones definitivas. A veces solo era un mal día o un mal momento.',
          },
        ],
      },
      {
        heading: 'Seguridad y salud antes de salir',
        blocks: [
          {
            type: 'p',
            text: 'Antes del playdate confirma que tu perro tenga sus vacunas y su desparasitación al día, y que no esté enfermo. Si tuvo tos, diarrea, vómito o decaimiento, cancela: es mejor avisar y reprogramar que contagiar a otro perro.',
          },
          {
            type: 'p',
            text: 'Lleva correa resistente, bolsas para recoger sus desechos, agua y, si tu perro tolera bien el collar o arnés que usas, que sea de los que no se pueden zafar. Un perro que se asusta y se suelta en un parque es un riesgo para él y para los demás. Si tu perro es muy sensible al calor o tiene la nariz chata, como un bulldog o un pug, acorta el tiempo y busca sombra.',
          },
          {
            type: 'p',
            text: 'Un último punto: los juguetes y la comida pueden causar conflictos. Para un primer encuentro, lo más sencillo es no llevar ninguno y dejar la comida lejos del lugar de juego.',
          },
        ],
      },
      {
        heading: 'Dónde encontrar compañeros de juego de forma segura',
        blocks: [
          {
            type: 'p',
            text: 'Puedes empezar con los vecinos, los grupos de tu colonia o la veterinaria. Otra opción es una app como WeraWoof, donde creas el perfil de tu perro con su tamaño, su nivel de energía y lo que le gusta, y ves perros cercanos con un radio de 1 a 100 km. Cuando los dos dueños se dan like y hacen match, pueden chatear para ponerse de acuerdo en el lugar y la hora antes de conocerse en persona.',
          },
          {
            type: 'p',
            text: 'Sea cual sea el medio, usa el mismo criterio: reúnete en un lugar público, avisa a alguien de tu confianza y no compartas tu dirección exacta hasta conocer mejor a la otra persona.',
          },
        ],
      },
      {
        heading: 'Cómo cerrar bien el playdate',
        blocks: [
          {
            type: 'p',
            text: 'Termina antes de que alguno esté agotado. Pónganles la correa, caminen un rato juntos para bajar la emoción y despídanse con calma. Después, revisa a tu perro: patas, almohadillas, ojos y que tome agua. Esa noche es normal que duerma profundo.',
          },
          {
            type: 'p',
            text: 'Si todo salió bien, propón una segunda cita con un poco más de tiempo. La confianza entre perros se construye con varios encuentros cortos y positivos, no con una sola tarde larga.',
          },
        ],
      },
    ],
  },
  {
    slug: 'parques-pet-friendly-cdmx-para-pasear-y-socializar-a-tu-perro',
    title: 'Parques pet friendly en CDMX para pasear y socializar a tu perro',
    metaTitle: 'Parques pet friendly en CDMX para pasear a tu perro',
    description:
      'Parques de la Ciudad de México donde suele haber perros: Parque México, Chapultepec, Parque Lincoln y más. Tips y qué confirmar antes de ir.',
    datePublished: '2026-10-04',
    dateModified: '2026-10-04',
    readingMinutes: 5,
    intro:
      'En la Ciudad de México hay varios parques conocidos por recibir a dueños con perros, como el Parque México y el Parque España en la Condesa, el Bosque de Chapultepec, el Parque Lincoln en Polanco y el Parque Hundido en la zona de Insurgentes Sur. Las reglas cambian con el tiempo y entre parques, así que antes de ir confirma en el lugar si piden correa, si hay horarios y si existe un área para perros.',
    sections: [
      {
        heading: 'Antes de ir: las reglas pueden cambiar',
        blocks: [
          {
            type: 'p',
            text: 'Esta guía menciona parques donde es común ver dueños paseando a sus perros, pero no es una lista oficial ni garantiza lo que se permite en cada uno. Las reglas de uso de los parques las definen las autoridades y los administradores de cada espacio, y pueden cambiar: horarios, uso obligatorio de correa, zonas permitidas, áreas cerradas por mantenimiento o por eventos.',
          },
          {
            type: 'p',
            text: 'Por eso, cuando llegues, busca los letreros en la entrada, pregunta al personal de vigilancia o jardinería y observa qué hacen los demás dueños. Si tienes duda, usa correa: es la regla más segura en cualquier espacio público y evita problemas con otras personas, otros perros y la fauna del lugar.',
          },
        ],
      },
      {
        heading: 'Parque México y Parque España, en la Condesa',
        blocks: [
          {
            type: 'p',
            text: 'La Condesa es una de las zonas de la ciudad donde más se ve a la gente pasear con sus perros. El Parque México, en la colonia Condesa, es probablemente el más conocido: tiene caminos amplios, árboles grandes y mucho movimiento a todas horas, sobre todo por las mañanas y por las tardes.',
          },
          {
            type: 'p',
            text: 'A pocas cuadras está el Parque España, más pequeño y más tranquilo, con un ambiente muy de barrio. Al ser parques con mucha gente, son buenos para acostumbrar a un perro seguro de sí mismo a ver personas, bicicletas y otros perros, pero pueden ser demasiado para uno tímido. Lo ideal es ir a horas con menos gente y avanzar poco a poco.',
          },
        ],
      },
      {
        heading: 'Bosque de Chapultepec',
        blocks: [
          {
            type: 'p',
            text: 'El Bosque de Chapultepec es el parque urbano más grande de la ciudad y está dividido en secciones, con caminos largos, zonas arboladas y mucho espacio para caminar. Es una buena opción para un paseo largo con un perro que tenga energía.',
          },
          {
            type: 'p',
            text: 'Por su tamaño, las reglas pueden variar entre secciones y zonas, y hay áreas con acceso restringido, como museos y espacios con animales o fauna. Antes de ir, confirma por qué entrada conviene entrar, qué se permite con perros y si hay horarios. Lleva suficiente agua y evita las horas de más calor, porque hay tramos largos sin sombra.',
          },
        ],
      },
      {
        heading: 'Parque Lincoln, en Polanco',
        blocks: [
          {
            type: 'p',
            text: 'El Parque Lincoln, en Polanco, es un espacio muy visitado por quienes viven cerca y suele verse con dueños paseando a sus perros. Es una zona de mucha afluencia, así que conviene ir con el perro bien controlado y con correa corta cuando haya mucha gente.',
          },
          {
            type: 'p',
            text: 'Como en cualquier parque, revisa en el lugar si hay un área específica para perros y qué horarios o condiciones tiene, porque pueden modificarse.',
          },
        ],
      },
      {
        heading: 'Parque Hundido, en Insurgentes Sur',
        blocks: [
          {
            type: 'p',
            text: 'El Parque Hundido, sobre Insurgentes Sur, es un parque alargado con áreas verdes y senderos, muy usado por la gente de las colonias cercanas para caminar y hacer ejercicio. Es un buen candidato para un paseo largo de rutina, con caminos que se prestan para avanzar con el perro a un ritmo constante.',
          },
          {
            type: 'p',
            text: 'Igual que en los demás, confirma al llegar qué reglas aplican para perros y si hay zonas donde no se permite el paso con ellos.',
          },
        ],
      },
      {
        heading: 'Cómo elegir el parque según tu perro',
        blocks: [
          {
            type: 'ul',
            items: [
              'Perro seguro y sociable: un parque con movimiento, como los de la Condesa, le ayuda a practicar su convivencia con gente y otros perros.',
              'Perro tímido o nervioso: ve a horas tranquilas y elige zonas amplias donde pueda mantener distancia.',
              'Perro con mucha energía: busca caminos largos y espacio, como los de Chapultepec, y combina el paseo con ejercicio y juego.',
              'Cachorro: antes de llevarlo, confirma con tu veterinario que tenga el esquema de vacunas completo.',
              'Perro mayor o con problemas de articulaciones: prefiere terrenos planos, sombra y paseos cortos.',
            ],
          },
        ],
      },
      {
        heading: 'Qué llevar y qué cuidar en el parque',
        blocks: [
          {
            type: 'ul',
            items: [
              'Correa resistente y, si tu perro la necesita, una correa corta para zonas con mucha gente.',
              'Bolsas para recoger sus desechos. Es una regla básica de convivencia.',
              'Agua fresca y un recipiente, sobre todo en temporada de calor.',
              'Identificación en el collar y, si es posible, microchip actualizado.',
              'Cuidado con el pavimento caliente, que puede lastimar las almohadillas, y con los alimentos o la basura que haya en el suelo.',
            ],
          },
          {
            type: 'p',
            text: 'Respeta también a quienes no tienen perro: hay personas con miedo, niños pequeños y corredores. Pregunta antes de dejar que tu perro se acerque a alguien y respeta la respuesta.',
          },
        ],
      },
      {
        heading: 'Cómo encontrar con quién socializar a tu perro',
        blocks: [
          {
            type: 'p',
            text: 'Llegar al parque a ver quién aparece funciona, pero no siempre sale bien. Lo más cómodo es quedar de antemano con otro dueño. En WeraWoof, por ejemplo, creas el perfil de tu perro, ves perros cerca de ti y, cuando hay match, usas el chat para acordar el parque, la hora y la forma de presentarse. Así llegas con un plan y con un perro conocido, no con una sorpresa.',
          },
          {
            type: 'p',
            text: 'Si quieres saber cómo organizar bien esa primera cita, tenemos una guía sobre cómo organizar un playdate seguro. Y si tu perro es tímido, la guía para socializar a un perro adulto o tímido te dará un ritmo realista.',
          },
        ],
      },
      {
        heading: 'Resumen rápido',
        blocks: [
          {
            type: 'p',
            text: 'Los parques de la Condesa, Chapultepec, Polanco e Insurgentes Sur son opciones muy conocidas para pasear con tu perro en la Ciudad de México, pero las reglas de cada espacio pueden cambiar. Confirma en el sitio, usa correa si hay duda, recoge siempre lo que tu perro deje y elige el parque y la hora que mejor se acomoden a su carácter.',
          },
        ],
      },
    ],
  },
  {
    slug: 'como-socializar-a-un-perro-adulto-o-timido',
    title: 'Cómo socializar a un perro adulto o tímido',
    metaTitle: 'Cómo socializar a un perro adulto o tímido',
    description:
      'Un perro adulto o tímido sí puede aprender a convivir. Pasos graduales, señales de estrés y cuándo pedir ayuda a un entrenador o veterinario.',
    datePublished: '2026-10-04',
    dateModified: '2026-10-04',
    readingMinutes: 5,
    intro:
      'Sí, un perro adulto o tímido puede aprender a convivir con otros perros, pero necesita más paciencia que un cachorro. La clave es avanzar de forma gradual: empezar a distancia, premiar la calma, presentar a un solo perro tranquilo a la vez y terminar cada sesión antes de que se estrese. Si hay miedo intenso o agresividad, conviene consultar a un veterinario o a un entrenador profesional.',
    sections: [
      {
        heading: '¿Es tarde para socializar a un perro adulto?',
        blocks: [
          {
            type: 'p',
            text: 'No. Es cierto que los cachorros aprenden con más facilidad durante sus primeros meses de vida, pero los perros adultos siguen aprendiendo toda su vida. La diferencia es que un adulto puede traer experiencias previas, como malos encuentros, falta de contacto o un carácter más reservado, y necesita más tiempo para cambiar la forma en que reacciona.',
          },
          {
            type: 'p',
            text: 'Tampoco todos los perros necesitan ser sociables con todos. A algunos les basta con un par de amigos de confianza y paseos tranquilos. Socializar bien no significa que tu perro deba jugar con cualquiera, sino que se sienta seguro en el entorno y sepa manejar encuentros con calma.',
          },
        ],
      },
      {
        heading: 'Cómo saber si tu perro está incómodo',
        blocks: [
          {
            type: 'p',
            text: 'Antes de empezar, aprende a leer a tu perro. Un perro tímido casi nunca avisa con un ladrido: usa señales sutiles, y si las ignoramos, a veces termina por reaccionar con más fuerza. Algunas señales comunes de estrés o incomodidad:',
          },
          {
            type: 'ul',
            items: [
              'Se lame los labios o bosteza sin que tenga sueño.',
              'Voltea la cabeza o evita mirar al otro perro.',
              'Mantiene la cola baja o pegada al cuerpo.',
              'Se queda inmóvil, se agacha o se esconde detrás de ti.',
              'Jadea sin hacer calor ni ejercicio.',
              'Intenta irse, tira de la correa en sentido contrario o se rehúsa a caminar.',
            ],
          },
          {
            type: 'p',
            text: 'Cuando veas estas señales, aumenta la distancia o termina la sesión. Presionar a un perro a seguir solo refuerza la idea de que los otros perros son un problema.',
          },
        ],
      },
      {
        heading: 'Paso 1: empieza a una distancia cómoda',
        blocks: [
          {
            type: 'p',
            text: 'Busca la distancia a la que tu perro puede ver a otro perro sin reaccionar. Puede ser de diez metros o de media calle. A esa distancia, tu perro todavía puede comer, escucharte y moverse con normalidad.',
          },
          {
            type: 'p',
            text: 'Cada vez que mire al otro perro con calma, dile una palabra amable y dale un premio pequeño. La idea es que asocie la presencia de otros perros con algo bueno. Si se pone tenso, estás muy cerca: aléjate un poco y vuelve a empezar.',
          },
        ],
      },
      {
        heading: 'Paso 2: caminen en paralelo',
        blocks: [
          {
            type: 'p',
            text: 'El paseo en paralelo es una de las mejores herramientas para un perro inseguro. Pide a un conocido con un perro tranquilo que camine a unos metros de ti, en la misma dirección, sin enfrentar a los perros. Caminar en la misma dirección es menos amenazante que encontrarse de frente.',
          },
          {
            type: 'p',
            text: 'Con el paso de los paseos, reduzcan la distancia de forma gradual, siempre que ambos perros se vean cómodos. No hace falta que se toquen ni se huelan. A veces, varios paseos tranquilos valen más que una presentación forzada.',
          },
        ],
      },
      {
        heading: 'Paso 3: una presentación con un solo perro tranquilo',
        blocks: [
          {
            type: 'p',
            text: 'Cuando tu perro ya camina cerca de otro sin tensión, es momento de una presentación. Elige un solo perro, de preferencia adulto, equilibrado y con buenos modales. Un perro seguro y calmado enseña más que uno muy intenso.',
          },
          {
            type: 'ul',
            items: [
              'Hazlo en un espacio neutral y amplio, con salida para ambos.',
              'Mantengan correas flojas: una correa tensa transmite tensión.',
              'Permite un olfateo breve y llama a tu perro antes de que se acumule la emoción.',
              'Mantén la sesión corta y termina con algo positivo, como un paseo tranquilo o un premio.',
            ],
          },
          {
            type: 'p',
            text: 'Si el perro tímido se relaja, repite el encuentro varios días seguidos o con pocos días de separación, alargando un poco el tiempo. Si no, regresa al paso anterior sin sentirlo como un fracaso.',
          },
        ],
      },
      {
        heading: 'Paso 4: aumenta la dificultad poco a poco',
        blocks: [
          {
            type: 'p',
            text: 'Cuando la convivencia con un perro ya es estable, puedes ir subiendo la dificultad: soltarlos en un espacio cercado, probar con un segundo perro conocido o visitar un parque en horarios tranquilos. Cambia una sola cosa a la vez. Si cambias lugar, perro y duración al mismo tiempo, es difícil saber qué le generó estrés.',
          },
          {
            type: 'p',
            text: 'Lleva un registro sencillo, aunque sea mental: qué funcionó, qué lo alteró y cuánto duró cada sesión. Notarás avances que de otra forma pasarían desapercibidos.',
          },
        ],
      },
      {
        heading: 'Lo que no conviene hacer',
        blocks: [
          {
            type: 'ul',
            items: [
              'Forzarlo a convivir: acercarlo a la fuerza a otros perros suele empeorar el miedo.',
              'Regañarlo cuando gruñe o ladra: el gruñido es una advertencia, y si lo castigas, puede dejar de avisar.',
              'Llevarlo a lugares muy concurridos desde el principio, como un parque lleno en fin de semana.',
              'Dejarlo jugar con perros que no conoces y que no controlan sus dueños.',
              'Comparar su ritmo con el de otros perros: cada uno avanza a su paso.',
            ],
          },
        ],
      },
      {
        heading: 'Cuándo pedir ayuda profesional',
        blocks: [
          {
            type: 'p',
            text: 'Consulta con tu veterinario si el cambio de carácter es repentino, porque el dolor o una enfermedad pueden hacer que un perro se vuelva más reactivo. Si hay miedo intenso, mordidas o ataques, o si no avanzas después de varias semanas de trabajo, busca a un entrenador o etólogo con experiencia en métodos basados en premios y no en castigos.',
          },
          {
            type: 'p',
            text: 'Pedir ayuda no es rendirse: un profesional puede ver detalles del lenguaje corporal de tu perro que a ti se te escapan y darte un plan a su medida.',
          },
        ],
      },
      {
        heading: 'Cómo encontrar compañeros adecuados',
        blocks: [
          {
            type: 'p',
            text: 'Para un perro tímido, lo importante es encontrar al compañero adecuado y no al más cercano. En WeraWoof puedes indicar en el perfil de tu perro su nivel de energía y cómo es, y así buscar perros con un carácter compatible. Cuando hay match, el chat te permite explicarle al otro dueño que tu perro es tímido y acordar un encuentro tranquilo, con paseo en paralelo y sin presión.',
          },
          {
            type: 'p',
            text: 'Si quieres armar ese primer encuentro, revisa la guía sobre cómo organizar un playdate seguro. Y si vives en la Ciudad de México, la guía de parques pet friendly puede ayudarte a elegir un lugar.',
          },
        ],
      },
    ],
  },
  {
    slug: 'tinder-para-perros-que-es-y-como-funciona',
    title: 'Tinder para perros: qué es y cómo funciona una app para conocer otros perros',
    metaTitle: 'Tinder para perros: cómo funciona y app gratis en México',
    description:
      'Qué es un Tinder para perros, cómo funciona (perfil, swipe, match y chat), qué cuidar y cómo usar WeraWoof para conocer otros perros en México.',
    datePublished: '2026-10-04',
    dateModified: '2026-10-04',
    readingMinutes: 5,
    intro:
      'Un Tinder para perros es una app donde los dueños crean el perfil de su perro, hacen swipe entre perros cercanos y, cuando a los dos les gusta la pareja, hacen match y chatean para organizar un paseo o un playdate. No es una app de citas para personas: sirve para que los perros encuentren amigos de juego. En México, WeraWoof es una de esas apps y es gratuita.',
    sections: [
      {
        heading: 'Qué es un Tinder para perros',
        blocks: [
          {
            type: 'p',
            text: 'La expresión "Tinder para perros" se usa para describir apps que toman la mecánica de las apps de citas, con perfiles, swipe y match, y la aplican a los perros. Aquí el que busca compañía es el perro: los dueños son quienes manejan la cuenta, eligen y se ponen de acuerdo.',
          },
          {
            type: 'p',
            text: 'La idea resuelve un problema común. Muchos dueños quieren que su perro tenga amigos, pero no saben con quién juntarlo: los vecinos no siempre tienen perro, el parque es una lotería y los grupos de mensajería se llenan de mensajes. Una app permite filtrar por cercanía y por carácter antes de salir de casa.',
          },
        ],
      },
      {
        heading: 'Cómo funciona, paso a paso',
        blocks: [
          {
            type: 'ol',
            items: [
              'Creas una cuenta y el perfil de tu perro: nombre, fotos, raza, edad, nivel de energía y lo que le gusta.',
              'Compartes tu ubicación aproximada y eliges un radio de búsqueda. La app calcula la distancia a otros perros.',
              'Haces swipe: ves los perfiles uno por uno y decides si quieres conocer a ese perro.',
              'Si el otro dueño también te da like, hay match.',
              'Con el match se abre un chat entre los dos dueños para acordar un paseo, un playdate o lo que busquen.',
              'Se encuentran en un lugar público y deciden si repiten.',
            ],
          },
          {
            type: 'p',
            text: 'El match es útil porque el interés es mutuo: ninguno de los dos recibe mensajes de alguien que no quería hablar con ellos.',
          },
        ],
      },
      {
        heading: 'Para qué se usa: amigos, paseos, playdates y cruzas',
        blocks: [
          {
            type: 'p',
            text: 'La mayoría de las personas busca amigos de juego, compañeros de paseo o alguien con quien ir al parque. Es lo más común y, en general, lo más sano para el perro: aprende a convivir y gasta energía.',
          },
          {
            type: 'p',
            text: 'Algunas personas también buscan pareja para una cruza. Si es tu caso, conviene hacerlo con responsabilidad: revisión veterinaria de ambos perros, conocer el historial de salud y de carácter, y acuerdos claros entre los dueños. En WeraWoof puedes indicar en el perfil lo que buscas, de modo que cada quien sepa de antemano de qué se trata.',
          },
        ],
      },
      {
        heading: 'Qué ofrece WeraWoof',
        blocks: [
          {
            type: 'p',
            text: 'WeraWoof es una app web gratuita pensada para dueños de perros en México. Estas son sus funciones principales:',
          },
          {
            type: 'ul',
            items: [
              'Perfil del perro con fotos, raza y nivel de energía.',
              'Swipe para descubrir perros cercanos.',
              'Match cuando el like es de los dos.',
              'Chat entre dueños para organizar el encuentro.',
              'Búsqueda por cercanía con un radio de 1 a 100 km.',
              'Inicio de sesión con correo o con Google.',
              'Instalación como PWA desde el navegador, sin pasar por una tienda de aplicaciones.',
            ],
          },
          {
            type: 'p',
            text: 'La app solo usa tu ubicación aproximada y los demás usuarios ven únicamente la distancia en kilómetros, no el punto exacto. Puedes borrar tu cuenta cuando quieras desde tu perfil.',
          },
        ],
      },
      {
        heading: 'Cómo usarla con seguridad',
        blocks: [
          {
            type: 'p',
            text: 'Conocer gente por una app tiene sus riesgos, y vale la pena tener hábitos claros desde el principio:',
          },
          {
            type: 'ul',
            items: [
              'Chatea primero. Pregunta por el carácter del perro, sus vacunas y su experiencia con otros perros antes de proponer una cita.',
              'Reúnete en un lugar público y con movimiento, como un parque, y no en casa de nadie la primera vez.',
              'Avisa a alguien de confianza dónde estarás y a qué hora.',
              'No compartas tu dirección exacta ni datos sensibles en el chat.',
              'Presenta a los perros con correa y con calma, como se explica en nuestra guía de playdates.',
              'Confía en tu intuición: si algo no te late, cancela sin dar explicaciones largas.',
            ],
          },
        ],
      },
      {
        heading: 'Cómo hacer un buen perfil para tu perro',
        blocks: [
          {
            type: 'p',
            text: 'Un buen perfil ayuda a que los matches sean de calidad. Usa fotos claras en las que se vea bien a tu perro, de cuerpo completo y de cerca. Escribe su nivel de energía con honestidad, porque un perro tranquilo y uno hiperactivo no siempre se entienden.',
          },
          {
            type: 'p',
            text: 'Cuenta lo que le gusta y también lo que no: si es tímido, si no le gustan los cachorros muy intensos o si prefiere jugar con perros de su tamaño. Ser transparente evita malos ratos para todos. Si tu perro es tímido o adulto, la guía para socializar a un perro adulto o tímido te ayudará a prepararte para el primer encuentro.',
          },
        ],
      },
      {
        heading: 'Preguntas frecuentes',
        blocks: [
          { type: 'h3', text: '¿Es solo para cruzas?' },
          {
            type: 'p',
            text: 'No. La mayoría de la gente busca amigos para su perro. Si buscas pareja para cruza, puedes decirlo en el perfil.',
          },
          { type: 'h3', text: '¿Es gratis?' },
          {
            type: 'p',
            text: 'Sí. Crear tu cuenta, el perfil de tu perro, los matches y el chat no tienen costo en WeraWoof.',
          },
          { type: 'h3', text: '¿Funciona fuera de la Ciudad de México?' },
          {
            type: 'p',
            text: 'Funciona en toda la República Mexicana. Entre más personas de tu zona se unan, más perros verás cerca de ti.',
          },
          { type: 'h3', text: '¿Necesito descargarla de una tienda?' },
          {
            type: 'p',
            text: 'No. Abre werawoof.com en tu navegador y, si quieres, agrégala a la pantalla de inicio de tu teléfono para usarla como una app.',
          },
        ],
      },
    ],
  },
  {
    slug: 'como-presentar-dos-perros-por-primera-vez',
    title: 'Cómo presentar dos perros por primera vez',
    metaTitle: 'Cómo presentar dos perros por primera vez',
    description:
      'Cómo presentar dos perros por primera vez: lugar neutral, paseo en paralelo, lenguaje corporal y cuándo separarlos. Incluye qué hacer si vivirán juntos.',
    datePublished: '2026-10-15',
    dateModified: '2026-10-15',
    readingMinutes: 5,
    intro:
      'Para presentar dos perros por primera vez, elige un lugar neutral, usa correas flojas y empieza caminando en paralelo a distancia. Acorta la distancia poco a poco, permite olfateos breves y sepáralos antes de que la emoción suba. Observa su lenguaje corporal y, si ves rigidez, gruñidos o mirada fija, aléjalos con calma y vuelve a intentarlo otro día. Si van a vivir juntos, el primer encuentro también debe ser fuera de casa.',
    sections: [
      {
        heading: 'Por qué la primera presentación importa',
        blocks: [
          {
            type: 'p',
            text: 'Los perros se forman una impresión del otro en los primeros minutos, y esa impresión pesa en los encuentros siguientes. Una presentación tensa, apresurada o frente a frente puede dejar a uno de los dos con una mala experiencia que se repite cada vez que se vean.',
          },
          {
            type: 'p',
            text: 'Hacerlo con calma no garantiza que vayan a ser mejores amigos, porque a veces simplemente no hay química. Lo que sí logra es que el primer contacto sea seguro, que ninguno se sienta acorralado y que tú tengas margen para intervenir antes de que algo escale.',
          },
        ],
      },
      {
        heading: 'Antes del encuentro',
        blocks: [
          {
            type: 'p',
            text: 'Una buena presentación se prepara antes de salir de casa. Conviene cuidar estos puntos:',
          },
          {
            type: 'ul',
            items: [
              'Salud: confirma con el otro dueño que ambos perros tengan vacunas y desparasitación al día, y que ninguno esté enfermo. Si tienes dudas, consulta a tu veterinario.',
              'Equipo: correas largas pero resistentes y arneses o collares que no se puedan zafar. Evita las correas retráctiles, porque se tensan de golpe.',
              'Lugar neutral: ni la casa ni el parque habitual de alguno de los dos. Un espacio que ninguno considere suyo reduce la defensa del territorio.',
              'Dos personas: cada perro debe ir con su propio dueño, que lo conozca y pueda leerlo.',
              'Sin juguetes ni comida: los recursos son una causa frecuente de conflicto, así que déjalos en casa.',
              'Horario tranquilo: temprano en la mañana o al final de la tarde, cuando hay menos gente, menos ruido y menos calor.',
            ],
          },
        ],
      },
      {
        heading: 'La presentación, paso a paso',
        blocks: [
          {
            type: 'ol',
            items: [
              'Caminen en paralelo. Empiecen a una distancia en la que ninguno de los dos reaccione, con los perros del lado contrario al del otro dueño. Un paseo así puede durar varios minutos.',
              'Acorten la distancia por turnos. Si ambos se ven relajados, acérquense un poco; si alguno se tensa, vuelvan a separarse. No hay prisa.',
              'Permitan un olfateo breve, de dos o tres segundos, con la correa floja. Una correa tensa transmite nerviosismo al perro.',
              'Sepárenlos y repitan. Caminen unos pasos, dejen que se calmen y vuelvan a acercarlos. Varios contactos cortos funcionan mejor que uno largo.',
              'Suéltenlos solo si todo va bien y existe una zona cercada. Dejen primero las correas arrastrando si es seguro, y mantengan la sesión corta.',
            ],
          },
          {
            type: 'p',
            text: 'Si en cualquier paso algo no se ve bien, regresa al anterior. No es un fracaso: así se construye la confianza.',
          },
        ],
      },
      {
        heading: 'Cómo leer el lenguaje corporal',
        blocks: [
          {
            type: 'p',
            text: 'Durante toda la presentación, fíjate más en el cuerpo de los perros que en sus ladridos. Estas son señales buenas:',
          },
          {
            type: 'ul',
            items: [
              'Cuerpo suelto y movimientos flexibles, casi como si se sacudieran.',
              'La reverencia de juego: pecho abajo, trasero arriba.',
              'Pausas por voluntad propia, olfateo del suelo o rascarse, que ayudan a bajar la tensión.',
              'Turnos al perseguir: a veces uno corre y a veces el otro.',
            ],
          },
          {
            type: 'h3',
            text: 'Señales de alerta',
          },
          {
            type: 'ul',
            items: [
              'Cuerpo rígido y movimientos lentos y tiesos.',
              'Mirada fija, sin parpadear.',
              'Pelo erizado en el lomo.',
              'Gruñidos serios, labios levantados o dientes visibles.',
              'Cola rígida y alta, aunque se mueva.',
              'Intentos insistentes de montar al otro perro o de acorralarlo.',
            ],
          },
        ],
      },
      {
        heading: 'Cuándo cortar el encuentro y cómo',
        blocks: [
          {
            type: 'p',
            text: 'Si ves varias señales de alerta, termina el encuentro sin dramatismo. Llama a tu perro con voz tranquila, distráelo con una golosina o un cambio de dirección y aléjate en un arco amplio, sin jalar la correa de golpe. Un tirón brusco puede aumentar la tensión y asustar más al perro.',
          },
          {
            type: 'p',
            text: 'No hace falta decidir que esos dos perros nunca podrán convivir. Pueden haber estado nerviosos, cansados o con demasiada energía. Retomen otro día, a mayor distancia y con una sesión más corta. Si después de varios intentos hay gruñidos fuertes o peleas, consulta a un entrenador o etólogo con métodos basados en premios.',
          },
        ],
      },
      {
        heading: 'Si uno va a vivir con el otro',
        blocks: [
          {
            type: 'p',
            text: 'Cuando un perro nuevo llegará a una casa donde ya vive otro, la primera presentación también debe ser afuera, en terreno neutral. Después de un paseo juntos, entren a casa primero con el perro que ya vive ahí, y luego con el nuevo, con las correas puestas.',
          },
          {
            type: 'ul',
            items: [
              'Retira de la vista juguetes, huesos, platos de comida y camas, al menos los primeros días.',
              'Supervisa todas las interacciones y no los dejes solos hasta que veas que conviven con tranquilidad.',
              'Dales descansos separados, cada uno con su espacio, su cama y su plato.',
              'Dale atención al perro que ya vivía en casa, para que no sienta que lo desplazaron.',
            ],
          },
          {
            type: 'p',
            text: 'La adaptación puede tardar días o semanas. Si hay tensión constante, pide orientación profesional.',
          },
        ],
      },
      {
        heading: 'Errores comunes',
        blocks: [
          {
            type: 'ul',
            items: [
              'Acercarlos frente a frente con la correa tensa, que se interpreta como un desafío.',
              'Forzarlos a olfatearse cuando uno de los dos intenta alejarse.',
              'Regañar o castigar el gruñido: es una advertencia, y si lo castigas el perro puede dejar de avisar.',
              'Hacer encuentros largos desde el principio, en lugar de varios cortos.',
              'Presentarlos en la casa o en el parque favorito de uno de los dos.',
              'Ignorar el lenguaje corporal porque el otro dueño dice que su perro es muy bueno.',
            ],
          },
        ],
      },
      {
        heading: 'Cómo encontrar buenos candidatos para presentar',
        blocks: [
          {
            type: 'p',
            text: 'Una presentación sale mejor cuando ya sabes algo del otro perro: su edad, tamaño, nivel de energía y cómo reacciona con perros desconocidos. Eso lo puedes conseguir platicando con vecinos, con compañeros de paseo o en la veterinaria, siempre que el otro dueño sea honesto.',
          },
          {
            type: 'p',
            text: 'Otra opción es una app como WeraWoof, donde cada perfil muestra la edad, el tamaño, la raza y las etiquetas de personalidad del perro, como enérgico, tranquilo o tímido, antes de quedar. Si te interesa organizar el resto del encuentro, tenemos una guía sobre cómo organizar un playdate seguro. En México, lo importante es que cualquier primera cita sea en un lugar público y con tiempo para ir despacio.',
          },
        ],
      },
    ],
  },
  {
    slug: 'que-raza-es-mi-perro-como-saberlo',
    title: 'Qué raza es mi perro: cómo saberlo',
    metaTitle: 'Qué raza es mi perro: cómo saberlo',
    description:
      'Cómo saber qué raza es tu perro: pistas físicas y de comportamiento, opinión del veterinario, pruebas de ADN y sus límites. Para qué sirve y para qué no.',
    datePublished: '2026-10-15',
    dateModified: '2026-10-15',
    readingMinutes: 5,
    intro:
      'Para saber qué raza es tu perro puedes fijarte en su tamaño, cabeza, orejas, pelaje y comportamiento, pedir la opinión de tu veterinario o hacer una prueba de ADN. Las dos primeras opciones son solo estimaciones, y la prueba de ADN es la más precisa, aunque tiene límites. En México la mayoría de los perros son mestizos, y conocer su mezcla ayuda con el ejercicio y la salud, pero no define su carácter.',
    sections: [
      {
        heading: 'La mayoría de los perros en México son mestizos',
        blocks: [
          {
            type: 'p',
            text: 'Si no sabes qué raza es tu perro, estás en buena compañía. En México y en muchos países, una gran parte de los perros son mestizos, es decir, el resultado de varias razas mezcladas a lo largo de generaciones. Muchos llegaron a casa por adopción, regalo o rescate, sin papeles ni pedigrí.',
          },
          {
            type: 'p',
            text: 'Eso no es un problema. Un perro mestizo puede ser tan sano, cariñoso y fácil de educar como cualquier otro. Lo que importa es conocerlo a él: cuánta energía tiene, cómo juega y cómo se lleva con otros perros. La raza es solo una pista más.',
          },
        ],
      },
      {
        heading: 'Pistas físicas',
        blocks: [
          {
            type: 'p',
            text: 'La forma más sencilla de empezar es observar su cuerpo. Algunos rasgos que suelen dar pistas:',
          },
          {
            type: 'ul',
            items: [
              'Tamaño y peso adulto: separan a las razas pequeñas de las medianas y grandes.',
              'Forma de la cabeza y el hocico: corto y ancho, largo y fino, o de proporciones medias.',
              'Orejas: paradas, caídas, semicaídas o en forma de botón.',
              'Pelaje: corto, largo, rizado, duro o doble capa, y sus colores y manchas.',
              'Cola: larga, enroscada, corta o con mucho pelo.',
              'Patas y complexión: cuerpo largo y patas cortas, o patas largas y pecho profundo.',
            ],
          },
          {
            type: 'p',
            text: 'Estas pistas engañan sobre todo en cachorros. Un cachorro de pocas semanas puede cambiar mucho de tamaño, de color de pelo y de forma de orejas al crecer, y es común que un cachorro que parecía de una raza termine pareciéndose a otra.',
          },
        ],
      },
      {
        heading: 'Pistas de comportamiento',
        blocks: [
          {
            type: 'p',
            text: 'Algunas razas se criaron durante generaciones para tareas concretas, y a veces esos instintos aparecen en perros mestizos:',
          },
          {
            type: 'ul',
            items: [
              'Pastoreo: rodear, empujar o intentar agrupar personas, niños u otros animales.',
              'Rastreo: pasar mucho tiempo con la nariz pegada al suelo, siguiendo olores.',
              'Cobro: cargar objetos en la boca y traerlos de vuelta con entusiasmo.',
              'Guardia: vigilar la casa, ladrar a los extraños y mantenerse alerta.',
            ],
          },
          {
            type: 'p',
            text: 'Estas conductas sugieren una herencia, pero no prueban nada. Un perro puede cobrar pelotas sin tener sangre de retriever, y muchos perros ladran a los extraños por la forma en que fueron criados y socializados. Tómalas como una pista, no como un diagnóstico.',
          },
        ],
      },
      {
        heading: 'La opinión del veterinario',
        blocks: [
          {
            type: 'p',
            text: 'Tu veterinario ve muchos perros y suele reconocer rasgos de razas a simple vista. Puede decirte, por ejemplo, que tu perro tiene una complexión parecida a la de cierto grupo de razas. También puede orientarte sobre el tamaño adulto esperado y las revisiones de salud que convienen según la edad.',
          },
          {
            type: 'p',
            text: 'Aun así, es una estimación basada en rasgos visibles, no una confirmación. En un mestizo con varias razas mezcladas, dos profesionales pueden dar opiniones distintas, y ninguna es definitiva.',
          },
        ],
      },
      {
        heading: 'Pruebas de ADN para perros',
        blocks: [
          {
            type: 'p',
            text: 'Las pruebas de ADN son la opción más precisa. En general funcionan así: tomas una muestra con un hisopo de la parte interna de la mejilla de tu perro, la envías a un laboratorio y recibes un reporte. Ese reporte suele indicar los porcentajes de las razas que detectó y, en algunos casos, ciertas predisposiciones de salud.',
          },
          {
            type: 'ul',
            items: [
              'El resultado depende de las razas que el laboratorio tiene en su base de datos, por lo que algunas mezclas, sobre todo de razas poco comunes o locales, pueden quedar sin identificar.',
              'Los porcentajes son estimaciones y pueden cambiar si el laboratorio actualiza su base.',
              'Las predisposiciones de salud son riesgos, no diagnósticos. Coméntalas con tu veterinario antes de tomar decisiones.',
              'El costo y el servicio varían según la empresa y la disponibilidad en México, así que conviene comparar antes de comprar.',
            ],
          },
        ],
      },
      {
        heading: 'Apps y fotos para identificar la raza',
        blocks: [
          {
            type: 'p',
            text: 'Existen apps que analizan una foto y sugieren una raza. Son divertidas y pueden servir como curiosidad, pero son poco fiables con los mestizos, porque están pensadas para compararlos contra razas puras. El resultado cambia con el ángulo de la foto, la luz y la postura del perro. No tomes decisiones de salud ni de entrenamiento basándote en ellas.',
          },
        ],
      },
      {
        heading: 'Para qué sirve saberlo y para qué no',
        blocks: [
          {
            type: 'p',
            text: 'Conocer la posible mezcla de tu perro puede ayudarte con varias cosas prácticas:',
          },
          {
            type: 'ul',
            items: [
              'Ejercicio: una mezcla de razas muy activas necesita más actividad y estímulo mental que una de razas tranquilas.',
              'Salud: algunas razas tienen más riesgo de ciertos problemas, y tu veterinario puede vigilarlos desde temprano.',
              'Convivencia: saber qué instintos puede tener te ayuda a entender por qué persigue, cava o ladra.',
            ],
          },
          {
            type: 'p',
            text: 'Lo que no hace es definir su carácter. Dos perros de la misma raza pueden ser muy distintos, y un perro con fama de rudo puede ser cariñoso, o al revés. La crianza, la socialización y la personalidad pesan mucho más que la etiqueta.',
          },
        ],
      },
      {
        heading: 'Mestizo con orgullo',
        blocks: [
          {
            type: 'p',
            text: 'Si tu perro es mestizo, no necesitas encontrar una raza para presentarlo. En WeraWoof, la lista de razas empieza con la opción "Mestizo", y el perfil muestra su tamaño y sus etiquetas de personalidad, como juguetón, tranquilo o enérgico, que son los datos que realmente ayudan a encontrar amigos compatibles.',
          },
          {
            type: 'p',
            text: 'Lo que cuenta al buscar compañeros de juego es cómo se comporta tu perro con otros perros, no su árbol genealógico. Si quieres saber cómo dar el primer paso, revisa nuestra guía sobre cómo presentar dos perros por primera vez.',
          },
        ],
      },
    ],
  },
  {
    slug: 'como-encontrar-amigos-para-tu-perro',
    title: 'Cómo encontrar amigos para tu perro',
    metaTitle: 'Cómo encontrar amigos para tu perro',
    description:
      'Dónde y cómo encontrar amigos para tu perro en México: qué tipo de compañero buscar, lugares, primer encuentro y cómo mantener la amistad.',
    datePublished: '2026-10-15',
    dateModified: '2026-10-15',
    readingMinutes: 5,
    intro:
      'Para encontrar amigos para tu perro, primero define qué tipo de compañero le conviene según su tamaño, energía y estilo de juego. Después busca en parques, grupos de paseo de tu colonia, escuelas de adiestramiento, veterinarias y apps para dueños de perros. Haz un primer encuentro corto en un lugar neutral y mantén la amistad con constancia. No todos los perros quieren muchos amigos, y está bien que tu perro tenga solo uno o dos.',
    sections: [
      {
        heading: 'Por qué un perro necesita amigos perrunos',
        blocks: [
          {
            type: 'p',
            text: 'Tu perro te quiere a ti, pero convivir con otros perros le da algo que las personas no pueden dar: un compañero que entiende su idioma. Jugar con otros perros le permite gastar energía, practicar sus modales, aprender a leer señales y a poner límites sin lastimar.',
          },
          {
            type: 'p',
            text: 'Esto no es solo para cachorros. Los perros adultos y mayores también se benefician de tener compañía, aunque su forma de jugar cambie con la edad. Un paseo con un amigo conocido suele ser más estimulante para el perro que el mismo recorrido de siempre en solitario.',
          },
        ],
      },
      {
        heading: 'Qué tipo de amigo busca tu perro',
        blocks: [
          {
            type: 'p',
            text: 'Antes de buscar, observa a tu perro. Una buena amistad depende de la compatibilidad más que de la raza:',
          },
          {
            type: 'ul',
            items: [
              'Tamaño: un perro pequeño y uno muy grande pueden llevarse bien, pero el juego brusco del grande puede lastimar al chico sin querer.',
              'Energía: un perro tranquilo y uno muy activo se desgastan mutuamente. Busca ritmos parecidos.',
              'Estilo de juego: perseguir, luchar, jalar juguetes u olfatear. Los estilos compatibles evitan malentendidos.',
              'Edad: los cachorros y los perros mayores suelen necesitar compañeros más suaves.',
            ],
          },
          {
            type: 'p',
            text: 'También conviene aceptar que no todos los perros quieren muchos amigos. Algunos prefieren paseos tranquilos y uno o dos compañeros de confianza, y eso es perfectamente normal. Si el tuyo es tímido, ve a su ritmo.',
          },
        ],
      },
      {
        heading: 'Dónde buscar en México',
        blocks: [
          {
            type: 'p',
            text: 'No hace falta ir lejos. Estos son lugares comunes para conocer a otros dueños:',
          },
          {
            type: 'ul',
            items: [
              'Parques y áreas caninas: en la Ciudad de México y otras ciudades hay parques donde se ve a muchos dueños paseando. Confirma en el lugar las reglas de correa y horarios.',
              'Grupos de paseo de tu colonia: muchos vecinos se organizan por mensajería para salir a caminar a la misma hora.',
              'Escuelas de adiestramiento y clases de cachorros: los perros ahí ya están en un entorno controlado y con guía profesional.',
              'Veterinarias y estéticas caninas: pregunta si hay tablón de avisos o si conocen a otros dueños con perros parecidos al tuyo.',
              'Vecinos y familia: a veces el mejor amigo del perro vive en la misma calle.',
              'Eventos pet friendly: ferias, convivencias o actividades abiertas para perros.',
              'Apps para dueños de perros: permiten buscar por cercanía y carácter antes de salir.',
            ],
          },
        ],
      },
      {
        heading: 'Cómo acercarte a otro dueño sin incomodar',
        blocks: [
          {
            type: 'p',
            text: 'Antes de dejar que tu perro se acerque a otro, pregunta. Una frase sencilla como "¿le gusta jugar con otros perros?" funciona, y si la respuesta es no, respétala sin insistir. Hay perros en entrenamiento, en recuperación o con miedo a otros perros, y sus dueños agradecen que se les dé espacio.',
          },
          {
            type: 'p',
            text: 'Si hay buena respuesta, pregunta lo básico: edad, tamaño, si está vacunado y cómo reacciona con perros desconocidos. Cuéntale también cómo es el tuyo. La honestidad desde el principio evita malos ratos.',
          },
        ],
      },
      {
        heading: 'El primer encuentro',
        blocks: [
          {
            type: 'p',
            text: 'Haz que el primer encuentro sea corto y sin presión. Elige un lugar neutral, usa correas flojas y empiecen caminando juntos antes de dejar que se huelan. Observa el lenguaje corporal de ambos y termina antes de que alguno se canse.',
          },
          {
            type: 'p',
            text: 'Tenemos una guía sobre cómo presentar dos perros por primera vez, con los pasos y las señales que conviene vigilar. Y si quieres organizar una cita de juego completa, revisa la guía sobre cómo organizar un playdate seguro.',
          },
        ],
      },
      {
        heading: 'Cómo mantener la amistad',
        blocks: [
          {
            type: 'ul',
            items: [
              'Constancia: varios encuentros cortos a lo largo de las semanas valen más que uno muy largo.',
              'Horarios: acordar un día y una hora fija, como el sábado por la mañana, facilita que ocurra.',
              'Turnarse los lugares: así ningún perro siente que siempre juega en terreno ajeno.',
              'Un grupo de chat entre dueños: sirve para avisar si alguien llega tarde, cancelar o proponer otro plan.',
              'Respeto a los límites: si un día alguno de los perros no tiene ganas, se cancela y ya.',
            ],
          },
        ],
      },
      {
        heading: 'Señales de que no son compatibles',
        blocks: [
          {
            type: 'p',
            text: 'A veces dos perros simplemente no congenian, y no pasa nada. Fíjate en estas señales después de varios encuentros:',
          },
          {
            type: 'ul',
            items: [
              'Uno de los dos intenta esconderse, se pega a su dueño o evita al otro.',
              'El juego siempre es de uno que acosa y otro que huye.',
              'Hay gruñidos, rigidez o mirada fija con frecuencia.',
              'Uno defiende juguetes, comida o a su dueño cada vez que se ven.',
            ],
          },
          {
            type: 'p',
            text: 'Si pasa esto, no los obligues. Pueden convivir con paseos en paralelo a distancia o simplemente buscar otros compañeros. Si hay conductas fuertes, consulta a un entrenador profesional.',
          },
        ],
      },
      {
        heading: 'Cómo ayuda una app como WeraWoof',
        blocks: [
          {
            type: 'p',
            text: 'Buscar por casualidad en el parque funciona a veces, pero una app permite elegir antes de salir. En WeraWoof creas el perfil de tu perro con sus fotos, su tamaño y sus etiquetas de personalidad, haces swipe entre perros cercanos en un radio de 1 a 100 km y, cuando hay match, usas el chat para quedar en el parque.',
          },
          {
            type: 'p',
            text: 'La app es gratuita y se usa desde el navegador, sin descargarla de una tienda. Funciona en toda la República Mexicana, y entre más dueños de tu zona se sumen, más amigos posibles verás cerca de ti.',
          },
        ],
      },
    ],
  },
]

export const getGuia = (slug: string): Guia | undefined => guias.find((g) => g.slug === slug)

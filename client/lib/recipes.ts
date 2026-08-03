export type RecipeIngredientGroup = {
  title: string
  items: string[]
}

export type Recipe = {
  slug: string
  title: string
  servings: string
  measurementNote: string
  ingredientGroups: RecipeIngredientGroup[]
  /** Preparation order — a standard method for this ingredient set, not a
   *  verbatim transcription of the source blog post (which only listed
   *  ingredients). */
  steps: string[]
  sourceUrl?: string
}

export const RECIPES: Recipe[] = [
  {
    slug: 'budae-jjigae',
    title: '부대찌개',
    servings: '3-4인분',
    measurementNote: '계량 기준: 밥숟가락, 180ml컵',
    ingredientGroups: [
      {
        title: '재료 준비',
        items: [
          '물 1L',
          '다진 마늘 크게 1숟가락',
          '스팸 1캔 (200g)',
          '비엔나소시지 혹은 후랑크 소시지 3줄',
          '대파 1대',
          '양파 1/2개',
          '베이크드빈스 듬뿍 1숟가락',
          '케첩 2숟가락',
          '떡국떡 한 줌',
        ],
      },
      {
        title: '찌개 양념장',
        items: [
          '고추장 1숟가락',
          '고춧가루 1숟가락',
          '진간장 1숟가락',
          '멸치 액젓 1숟가락',
          '설탕 0.2숟가락',
          '후춧가루 약간',
        ],
      },
    ],
    steps: [
      '고추장, 고춧가루, 진간장, 멸치 액젓, 설탕, 후춧가루를 섞어 찌개 양념장을 만들어둡니다.',
      '스팸과 소시지는 한입 크기로 썰고, 대파와 양파도 먹기 좋게 채 썹니다.',
      '냄비에 물 1L를 붓고 다진 마늘과 양념장을 넣어 잘 풀어줍니다.',
      '스팸, 소시지, 양파, 베이크드빈스, 케첩을 넣고 센 불에서 끓입니다.',
      '한 번 끓어오르면 대파와 떡국떡을 넣고, 떡이 부드러워질 때까지 한 번 더 끓입니다.',
      '간을 보고 부족하면 소금이나 후춧가루로 마무리합니다.',
    ],
    sourceUrl: 'https://blog.naver.com/peace8012/224118164934',
  },
  {
    slug: 'dak-gomtang',
    title: '닭봉으로 끓인 닭곰탕',
    servings: '2-3인분',
    measurementNote: '닭한마리나 닭볶음용 닭을 써도 됩니다',
    ingredientGroups: [
      {
        title: '재료 준비',
        items: [
          '닭봉 500g (또는 닭볶음용 닭 800g~1마리)',
          '양파 1개',
          '대파 1대',
          '마늘 10알',
          '소주 약간 (데치기용)',
          '소금, 후추 약간',
        ],
      },
    ],
    steps: [
      '냄비에 물과 닭봉, 소주를 넣고 3~5분간 끓인 뒤 물을 버리고 불순물을 씻어냅니다.',
      '깨끗한 물 1.5~2L를 붓고 데친 닭봉, 양파, 대파, 마늘을 넣습니다.',
      '센 불에서 끓이다가 끓어오르면 중약불로 줄여 40~50분간 거품을 걷어내며 푹 끓입니다.',
      '익은 닭고기를 건져 식힌 뒤 먹기 좋게 찢고, 채소 건더기는 건져냅니다.',
      '육수에 소금과 후추로 간을 하고, 찢은 닭살과 송송 썬 대파를 고명으로 올려 마무리합니다.',
    ],
    sourceUrl: 'https://blog.naver.com/teaser1/224250045192',
  },
  {
    slug: 'spam-gangdoenjang-ssambap',
    title: '스팸 강된장 쌈밥',
    servings: '2인분',
    measurementNote: '계량 기준: 밥숟가락',
    ingredientGroups: [
      {
        title: '재료 준비',
        items: [
          '스팸 1캔',
          '두부 1모',
          '된장 1숟가락',
          '고추장 1숟가락',
          '양파 1개',
          '표고버섯 적당량',
          '다진 마늘 1숟가락',
          '대파, 청양고추 (선택)',
          '설탕 약간',
          '쌈용 양배추 (선택)',
        ],
      },
    ],
    steps: [
      '스팸을 잘게 썰어 팬에 살짝 볶습니다.',
      '된장 1숟가락, 고추장 1숟가락, 다진 마늘 1숟가락을 넣고 함께 볶습니다.',
      '다진 양파와 표고버섯을 넣고 볶은 뒤 두부를 큼직하게 썰어 넣습니다.',
      '물을 자작하게 붓고 청양고추와 설탕 약간을 넣어 국물이 졸아들 때까지 끓입니다.',
      '쌈용 양배추를 곁들일 경우, 랩을 씌워 구멍을 낸 뒤 전자레인지에 7분 돌려 함께 냅니다.',
    ],
  },
  {
    slug: 'spam-egg-gimbap',
    title: '스팸 계란 김밥',
    servings: '2-3줄',
    measurementNote: '계량 기준: 밥숟가락(T)',
    ingredientGroups: [
      {
        title: '재료 준비',
        items: [
          '스팸 1캔',
          '계란 3개',
          '밥 1공기',
          '다진 양파',
          '고추 또는 쪽파',
          '김 (김밥용)',
          '간장 1큰술',
          '참기름 1큰술',
          '통깨, 후추 약간',
        ],
      },
    ],
    steps: [
      '스팸을 잘게 썰어 다진 양파, 후추와 함께 노릇하게 볶습니다.',
      '계란 3개를 스크램블한 뒤 볶은 스팸과 섞습니다.',
      '밥에 볶은 재료, 간장 1큰술, 참기름 1큰술, 통깨, 고추 또는 쪽파를 넣고 고루 비빕니다.',
      '김 위에 밥을 얇게 펴고 단단하게 말아 먹기 좋은 크기로 썰면 완성입니다.',
    ],
  },
]

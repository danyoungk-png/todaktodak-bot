import { WorryPost, CheerCard } from '../types/counseling';

export const INITIAL_WORRIES: WorryPost[] = [
  {
    id: 'worry-1',
    category: '진로/취업',
    nickname: '새벽 열람실 17번',
    avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    emotion: '막막함과 자책',
    intensity: 4,
    content: '올해 4학년 2학기인데 서류를 12군데 넣고 전부 불합격 통보를 받았어요. 부모님께는 다 잘되고 있다고 거짓말했는데, 도서관 화장실에서 혼자 펑펑 울었습니다. 남들은 다 앞서가는데 저만 멈춰 있는 빈 껍데기 같아요...',
    createdAt: '10분 전',
    likes: {
      hug: 42,
      warmth: 38,
      youCanDoIt: 51,
    },
    comments: [
      {
        id: 'c-1',
        nickname: '취업 1년차 선배',
        text: '저도 작년에 30군데 떨어지고 세상이 무너지는 줄 알았어요. 서류 탈락은 당신의 가치가 부족해서가 아니라 단지 그 회사의 타이밍과 맞지 않았을 뿐이에요. 오늘 밤엔 맛있는 거 꼭 챙겨먹어요.',
        createdAt: '5분 전',
      },
      {
        id: 'c-2',
        nickname: '같은 4학년 곰돌이',
        text: '화장실에서 울었다는 말에 제 이야기 같아서 가슴이 찡하네요... 우리 조급해하지 말아요. 당신은 이미 정말 열심히 살아왔어요.',
        createdAt: '2분 전',
      },
    ],
    aiResponse: {
      empathySummary: '캄캄한 터널 속에 홀로 서 있는 듯한 외로움과 미안함이 느껴져 마음이 아픕니다.',
      deepComfort: '12번의 불합격 통보는 결코 당신이라는 사람의 존재 가치나 가능성에 대한 성적표가 아닙니다. 취업 시장은 너무나 많은 변수와 타이밍이 작용하는 곳이에요. 부모님께 짐이 되기 싫어 홀로 눈물을 삼킨 당신의 다정한 마음과 책임감이야말로 무엇보다 빛나는 보석입니다. 지금은 잠시 숨을 고를 때예요.',
      psychologicalReframing: '불합격은 "거절"이 아니라 나에게 진짜 맞는 자리를 찾아가는 과정에서의 "방향 조정"입니다. 지금까지 성실히 달려온 당신의 발걸음은 헛되지 않았습니다.',
      microActions: [
        { title: '오늘 하루 취업 사이트 닫기', description: '오늘은 채용 공고창을 모두 닫고 뇌에게 완전한 휴식을 선물하세요.' },
        { title: '좋아하는 따뜻한 음료 한 잔', description: '달콤한 핫초코나 따뜻한 유자차를 마시며 나 자신을 안아주세요.' },
        { title: '잘한 일 3가지 적어보기', description: '취업 스펙 말고 "오늘 아침 일어난 것", "도서관에 간 것" 등 작은 실천을 칭찬해주세요.' }
      ],
      pocketCheer: '속도가 아니라 방향입니다. 당신의 봄은 반드시 피어납니다.',
      recommendedQuote: '길을 잃는다는 것은 곧 새로운 길을 발견한다는 뜻이다. - 괴테'
    }
  },
  {
    id: 'worry-2',
    category: '학업/시험',
    nickname: '아아메로 버티는 자',
    avatarColor: 'bg-amber-100 text-amber-700 border-amber-300',
    emotion: '극심한 피로와 억울함',
    intensity: 4,
    content: '전공 5인 1조 팀플인데 3명은 연락 두절이고 1명은 아프다고 자료조사 2줄 보내왔습니다. 발표가 모레인데 결국 저 혼자 밤새 자료 찾고 PPT 만들고 있어요. 왜 늘 착하게 책임감 있게 행동하는 사람만 손해를 봐야 하나요?',
    createdAt: '35분 전',
    likes: {
      hug: 88,
      warmth: 46,
      youCanDoIt: 72,
    },
    comments: [
      {
        id: 'c-3',
        nickname: '조별과제 생존자',
        text: '진짜 너무 화나고 억울하시겠어요ㅠㅠ 교수님께 역할 분담 명확히 기재해서 제출하시고, 본인 멘탈 먼저 챙기세요!',
        createdAt: '20분 전',
      }
    ],
    aiResponse: {
      empathySummary: '혼자서 모든 짐을 떠안고 모니터 앞을 지키는 당신의 억울함과 허탈함에 깊이 공감합니다.',
      deepComfort: '책임감 있게 끝까지 프로젝트를 포기하지 않는 당신의 성실함은 대단하지만, 타인의 불성실함까지 당신의 건강과 맞바꿀 필요는 없습니다. 혼자 끙끙 앓지 마시고, 작성 과정의 기여도와 타임라인을 객관적으로 기록해 교수님께 제출하세요.',
      psychologicalReframing: '착해서 손해를 보는 게 아니라, 당신에게 "완주할 줄 아는 실행력"이라는 강력한 강점이 있는 것입니다. 다만 타인의 몫까지 책임지는 경계(Boundary)를 부드럽게 세우는 법을 배우는 계기로 삼아보세요.',
      microActions: [
        { title: '기여도 파일 별도 저장', description: '감정을 빼고 날짜별 참여 여부와 기여도를 팩트 위주로 캡처해 두세요.' },
        { title: '5분간 어깨와 목 스트레칭', description: '긴장된 승모근을 풀고 물 한 잔을 마시며 심호흡하세요.' },
        { title: '발표 후 나만의 보상 정하기', description: '발표가 끝나면 제일 먹고 싶었던 치킨이나 케이크를 먹기로 약속하세요.' }
      ],
      pocketCheer: '당신의 정직함과 책임감은 언젠가 반드시 가장 큰 무기가 됩니다.',
      recommendedQuote: '내가 흘린 땀방울은 절대 나를 배신하지 않는다.'
    }
  },
  {
    id: 'worry-3',
    category: '인간관계/친구',
    nickname: '혼밥이 어색한 새내기',
    avatarColor: 'bg-purple-100 text-purple-700 border-purple-300',
    emotion: '외로움과 소외감',
    intensity: 3,
    content: '동기들은 벌써 삼삼오오 무리 지어 다니고 밥도 같이 먹는데, 저는 아직 친한 친구를 못 만들었어요. 과방에 들어갈 때마다 숨이 턱 막히고, 학생식당에서 혼자 밥 먹을 때 남들이 쳐다보는 것 같아 체할 것 같아요.',
    createdAt: '1시간 전',
    likes: {
      hug: 63,
      warmth: 55,
      youCanDoIt: 34,
    },
    comments: [
      {
        id: 'c-4',
        nickname: '혼밥 레벨 99 선배',
        text: '에어팟 끼고 유튜브 보면서 혼밥하는 게 대학 생활 최고의 자유예요! 아무도 신경 안 쓰니까 당당하게 드셔도 돼요 ㅎㅎ',
        createdAt: '40분 전',
      }
    ]
  },
  {
    id: 'worry-4',
    category: '번아웃/무기력',
    nickname: '배터리 1%',
    avatarColor: 'bg-rose-100 text-rose-700 border-rose-300',
    emotion: '무기력과 멍함',
    intensity: 5,
    content: '아침에 알람이 울려도 몸이 침대에서 떨어지질 않아요. 시험 기간인데 책을 펴도 글자가 눈에 안 들어오고, 그냥 멍하니 천장만 바라봅니다. 아무것도 하기 싫고 세상 모든 게 버거워요.',
    createdAt: '2시간 전',
    likes: {
      hug: 95,
      warmth: 67,
      youCanDoIt: 40,
    },
    comments: [
      {
        id: 'c-5',
        nickname: '충전 중인 판다',
        text: '그건 게으른 게 아니라 마음의 배터리가 방전된 거예요. 스스로를 채찍질하지 마시고 오늘 하루는 죄책감 없이 푹 주무세요.',
        createdAt: '1시간 전',
      }
    ]
  },
  {
    id: 'worry-5',
    category: '자취/생활',
    nickname: '원룸 302호',
    avatarColor: 'bg-sky-100 text-sky-700 border-sky-300',
    emotion: '적적함과 경제적 압박',
    intensity: 3,
    content: '월세 내고 관리비 내고 알바비 정산하면 통장에 10만 원 남네요. 편의점 삼각김밥으로 끼니 때우다가 엄마가 반찬 보낸 택배 열어보고 혼자 주저앉아 울었습니다. 자취가 이렇게 서러운 줄 몰랐어요.',
    createdAt: '3시간 전',
    likes: {
      hug: 110,
      warmth: 89,
      youCanDoIt: 62,
    },
    comments: [
      {
        id: 'c-6',
        nickname: '자취 4년차 고인물',
        text: '엄마 반찬 상자 열었을 때 눈물 나는 거 진짜 국룰이죠... 엄마 반찬 밥에 꼭 비벼서 든든하게 드세요. 우리 청춘 고생한 만큼 반드시 활짝 필 겁니다!',
        createdAt: '2시간 전',
      }
    ]
  }
];

export const DAILY_CHEER_CAPSULES: CheerCard[] = [
  {
    id: 'cheer-1',
    title: '완벽하지 않아도 당신은 눈부십니다',
    message: '남들의 속도에 맞추느라 숨 가쁘게 달리지 않아도 돼요. 들꽃은 저마다 피어나는 계절이 다릅니다. 오늘의 당신도 충분히 아름답고 값진 하루를 보냈습니다.',
    tag: '#속도보다방향 #토닥토닥',
    quote: '가장 짙은 어둠도 가장 작은 촛불 하나를 이기지 못한다.',
    theme: 'amber'
  },
  {
    id: 'cheer-2',
    title: '당신의 봄은 아직 오지 않았을 뿐입니다',
    message: '지금 마주한 수많은 시험과 서류 탈락은 당신의 끝이 아니라 이야기의 도입부일 뿐이에요. 주인공은 원래 위기를 겪고 더 멋지게 비상하니까요.',
    tag: '#청춘응원 #포기하지않기',
    quote: '바람이 불지 않을 때 바람개비를 돌리는 방법은 앞으로 달려 나가는 것이다.',
    theme: 'emerald'
  },
  {
    id: 'cheer-3',
    title: '오늘 밤은 스스로에게 칭찬 한마디',
    message: '오늘 하루도 지하철을 타고, 강의를 듣고, 버텨낸 당신. 아무것도 이룬 게 없는 것 같아도 "살아낸 것" 자체가 가장 위대한 성취입니다.',
    tag: '#오늘도수고했어 #토닥임',
    quote: '그대여 아무 걱정하지 말아요, 우리 함께 노래합시다.',
    theme: 'indigo'
  },
  {
    id: 'cheer-4',
    title: '잠시 멈춰 서서 숨을 골라도 괜찮아요',
    message: '마라톤에서도 급수대에서 물을 마시며 숨을 고르는 시간이 필요합니다. 번아웃이 왔다면 쉬어가라는 마음의 신호예요. 죄책감 없이 푹 쉬세요.',
    tag: '#마음쉼표 #자기자비',
    quote: '쉼표가 있어야 아름다운 음악이 완성된다.',
    theme: 'rose'
  },
  {
    id: 'cheer-5',
    title: '당신은 언제나 사랑받을 자격이 있습니다',
    message: '학점이나 스펙, 성적으로 당신의 가치를 재단하지 마세요. 당신은 그 자체로 세상에 단 하나뿐인 소중한 존재입니다.',
    tag: '#자존감회복 #존재의이유',
    quote: '너라는 꽃이 피어나길 세상이 기다리고 있어.',
    theme: 'purple'
  }
];

export const CAMPUS_NICKNAMES = [
  '새벽 열람실 17번',
  '아아메 수혈 중인 2학년',
  '과제 마감 1시간 전',
  '도서관 3층 커피러버',
  '학점 복구 위원회',
  '통학 왕복 3시간러',
  '혼밥 레벨 99 새내기',
  '취준 4학년의 한숨',
  '충전이 필요한 판다',
  '원룸 302호 자취생',
  '팀플 탈출 희망자',
  '졸업 논문 쓰는 부엉이',
  '장학금 사냥꾼 다람쥐',
  '내일 1교시 어쩌지',
];

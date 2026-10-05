import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.resolve(__dirname, 'data');
const WORRIES_FILE = path.resolve(DATA_DIR, 'worries.json');

const INITIAL_SEED_WORRIES = [
  {
    id: 'worry-1',
    category: '진로/취업',
    nickname: '새벽 열람실 17번',
    avatarColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    emotion: '막막함과 자책',
    intensity: 4,
    content: '올해 4학년 2학기인데 서류를 12군데 넣고 전부 불합격 통보를 받았어요. 부모님께는 다 잘되고 있다고 거짓말했는데, 도서관 화장실에서 혼자 펑펑 울었습니다. 남들은 다 앞서가는데 저만 멈춰 있는 빈 껍데기 같아요...',
    createdAt: '10분 전',
    likes: { hug: 42, warmth: 38, youCanDoIt: 51 },
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
    likes: { hug: 88, warmth: 46, youCanDoIt: 72 },
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
    likes: { hug: 63, warmth: 55, youCanDoIt: 34 },
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
    likes: { hug: 95, warmth: 67, youCanDoIt: 40 },
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
    likes: { hug: 110, warmth: 89, youCanDoIt: 62 },
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

function initStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(WORRIES_FILE)) {
      fs.writeFileSync(WORRIES_FILE, JSON.stringify(INITIAL_SEED_WORRIES, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to initialize storage:', err);
  }
}

function readWorries(): any[] {
  try {
    if (!fs.existsSync(WORRIES_FILE)) {
      initStorage();
    }
    const data = fs.readFileSync(WORRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading worries file:', err);
    return INITIAL_SEED_WORRIES;
  }
}

function writeWorries(worries: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(WORRIES_FILE, JSON.stringify(worries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing worries file:', err);
  }
}

initStorage();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// REST API for Worries Data Persistence
// GET all worries
app.get('/api/worries', (req, res) => {
  try {
    const worries = readWorries();
    res.json(worries);
  } catch (err: any) {
    res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
  }
});

// POST new worry
app.post('/api/worries', (req, res) => {
  try {
    const newWorry = req.body;
    if (!newWorry || !newWorry.content) {
      return res.status(400).json({ error: '고민 내용이 필요합니다.' });
    }

    const worries = readWorries();
    const createdWorry = {
      ...newWorry,
      id: newWorry.id || `worry-${Date.now()}`,
      createdAt: newWorry.createdAt || '방금 전',
      likes: newWorry.likes || { hug: 0, warmth: 0, youCanDoIt: 0 },
      comments: newWorry.comments || [],
    };

    const updated = [createdWorry, ...worries];
    writeWorries(updated);

    res.status(201).json(createdWorry);
  } catch (err: any) {
    console.error('Error saving worry:', err);
    res.status(500).json({ error: '고민 저장 중 오류가 발생했습니다.' });
  }
});

// POST reaction to worry
app.post('/api/worries/:id/reactions', (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'hug' | 'warmth' | 'youCanDoIt'

    if (!['hug', 'warmth', 'youCanDoIt'].includes(type)) {
      return res.status(400).json({ error: '올바른 리액션 타입이 아닙니다.' });
    }

    const worries = readWorries();
    const worryIndex = worries.findIndex((w) => w.id === id);

    if (worryIndex === -1) {
      return res.status(404).json({ error: '해당 고민을 찾을 수 없습니다.' });
    }

    const currentLikes = worries[worryIndex].likes || { hug: 0, warmth: 0, youCanDoIt: 0 };
    currentLikes[type] = (currentLikes[type] || 0) + 1;
    worries[worryIndex].likes = currentLikes;

    writeWorries(worries);
    res.json({ success: true, likes: currentLikes, worry: worries[worryIndex] });
  } catch (err: any) {
    console.error('Error updating reaction:', err);
    res.status(500).json({ error: '리액션 반영 중 오류가 발생했습니다.' });
  }
});

// POST comment to worry
app.post('/api/worries/:id/comments', (req, res) => {
  try {
    const { id } = req.params;
    const { nickname, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: '댓글 내용이 필요합니다.' });
    }

    const worries = readWorries();
    const worryIndex = worries.findIndex((w) => w.id === id);

    if (worryIndex === -1) {
      return res.status(404).json({ error: '해당 고민을 찾을 수 없습니다.' });
    }

    const newComment = {
      id: `comm-${Date.now()}`,
      nickname: nickname || '따뜻한 캠퍼스 벗',
      text: text.trim(),
      createdAt: '방금 전',
    };

    if (!worries[worryIndex].comments) {
      worries[worryIndex].comments = [];
    }
    worries[worryIndex].comments.push(newComment);

    writeWorries(worries);
    res.status(201).json({ success: true, comment: newComment, worry: worries[worryIndex] });
  } catch (err: any) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: '댓글 작성 중 오류가 발생했습니다.' });
  }
});

// AI Counseling API
app.post('/api/counsel', async (req, res) => {
  try {
    const { category, emotion, story, intensity, nickname } = req.body;

    if (!story || typeof story !== 'string' || story.trim().length === 0) {
      return res.status(400).json({ error: '고민 내용을 입력해주세요.' });
    }

    const prompt = `
당신은 대한민국 대학생들의 마음을 가장 따뜻하고 깊이 있게 어루만져 주는 전문 청년 심리상담 멘토 '토닥이'입니다.
학업, 학점, 스펙, 취업, 팀플, 인간관계, 자취, 경제적 부담 등으로 지치고 불안한 20대 대학생의 마음에 깊이 귀를 기울여 주세요.

[내담자 정보]
- 익명 닉네임: ${nickname || '지친 대학생'}
- 고민 분야: ${category || '일상/기타'}
- 현재 감정: ${emotion || '답답하고 지침'}
- 고민의 무게감: 5점 만점 중 ${intensity || 3}점
- 내담자의 이야기:
"${story}"

[답변 작성 지침]
1. 섣부른 조언이나 "노력하면 된다" 같은 훈계는 절대 하지 마세요. 먼저 이 학생이 겪었을 고통과 외로움을 온전히 인정하고 안아주세요.
2. 대학생의 현실적인 맥락(캠퍼스 라이프, 치열한 경쟁, 불확실한 미래에 대한 불안 등)에 깊이 공감해주세요.
3. 심리학적 관점(인지 재구성, 자기자비/Self-Compassion)에서 학생이 자책하지 않고 자신의 가치를 다시 느낄 수 있도록 부드러운 시각을 건네주세요.
4. 당장 오늘 실천할 수 있는 부담 없는 1분 힐링 미션(작은 행동 3가지)을 제안하세요.
5. Google Chat이나 메신저로 간직하거나 친구들과 나눌 수 있는 감동적인 '나만의 맞춤 응원 문장'을 선물하세요.

반드시 유효한 JSON 형식으로만 응답해 주세요. (마크다운 백틱 없이 순수 JSON만 출력)
{
  "empathySummary": "내담자의 속마음을 한 줄로 보듬어주는 공감의 첫마디 (예: 혼자서 그 모든 짐을 버티느라 얼마나 외롭고 숨찼을까요...)",
  "deepComfort": "마음을 어루만지는 2~3문단의 심층 위로와 따뜻한 경청 메시지 (존댓말, 부드럽고 다정한 어조)",
  "psychologicalReframing": "내담자가 스스로를 갉아먹지 않도록 돕는 자기자비와 긍정적 재해석",
  "microActions": [
    { "title": "실천 1 제목", "description": "구체적인 실천 팁 (부담 없고 소소한 것)" },
    { "title": "실천 2 제목", "description": "구체적인 실천 팁" },
    { "title": "실천 3 제목", "description": "구체적인 실천 팁" }
  ],
  "pocketCheer": "책상 앞 포스트잇에 적어두고 싶은 한 줄의 강력한 위로와 응원",
  "recommendedQuote": "따뜻함을 주는 명언이나 문장 한 줄"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      // Fallback if parsing fails
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = {
          empathySummary: '그동안 혼자 견디느라 정말 고생 많으셨어요.',
          deepComfort: responseText,
          psychologicalReframing: '당신은 지금 이 순간에도 충분히 가치 있는 사람입니다.',
          microActions: [
            { title: '따뜻한 물 한 잔 마시기', description: '천천히 목을 축이며 긴장된 몸을 이완해 보세요.' },
            { title: '스마트폰 10분 내려놓기', description: '외부의 비교와 소음에서 벗어나 나만의 숨을 쉬어보세요.' },
            { title: '스스로에게 괜찮다고 말해주기', description: '오늘 하루도 버텨낸 나에게 토닥토닥 위로를 건네보세요.' }
          ],
          pocketCheer: '넘어져도 괜찮아요, 잠시 쉬어가는 풀밭일 뿐이니까요.',
          recommendedQuote: '흔들리지 않고 피는 꽃이 어디 있으랴.'
        };
      }
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('Error generating counsel:', error);
    res.status(500).json({
      error: '위로 메시지를 작성하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error?.message,
    });
  }
});

// Quick Cheer Capsule API
app.post('/api/cheer', async (req, res) => {
  try {
    const { situation, mood } = req.body;
    const prompt = `
대학생을 위한 3초 즉석 마음 충전 응원 메시지를 작성해주세요.
상황: ${situation || '오늘 하루도 수고한 대학생'}
기분: ${mood || '지침'}

JSON 형식으로 응답:
{
  "title": "한 줄 제목",
  "message": "따뜻하고 힘이 나는 3-4문장의 위로",
  "tag": "#태그",
  "cheerQuote": "마음에 꽂히는 격려 문구"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.error('Error in cheer API:', error);
    res.status(500).json({
      title: '당신을 위한 응원',
      message: '오늘 하루도 견뎌내느라 정말 수고했어요. 당신의 노력을 늘 기억하고 있어요.',
      tag: '#오늘도수고했어',
      cheerQuote: '너는 네가 생각하는 것보다 훨씬 더 강하고 빛나는 사람이야.'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

export interface IUserVerify {
  user: IUser;
}

interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  iconImg: string;
  isAlowed: boolean;
  emailStatus: boolean;
  code: string;
  yourQuiz: Quiz[];
}

interface Quiz {
  id: string;
  title: string;
  img?: string;
  userId: string;
  user: IUser;
  quests: Quest[];
}

interface Quest {
  id: string;
  title: string;
  type: string;
  img?: string;
  quizId: string;
  quiz: Quiz;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  questId: string;
  quest: Quest;
}

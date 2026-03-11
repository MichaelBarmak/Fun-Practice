import questions from '../../data/questions.json';
import AppClient from '../components/AppClient';

export default function Home() {
  return <AppClient questions={questions} />;
}

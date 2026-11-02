import { questions } from '@/data/questions';

export default function Discovery() {
  return <section className="discovery section" id="questions" aria-labelledby="questions-title">
    <div className="discovery-intro"><span className="discovery-label">A little clarity</span><h2 id="questions-title">Before we<br/><em>make a start.</em></h2><p>Social media and creative production for brands in Mumbai and across India.</p><div className="discovery-links"><a href="/services">Explore all services <span aria-hidden="true">↗</span></a><a href="/work">Watch the film library <span aria-hidden="true">↗</span></a></div></div>
    <div className="discovery-questions">{questions.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
  </section>;
}

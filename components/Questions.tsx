import type { Question } from '@/data/service-questions';

export default function Questions({ items }: { items: readonly Question[] }) {
  return <div className="discovery-questions">{items.map(item =>
    <details id={item.id} key={item.id}>
      <summary>{item.question}</summary>
      <p>{item.answer}</p>
      {item.link && <a className="content-action" href={item.link.href}>{item.link.label} <span aria-hidden="true">↗</span></a>}
    </details>
  )}</div>;
}

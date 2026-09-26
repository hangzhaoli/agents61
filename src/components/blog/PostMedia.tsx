import type { BlogTable, BlogVisual } from '@/lib/blog';

export function PostMedia({
  visuals,
  tables,
}: {
  visuals?: BlogVisual[];
  tables?: BlogTable[];
}) {
  return (
    <>
      {visuals?.map((visual) => (
        <figure key={visual.title} className="desk-figure">
          <h2>{visual.title}</h2>
          {visual.intro ? <p className="text-sm text-slate-600 leading-relaxed mb-2">{visual.intro}</p> : null}
          <ol>
            {visual.gates.map((gate) => (
              <li key={gate.n} className="desk-gate">
                <span className="desk-gate-n">{gate.n}</span>
                <div>
                  <h3>{gate.question}</h3>
                  <div className="desk-split">
                    <p className="desk-pass">
                      <strong>Pass. </strong>
                      {gate.pass}
                    </p>
                    <p className="desk-fail">
                      <strong>Stop. </strong>
                      {gate.fail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </figure>
      ))}
      {tables?.map((table) => (
        <div key={table.caption}>
          <div className="desk-scroll">
            <table className="desk-table">
              <caption>{table.caption}</caption>
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th key={col} scope="col">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row) => (
                  <tr key={row.join('|')}>
                    {row.map((cell, i) => (
                      <td key={`${row[0]}-${i}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.footnote ? <p className="desk-note">{table.footnote}</p> : null}
        </div>
      ))}
    </>
  );
}

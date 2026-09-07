/** Bounded parallel map. Workers share one incrementing index. */

export async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (!items.length) return [];
  const out: R[] = new Array(items.length);
  let next = 0;
  const n = Math.max(1, Math.min(limit, items.length));

  async function worker() {
    while (true) {
      const i = next;
      next += 1;
      if (i >= items.length) return;
      out[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: n }, () => worker()));
  return out;
}

export function buildSortOrderUpdates<T extends string>(
  orderedKeys: T[],
): Array<{ key: T; sortOrder: number }> {
  return orderedKeys.map((key, index) => ({
    key,
    sortOrder: index,
  }));
}

export function moveItemInOrder<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);

  return next;
}

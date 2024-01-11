interface Props<K> {
    onChange: (name: keyof K) => void;
    categories: (keyof K)[] | "all";
}

function CategoryFilter<K> ({onChange, categories}: Props<K>) {
  return (
    <div>CategoryFilter</div>
  )
}

export default CategoryFilter
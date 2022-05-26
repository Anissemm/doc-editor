const Leaf = ({ attributes, children, leaf }) => {
  console.log(leaf?.highlighted)
  const { fontSize } = leaf
  let styles = fontSize ? { fontSize: `${fontSize}px` } : {}

  if (leaf.bold) {
    children = <strong style={styles}>{children}</strong>
  }

  if (leaf.code) {
    children = <code style={styles}>{children}</code>
  }

  if (leaf.italic) {
    children = <em style={styles}>{children}</em>
  }

  if (leaf.underline) {
    children = <u style={styles}>{children}</u>
  }

  return <span style={styles} {...attributes}>{children}</span>
}

export default Leaf